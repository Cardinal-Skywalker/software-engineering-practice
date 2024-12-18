// 基础配置
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader/dist/index")

// 优化配置
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")

const webpack = require("webpack");
const envMode = process.env.envMode;
require("dotenv").config({ path: `.env` }) // 执行 .env 文件, 将变量放到process.env上
require("dotenv").config({ path: `.env.${envMode}` }) // 执行 .env.${envMode} 文件, 可覆盖和.env文件相同的部分

// 正则匹配VUE_APP_开头的变量
const prefixRe = /^VUE_APP_/;
let env = {};
for (const key in process.env) {
  // 只有 NODE_ENV, BASE_URL 和以 VUE_APP_ 开头的变量可以通过 webpack.DefinePlugin 静态嵌入到代码文件中
  if (key == "NODE_ENV" || key == "BASE_URL" || prefixRe.test(key)) {
    env[key] = JSON.stringify(process.env[key])
  }
}

function resolve(dir) {
  return path.join(__dirname, "..", dir)
}

module.exports = {
  entry: path.resolve(__dirname, "../src/main.js"), // 入口文件，打包从这个文件开始
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, "../dist"), // 出口文件，打包生成的文件放置到这个文件夹下
    filename: "./js/[name].[chunkhash.6].js", //打包成的文件名。name取的原始文件名，chunkhash生成哈希值，这样每次打包出来不一样，避免浏览器缓存读取旧文件。
    assetModuleFilename: "assets/img/[name][ext]" // 自定义asset module资源打包后的路径和名字
  },
  // mode: "development",  //开发模式
  devServer: {
    hot: true, //模块的热替换
    open: true, // 编译结束后自动打开浏览器
    port: 8081, // 设置本地端口号
    host: "localhost", //设置本地url
    historyApiFallback: {// 避免页面刷新找不到路由
      rewrites: [{
        from: /.*/g,
        to: '/index.html'
      }]
    },
    //代理8080
    // proxy: [
    //   {
    //     context: ['/api'],
    //     target: 'http://103.133.176.168:8080',
    //     // changeOrigin: true,
    //     pathRewrite: { '^/api': '' },
    //   },
    // ],
  },
  resolve: {
    // 快捷访问路径配置
    alias: {
      "@": resolve("src"),
      "@components": resolve("src/components"),
      "@assets": resolve("src/assets"),
      "@img": resolve("src/assets/img")
    }
  },
  // target: "node",
  stats: {
    // preset: 'errors-only', // 只显示报错信息
    // children: true, // 查看报错模块
    // errorDetails: true // 查看报错详情
  },
  optimization: {
    nodeEnv: false,
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.s[ac]ss|css$/i,
        // 放在最后面，最早执行
        use: [MiniCssExtractPlugin.loader, 'css-loader', "sass-loader", "postcss-loader"]
      },
      {
        test: /\.(js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
            cacheDirectory: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
        type: 'asset', // asset 资源类型可以根据指定的图片大小来判断是否需要转化为 base64
        generator: {
          filename: 'assets/img/[hash][ext][query]'// 局部指定输出位置，这里配置的文件输出路径优先级比第一步的配置高
        },
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024 // 限制于 30kb
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash:8].[name][ext]"
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "assets/styles/[contenthash].css" // 配置css打包之后的存放路径（这个配置contenthash在开发环境会导致更新css报错，开发环境用name）
    }),
    new webpack.DefinePlugin({
      "process.env": {
        ...env
      },
      __VUE_OPTIONS__: false, // 避免控制台警告信息
      __VUE_PROD_DEVTOOLS__: false
    })
  ]
}; 