import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    babel({
      extensions,
      include: ['src/**/*'],
      babelHelpers: 'runtime',
      plugins: [
        "@babel/proposal-class-properties",
        ["@babel/plugin-transform-runtime", { version: '^7.11.2' }],
      ],
    }),
    nodeResolve({
      extensions,
    }),
  ],
  preserveModules: true,
  external: /(@babel\/runtime)/
};
