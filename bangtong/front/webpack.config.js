module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(mp4|webm|ogg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "videos/",
          },
        },
      },
      // 다른 로더 설정
    ],
  },
};
