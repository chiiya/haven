module.exports = {
  presets: [
    [
      require('@babel/preset-env').default,
      {
        targets: {
          browsers: "defaults"
        },
        modules: false,
        useBuiltIns: 'usage',
        forceAllTransforms: true,
        corejs: 3,
        exclude: ['transform-regenerator', 'transform-async-to-generator']
      }
    ],
  ],
};
