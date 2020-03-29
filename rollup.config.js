import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";

const usualPlugins = [
  replace({
    "__version__": pkg.version
  }),
  typescript()
];

const sourcemapGenerator = {
  sourcemap: "hidden"
};

const umd = {
  input: "src/pappel-components.ts",
  output: {
    file: pkg.browser,
    format: "umd",
    name: "pappel-components",
    noConflict: true,
    ...sourcemapGenerator
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    ...usualPlugins
  ]
};

const esAndCjs = {
  input: "src/pappel-components.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      ...sourcemapGenerator
    },
    {
      file: pkg.module,
      format: "es",
      ...sourcemapGenerator
    }
  ],
  plugins: [
    ...usualPlugins
  ]
};


export default [
  umd,
  esAndCjs
];
