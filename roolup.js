const rollup = require("rollup"),
  resolve = require("@rollup/plugin-node-resolve");
let inputOptions = {
    input: "./node_modules/rxjs/_esm5/index.js",
  },
  outputOptions = {
    file: "./vite/index.js",
    format: "esm",
  };
async function build(input = {}, output = {}, cache) {
  const bundle = await rollup.rollup(Object.assign({}, inputOptions, input));
  await bundle.write(Object.assign({}, outputOptions, output));
  Object.assign(cache, {
    input,
    output,
  });
}
module.exports = build;
