const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    assetModuleFilename: 'assets/[name][ext]',
    filename: pathData => (pathData.chunk.name === 'main' ? 'index.min.js' : '[name].min.js'),
    path: path.resolve(__dirname, 'dist'),
    library: 'vanSlidey',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './src/style', to: 'style' }],
    }),
  ],
};
