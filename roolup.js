const rollup = require("rollup"),
  resolve = require("@rollup/plugin-node-resolve");
let inputOptions = {
    input: "./node_modules/rxjs/_esm5/index.js",
    plugins: [resolve.nodeResolve()],
  },
  outputOptions = {
    file: "./vite/index.js",
    format: "esm",
  };
async function build(input = {}, output = {}) {
  const bundle = await rollup.rollup(Object.assign({}, inputOptions, input));
  await bundle.write(Object.assign({}, outputOptions, output));
}
module.exports = build;
