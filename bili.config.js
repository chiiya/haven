const path = require("path");

const ESM = process.env.ESM === 'true';

module.exports = {
  input: {
    haven: path.resolve(__dirname, `./src/index.${ESM ? 'esm' : 'umd'}.ts`),
  },
  banner: true,
  output: {
    format: [ESM ? 'esm' : 'umd-min'],
    moduleName: 'haven',
    dir: 'dist',
  },
  plugins: {
    yaml: {
      include: 'src/**',
    },
    typescript2: {
      tsconfigOverride: {
        compilerOptions: {
          declaration: ESM
        }
      }
    },
    copy: {
      targets: [
        { src: 'src/themes/haven-theme-default.css', dest: 'dist/themes' },
        { src: 'src/themes/haven-theme-detached.css', dest: 'dist/themes' },
      ]
    },
  }
};

