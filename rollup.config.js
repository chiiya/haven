import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import yaml from '@rollup/plugin-yaml';

const pkg = require('./package.json');
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: 'src/index.esm.ts',
  output: {
    dir: 'dist/esm',
    format: 'esm',
  },
  plugins: [
    resolve({ extensions }),
    babel({
      extensions,
      include: ['src/**/*'],
    }),
    yaml({
      include: 'src/**',
    }),
  ],
  preserveModules: true,
};
