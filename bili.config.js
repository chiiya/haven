const path = require("path");

const ESM = process.env.ESM === 'true';

module.exports = {
  input: {
    haven: path.resolve(__dirname, `./src/index.${ESM ? 'esm' : 'umd'}.ts`)
  },
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
    yaml: true,
  }
};

