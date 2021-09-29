import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const rollupConfig = (name, options = { file: 'index', umd: true }) => {
  return [
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
            '@babel/proposal-class-properties',
            ['@babel/plugin-transform-runtime', { version: '^7.11.2' }],
          ],
        }),
        nodeResolve({
          extensions,
        }),
      ],
      preserveModules: true,
      external: /@anshin|(@babel\/runtime)|alpinejs/,
    },
    ...(options.umd ? [
      {
        input: 'src/index.umd.ts',
        output: {
          file: `dist/${options.file}.js`,
          format: 'umd',
          name: name,
        },
        plugins: [
          babel({
            extensions,
            include: ['src/**/*'],
            babelHelpers: 'inline',
            plugins: ['@babel/proposal-class-properties'],
          }),
          replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
          }),
          nodeResolve({
            extensions,
          }),
          commonjs(),
          terser(),
        ],
      },
    ] : []),
  ];
};

export default rollupConfig;
