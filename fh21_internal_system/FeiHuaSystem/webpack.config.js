module.exports = {
    output: {
      filename: "[name].js"
    },
    module: {
        loaders: [
          // ...
            {
              test: /\.js?$/,
              include: [
                // path.join(__dirname, '你自己的js文件路径'),
                // path.join(__dirname, 'node_modules/其他需要babel的第三方库'),
                path.join(__dirname, 'node_modules/react-native-storage')
              ],
              loader: 'babel',
              query: {
                cacheDirectory: true,
                presets: ['es2015', 'stage-1', 'react'],
                plugins: ['transform-runtime']
              }
            }
        ],
        node: {
          antd: 'empty'
        }
    }
}