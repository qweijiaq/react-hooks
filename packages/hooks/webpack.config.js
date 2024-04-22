const merge = require('webpack-merge'); // 导入 webpack-merge 模块用于合并配置
const common = require('../../webpack.common.js'); // 导入通用 webpack 配置
const path = require('path'); // 导入 Node.js 的 path 模块

module.exports = merge(common, {
  entry: './es/index.js', // 设置入口文件路径为 './es/index.js'
  output: {
    filename: 'wj-react-hooks.js', // 输出文件名为 'wj-react-hooks.js'
    library: 'wj-react-hooks', // 指定库名称为 'wj-react-hooks'
    path: path.resolve(__dirname, './dist'), // 输出路径为当前目录下的 'dist' 目录
  },
});
