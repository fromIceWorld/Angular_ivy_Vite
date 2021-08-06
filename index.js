const http = require("http"),
  path = require("path"),
  fs = require("fs"),
  utils = require("./utils"),
  Rollup = require("./roolup"),
  ts_loader = require("./ts-compiler");
htmlPath = path.resolve(__dirname, "src/index.html");
// ------------Rollup 预编译 package.json中 dependencies
const package = require("./package.json");
const dependencies = package.dependencies;
for (let key in dependencies) {
  console.log(`正在预编译${key}....`);
  const prefix = path.resolve(__dirname, "node_modules", key);
  const module =
    require(prefix + "/package.json").fesm2015_ivy_ngcc ||
    require(prefix + "/package.json").module ||
    require(prefix + "/package.json").browser; // 文件位置,zone.js 是 browser
  console.log(module);
  const filePath = path.resolve(prefix, module);
  const inputOptions = {
      input: filePath,
    },
    outOptions = {
      file: "./vite/" + (key.endsWith(".js") ? key : key + ".js"),
    };
  Rollup(inputOptions, outOptions);
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
    // 处理 后缀
    if (!filePath.endsWith(".js")) {
      filePath += ".js";
    }
    getComponentOrModule(filePath, res);
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
