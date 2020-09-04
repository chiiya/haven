const path = require("path");

module.exports = {
  input: {
    haven: path.resolve(__dirname, `./src/index.ts`)
  },
  banner: true,
  output: {
    dir: 'dist',
    extractCSS: false,
  },
  plugins: {
    typescript: {
      compilerOptions: {
        declaration: false,
        sourceMap: true,
      }
    },
  }
};

