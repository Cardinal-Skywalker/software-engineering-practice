const path = require("path");
const { merge } = require("webpack-merge")
const BaseWebpackConf = require("./webpack.base.conf")
const copyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require("terser-webpack-plugin")

const consoleObj = function () {
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV == "production") {
    return {
      // 多进程
      parallel: true,
      // 删除注释
      extractComments: false,
      terserOptions: {
        compress: {
          // 生产环境去除console
          drop_console: true,
          drop_debugger: true
        }
      }
    };
  } else {
    return {
      // 多进程
      parallel: true
    };
  }
};

function resolve(dir) {
  return path.join(__dirname, "..", dir)
}

module.exports = merge(BaseWebpackConf, {
  mode: "production", // 发布模式
  // devtool: "nosources-source-map",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "assets/js/[name].[contenthash:6].js",
    clean: true
  },
  // devServer: {
  //   proxy:{
  //     context: ['/api'],
  //     target: 'http://103.133.176.168:8080',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api': '' },
  //   }
  // },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin(consoleObj())
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // 用来做模板的html的文件路径
      filename: "index.html", // 生成的html的名字
      title: process.env.VUE_WEB_TITLE, // 这个就对应上文的title
      inject: "body", // 打包出来的那个js文件，放置在生成的body标签内
      minify: {
        collapseWhitespace: true, // 去掉空格
        removeComments: true // 去掉注释
      }
    }),
    // 静态资源输出到根目录
    new copyWebpackPlugin({
      patterns: [
        {
          from: resolve("/public"),
          to: resolve("/dist"), //放到output文件夹下
          globOptions: {
            dot: true,
            gitignore: false,
            ignore: [
              // 配置不用copy 的文件
              "**/index.html"
            ]
          }
        }
      ]
    })
  ]
})