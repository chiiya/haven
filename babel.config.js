const ESM = process.env.ESM === 'true';

if (!ESM) {
  module.exports = {
    presets: [
      [
        require('@babel/preset-env').default,
        {
          targets: {
            browsers: '> 1%, IE 11, not dead',
          },
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3,
          exclude: ['transform-regenerator', 'transform-async-to-generator'],
        },
      ],
    ],
  };
}
