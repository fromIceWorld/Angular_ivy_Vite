function transform(content) {
  const result = require("esbuild").transformSync(content, {
    loader: "ts",
  });
  return result.code;
}
module.exports = transform;
