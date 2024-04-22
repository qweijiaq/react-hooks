module.exports = {
  output: {
    libraryTarget: 'umd', // 输出的库目标类型为通用模块定义
    globalObject: 'this', // 全局对象为 this
  },
  mode: 'production', // 生产模式
  resolve: {
    extensions: ['.json', '.js'], // 解析文件时自动解析的扩展名
  },
  externals: [
    // 外部依赖配置，不打包到库中
    {
      react: 'React', // 将 react 包外部化，不打包到库中，由外部环境提供 React
    },
  ],
};
