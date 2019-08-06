const path = require("path");

module.exports = {
  input: path.resolve(__dirname, './src/index.ts'),
  banner: true,
  output: {
    format: ['cjs', 'esm'],
    extractCSS: false,
  },
  plugins: {
    typescript2: {
      tsconfigOverride: {
        include: ['src']
      }
    },
  }
};
