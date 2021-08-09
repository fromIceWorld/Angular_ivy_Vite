const rollup = require("rollup"),
  commonRollup = require("rollup-plugin-commonjs");
resolve = require("@rollup/plugin-node-resolve");
let inputOptions = {
    input: "./node_modules/rxjs/_esm5/operators/index.js",
    plugins: [resolve.nodeResolve(), commonRollup],
  },
  outputOptions = {
    file: "./vite/rxjs/operators/index.js",
    format: "esm",
  };
async function build(input = {}, output = {}, cache) {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}
build();
