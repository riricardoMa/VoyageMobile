module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
    [
      'react-native-iconify/babel',
      {
        icons: [
          'ic:outline-email',
          'material-symbols:error-outline'
        ],
      },
    ],
  ],
  };
}; 