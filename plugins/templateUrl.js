// 解析 .ts文件中的Urls[templateUrl, styleUrls],将Url转换为 template 和 styles
const path = require("path"),
  fs = require("fs");

function pathRewrite(rootPath, childPath) {
  let rootPathArr = rootPath.split("\\"),
    result;
  if (childPath.startsWith("./")) {
    rootPathArr.pop();
    result = path.resolve(rootPathArr.join("\\"), childPath);
  } else if (childPath.startsWith("../")) {
    rootPathArr.pop();
    function resolveDep(child) {
      if (child.startsWith("../")) {
        rootPathArr.pop();
        child = child.slice(3);
        resolveDep(child);
      } else {
        result = path.resolve(rootPathArr.join("\\"), child);
      }
    }
    resolveDep(childPath);
  }
  return result;
}

let styleCache = new Map();
// 处理 css 内部引入 @import url("css/style.css") 链
function resolveImportCSS(cssPath, content) {
  let linkStyles = new Set();
  function searchImportCSS(styleURL, CSS) {
    CSS.replace(/\@import\s*url\(['|"]*([^'"]+)['|"]*\)\;/g, ($0, $1) => {
      let childPath = pathRewrite(styleURL, $1);
      if (!linkStyles.has(childPath)) {
        let child = fs.readFileSync(childPath, "utf-8");
        linkStyles.add(child);
        styleCache.set(childPath, child);
        searchImportCSS(childPath, child);
      }
    });
  }
  searchImportCSS(cssPath, content);
  let allStyles = "";
  for (let style of linkStyles.keys()) {
    allStyles += style.replace(/\@import\s*url\(['|"]*([^'"]+)['|"]*\)\;/g, "");
  }
  return `${allStyles}`;
}

// 处理 stylesUrls:["**", "**"] 及其内部引入的其他css : @import url("css/style.css");
//  templateURL:"**"
function resolveUrl(pathRoot, content) {
  let rewriteStylesURL = content.replace(
    /styleUrls:\s*\[([^\[\]]+)\]/,
    ($0, $1) => {
      if ($1) {
        let result = [];
        let filePaths = $1.split(",");
        for (let filePath of filePaths) {
          //   处理路径关系
          let childPath = pathRewrite(
            pathRoot,
            filePath.replace(/['|"|\s]/g, "")
          );
          let child = fs.readFileSync(childPath, "utf-8");
          let childAndImport = resolveImportCSS(childPath, child);
          result.push(
            "`" +
              childAndImport +
              child.replace(/\@import\s*url\(['|"]*([^'"]+)['|"]*\)\;/g, "") +
              "`"
          );
        }
        return `styles : [${result.join(",")} ]`;
      }
    }
  );
  //   处理 htmlURL[需注意,依赖的注释也会被解析到]
  return rewriteStylesURL.replace(
    /templateUrl:\s*['|"]([^"']+)['|"]/,
    ($0, $1) => {
      if ($1) {
        console.log(pathRoot, $1);
        let filePath = pathRewrite(pathRoot, $1);
        let contentString = "`" + fs.readFileSync(filePath, "utf-8") + "`";
        return `template: ${contentString}`;
      }
    }
  );
}

module.exports = { resolveUrl };
