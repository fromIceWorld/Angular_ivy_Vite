const fs = require("fs"),
  path = require("path");

// 判断 path 下 是目录还是文件
function fileStats(path) {
  const stat = fs.statSync(path);
  return stat.isDirectory();
}
// 规划 url
function ruleURL(dirName, url) {
  if (url.endsWith(".js") || url.endsWith(".ts")) {
    return path.resolve(dirName, url);
  }
  let splitUrl = url.replace(/^\//, ""); //去除绝对路径
  let pathArray = splitUrl.split("/"),
    name = pathArray[pathArray.length - 1]; //分割路径
  if (pathArray.length == 1) {
    // 当前路径下 name是文件还是目录
    return getIndex(dirName, [""], name);
  } else {
    // 回溯上级路径下的 name是文件还是目录
    return getIndex(dirName, pathArray.slice(0, pathArray.length - 1), name);
  }

  // url 只有路径，没有后缀【路径即指向.js|.ts文件, url指向目录，自动识别目录下的index文件【js，ts】】
}
// 查询目录下的 index.js|ts
function getIndex(dirName, url, fileName) {
  const urls = path.resolve(dirName, ...url);
  const files = fs.readdirSync(path.resolve(dirName, ...url));
  if (files.includes(fileName)) {
    return searchInDir(path.resolve(dirName, ...url, fileName));
  } else if (files.includes(fileName + ".js")) {
    return path.resolve(dirName, ...url, fileName + ".js");
  } else if (files.includes(fileName + ".ts")) {
    return path.resolve(dirName, ...url, fileName + ".ts");
  }
}
// 目录中查找 index.js|ts
function searchInDir(dirName) {
  const files = fs.readdirSync(dirName);
  if (files.includes("index.js")) {
    return path.resolve(dirName, "index.js");
  } else if (files.includes("index.ts")) {
    return path.resolve(dirName, "index.ts");
  }
}
// 重写 js文件中的 import，使指向 固定文件。
function rewriteImports(content) {
  return content.replace(
    /(\{[^\{\}]+\})\s*from\s*['|"]([^'"]+)['|"]/g,
    function ($0, $1, $2) {
      if ($2.indexOf("/@/") !== 0) {
        console.log($2);
        return ` ${$1} from '/@modules/${$2}'`;
      } else {
        return $0;
      }
    }
  );
}

// 衍生依赖判定
function depsUnResolve(keys, key) {
  let parent = "";
  keys.forEach((element) => {
    if (key.indexOf(element + "/") == 0 && key !== element) {
      parent = element;
      return;
    }
  });
  return parent;
}

module.exports = { fileStats, ruleURL, rewriteImports, depsUnResolve };
