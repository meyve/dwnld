const { resolve } = require("path")
const ProgressBarPlugin = require("progress-bar-webpack-plugin")

const ROOT_DIR = resolve(__dirname, "./")
const SRC_DIR = resolve(ROOT_DIR, "./src")

module.exports = {
  name: "dwnld",
  target: "web",
  mode: "production",

  entry: resolve(SRC_DIR, "./index.js"),

  output: {
    path: resolve(ROOT_DIR, "./dist"),
    filename: "index.js",
    publicPath: "/"
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: "pre",
        loader: "eslint-loader",
        options: { cache: true, useEslintrc: true },
        exclude: /node_modules/
      },
      {
        test: /\.(js)$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        },
        exclude: /node_modules/
      }
    ]
  },

  plugins: [new ProgressBarPlugin()]
}
