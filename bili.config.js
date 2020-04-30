const path = require("path");

module.exports = {
  input: {
    haven: path.resolve(__dirname, `./src/index.umd.ts`)
  },
  banner: true,
  output: {
    format: 'umd-min',
    moduleName: 'haven',
    dir: 'dist',
    extractCSS: false,
  },
  plugins: {
    yaml: {
      include: 'src/**',
    },
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

