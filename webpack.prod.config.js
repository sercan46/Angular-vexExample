const path = require('path');

let sassImplementation;
try {
  // tslint:disable-next-line:no-implicit-dependencies
  sassImplementation = require('node-sass');
} catch {
  sassImplementation = require('sass');
}

module.exports = {
  // Fix for: https://github.com/recharts/recharts/issues/1463
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sassImplementation,
              sourceMap: false,
              sassOptions: {
                precision: 8
              }
            }
          }
        ]
      },
      {
        test: /@vex[\\\/]styles[\\\/]tailwind\.scss$/,
        use: [
          {
            loader: '@fullhuman/purgecss-loader',
            options: {
              content: [
                path.join(__dirname, 'src/**/*.html'),
                path.join(__dirname, 'src/**/*.ts')
              ],
              defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sassImplementation,
              sourceMap: false,
              sassOptions: {
                precision: 8
              }
            }
          }
        ]
      }
    ]
  }
};
