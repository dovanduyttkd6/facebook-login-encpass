const webpack = require("webpack");
module.exports = {
  entry: "./src/encpass.js",
  output: {
    path: __dirname + "/build",
    filename: "encpass.web.js",
    library: {
      name: "fb",
      type: "umd2",
    },
  },
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  node: {
    global: true,
  },
  mode: "production",
};
