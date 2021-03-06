const http = require("http"),
  path = require("path"),
  fs = require("fs"),
  utils = require("./utils"),
  Rollup = require("./roolup"),
  resolve = require("@rollup/plugin-node-resolve"),
  commonRollup = require("rollup-plugin-commonjs");
ts_loader = require("./ts-compiler");
let dependenciesCache = {};
htmlPath = path.resolve(__dirname, "src/index.html");
// ------------Rollup 预编译 package.json中 dependencies; 但是还有另外一种情况，使用的是依赖的衍生功能，未在 dependencies
//  例如：rx/oprators;此种情况，特殊考虑，【如果请求的url 是已知的依赖的子集，构建新依赖】
const package = require("./package.json");
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
function getComponentOrModule(path, res, rewrite) {
  fs.readFile(path, (err, data) => {
    if (err) {
      res.writeHead(404, {
        "content-type": "text/javascript",
      });
      res.write("<h1>页面不存在</h1>");
    } else {
      res.writeHead(200, {
        "content-type": "text/javascript",
      });
      let result = rewrite
        ? utils.rewriteImports(data.toString())
        : data.toString();

      const js = path.endsWith(".ts") ? ts_loader(result) : result;
      res.write(js || "");
      res.end();
    }
  });
}
// 处理返回 图片类
function getImage(path, res) {
  fs.readFile(path, (err, data) => {
    if (err) {
      res.writeHead(404, {
        "content-type": 'text/html;charset="utf-8"',
      });
      res.write("<h1>图标不存在</h1>");
    } else {
      res.writeHead(200, {
        "content-type": "image/png",
      });
      res.write(data);
      res.end();
    }
  });
}
// 返回 index.html
function getIndex(path, res) {
  fs.readFile(path, (err, data) => {
    if (err) {
      res.writeHead(404, {
        "content-type": 'text/html;charset="utf-8"',
      });
      res.write("<h1>页面不存在</h1>");
    } else {
      res.writeHead(200, {
        "content-type": 'text/html;charset="utf-8"',
      });
      res.write(data);
      res.end();
    }
  });
}
const server = http.createServer(function (req, res) {
  let { url } = req,
    filePath;
  if (url == "/index" || url == "/") {
    getIndex(htmlPath, res);
  } else if (
    url.startsWith("/@/") &&
    (url.endsWith(".module") || url.endsWith(".component"))
  ) {
    filePath = path.resolve(__dirname, url.replace(/^\/@\//, ""));
    // Angular 中 ，模块导出 没有ts后缀
    getComponentOrModule(filePath + ".ts", res, true);
  } else if (url.startsWith("/@modules/")) {
    // 模块的文件，去 node_module中查询
    let filePath = path.resolve(
      __dirname,
      url.replace(/^\/@modules\//, "vite/")
    );

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
      filePath = utils.ruleURL(
        __dirname,
        url.replace(/^\/@modules\//, "vite/")
      );
      getComponentOrModule(filePath, res, true);
    }
  } else if (url.endsWith(".ico")) {
    filePath = path.resolve(__dirname, "src", url.replace(/^\//, ""));
    getImage(filePath, res);
  } else if (url.endsWith(".ts")) {
    // 请求main.ts
    filePath = path.resolve(__dirname, url.replace(/^\//, ""));
    getComponentOrModule(filePath, res, true);
  } else if (url.endsWith(".js")) {
    // 请求main.ts
    filePath = path.resolve(__dirname, url.replace(/^\//, ""));
    getComponentOrModule(filePath, res, true);
  } else {
    // 请求路径|文件
    filePath = utils.ruleURL(__dirname, url.replace(/^\/@\//, ""));
    getComponentOrModule(filePath, res, true);
  }
});
server.listen(8888);
console.log("服务启动成功，端口：8888");
