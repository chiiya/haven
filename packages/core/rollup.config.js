import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
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
    external: /(@anshin|deepmerge|immer|zustand|@babel\/runtime)/
  },
  {
    input: 'src/index.iife.ts',
    output: {
      file: 'dist/anshin.iife.js',
      format: 'iife'
    },
    plugins: [
      babel({
        extensions,
        include: ['src/**/*'],
        babelHelpers: 'inline',
        plugins: [
          "@babel/proposal-class-properties"
        ],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      nodeResolve({
        extensions,
      }),
      commonjs(),
      uglify(),
    ],
  }
];
