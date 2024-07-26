const http = require("http"),
  chokidar = require("chokidar"),
  path = require("path"),
  fs = require("fs"),
  ws = require("ws"),
  utils = require("./utils"),
  Rollup = require("./roolup"),
  resolve = require("@rollup/plugin-node-resolve"),
  commonRollup = require("rollup-plugin-commonjs"),
  ts_loader = require("./ts-compiler");
let dependenciesCache = {};
htmlPath = path.resolve(__dirname, "src/index.html");
// ------------Rollup 预编译 package.json中 dependencies; 但是还有另外一种情况，使用的是依赖的衍生功能，未在 dependencies
//  例如：rx/oprators;此种情况，特殊考虑，【如果请求的url 是已知的依赖的子集，构建新依赖】
const package = require("./package.json");
const { resolveUrl } = require("./plugins/templateUrl");
const dependencies = package.dependencies;
for (let key in dependencies) {
  if (dependenciesCache[key]) {
    console.log(`${key}已被预处理`);
  } else {
    console.log(`正在预编译${key}....`);
    const prefix = path.resolve(__dirname, "node_modules", key);
    const module =
      require(prefix + "/package.json").fesm2015_ivy_ngcc ||
      require(prefix + "/package.json").module ||
      require(prefix + "/package.json").browser; // 文件位置,zone.js 是 browser
    const filePath = path.resolve(prefix, module);
    const inputOptions = {
        input: filePath,
      },
      outOptions = {
        file: "./vite/" + (key.endsWith(".js") ? key : key + "/index.js"),
      };
    Rollup(inputOptions, outOptions, (dependenciesCache[key] = {}));
  }
}
// 解析 衍生依赖 rx-> rx/operator
function resolveDep(url) {
  // 衍生依赖的路径

  const prefix = path.resolve(
    __dirname,
    url.replace(/^\/@modules\//, "node_modules/")
  );

  const module =
    require(prefix + "/package.json").fesm2015_ivy_ngcc ||
    require(prefix + "/package.json").module ||
    require(prefix + "/package.json").browser; // 文件位置,zone.js 是 browser
  const filePath = path.resolve(prefix, module);

  const inputOptions = {
      input: filePath,
      plugins: [resolve.nodeResolve(), commonRollup],
    },
    outOptions = {
      file: "./vite/" + url.replace(/^\/@modules\//, "") + "/index.js",
    };
  return Rollup(
    inputOptions,
    outOptions,
    (dependenciesCache[url.replace(/^\/@modules\//, "")] = {})
  );
}
// 根据路径请求 返回数据
function getComponentOrModule(path, res, rewrite, resolveURL) {
  fs.readFile(path, (err, data) => {
    if (err) {
      NotFound(res, "text/javascript");
    } else {
      let result = rewrite
        ? utils.rewriteImports(data.toString())
        : data.toString();

      const js = path.endsWith(".ts") ? ts_loader(result) : result;
      const resolveResult = resolveURL ? resolveUrl(path, js) : js;
      success200(res, resolveResult || "", "text/javascript");
    }
  });
}
// 404
function NotFound(res, contentType) {
  res.writeHead(404, {
    "content-type": contentType,
  });
  res.write("未找到资源");
}
// 200
function success200(res, data, contentType) {
  res.writeHead(200, {
    "content-type": contentType,
    "cache-control": "max-age=10000",
  });
  res.write(data);
  res.end();
}
// 获取资源
function getSource(path, res, contentType) {
  fs.readFile(path, (err, data) => {
    if (err) {
      NotFound(res, contentType);
    } else {
      success200(res, data, contentType);
    }
  });
}

const server = http.createServer(function (req, res) {
  let { url } = req,
    filePath;
  if (url == "/index" || url == "/") {
    filePath = path.resolve(__dirname, "src/index.html");
    getSource(filePath, res, 'text/html;charset="utf-8"');
  } else if (
    url.startsWith("/@/") &&
    (url.endsWith(".module") ||
      url.endsWith(".component") ||
      url.endsWith(".component.ts") ||
      url.endsWith(".module.ts"))
  ) {
    filePath = path.resolve(__dirname, url.replace(/^\/@\//, ""));
    // Angular 中 ，模块导出 没有ts后缀
    getComponentOrModule(
      url.endsWith(".ts") ? filePath : filePath + ".ts",
      res,
      true,
      true
    );
  } else if (url.startsWith("/@modules/")) {
    const realURI = url.replace(/^\/@modules\//, "vite/");
    // 模块的文件，去 node_module中查询
    let filePath = path.resolve(__dirname, realURI);

    // 衍生依赖，rx => rx/oprator
    if (
      utils.depsUnResolve(
        Object.keys(dependenciesCache),
        url.replace(/^\/@modules\//, "")
      )
    ) {
      // 解析衍生依赖，
      resolveDep(url).then(
        (result) => {
          getComponentOrModule(path.resolve(filePath, "index.js"), res, false);
        },
        (err) => {
          console.err(`${url}:衍生依赖解析失败`);
        }
      );
    } else {
      filePath = utils.ruleURL(__dirname, realURI);
      getComponentOrModule(filePath, res, true);
    }
  } else if (url.endsWith(".ico")) {
    filePath = path.resolve(__dirname, "src", url.replace(/^\//, ""));
    getSource(filePath, res, "image/png");
  } else if (url.endsWith(".ts") || url.endsWith(".js")) {
    filePath = path.resolve(__dirname, url.replace(/^\//, ""));
    getComponentOrModule(filePath, res, true);
  } else if (url.endsWith(".css")) {
    filePath = path.resolve(__dirname, url.replace(/^\/@\//, ""));
    getSource(filePath, res, "text/css");
  } else {
    // 请求路径|文件
    filePath = utils.ruleURL(__dirname, url.replace(/^\/@\//, ""));
    getComponentOrModule(filePath, res, true);
  }
});
server.listen(8888);

// websocket
const WebSocket = new ws.Server({ port: 8889 });
WebSocket.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`接收讯息：${message}`);
  });
  // 监听文件, 反馈客户端
  chokidar.watch("src").on("change", (filePath) => {
    console.log(filePath);
    const rewritePath = path.join("/@/", filePath);
    const params = {
      path: rewritePath,
      time: new Date().getTime(),
    };
    ws.send(JSON.stringify(params));
  });
});

console.log("服务启动成功，端口：8888;\n 实时监听src目录下的文件更改");
