const path = require("path");

const ESM = process.env.ESM === 'true';

module.exports = {
  input: path.resolve(__dirname, './src/index.ts'),
  banner: true,
  output: {
    format: [ESM ? 'esm' : 'umd-min'],
    moduleName: 'haven',
    dir: 'dist',
  },
  plugins: {
    typescript2: {
      tsconfigOverride: {
        compilerOptions: {
          declaration: ESM
        }
      }
    },
  }
};

