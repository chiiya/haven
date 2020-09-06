const path = require('path');

module.exports = {
  input: {
    anshin: path.resolve(__dirname, `./src/index.ts`)
  },
  banner: true,
  output: {
    format: 'umd-min',
    moduleName: 'anshin',
    dir: 'dist',
    extractCSS: false,
  },
  plugins: {
    typescript2: {
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          sourceMap: true,
        }
      }
    },
  }
};

