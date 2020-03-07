import pkg from "./package.json";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";

const usualPlugins = [
  replace({
    "__version__": pkg.version
  }),
  typescript()
];
const sourcemapGenerator = {
  sourcemap: "hidden"
};

export default [
  {
    input: "src/main.ts",
    output: {
      name: "pappel-components",
      file: pkg.browser,
      format: "umd",
      ...sourcemapGenerator,
      noConflict: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      ...usualPlugins
    ]
  },
  {
    input: "src/main.ts",
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
  }

]
