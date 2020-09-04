import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: 'src/index.esm.ts',
  output: {
    dir: 'dist/esm',
    format: 'esm',
  },
  plugins: [
    nodeResolve({ extensions }),
    babel({
      extensions,
      include: ['src/**/*'],
    }),
  ],
  preserveModules: true,
};
