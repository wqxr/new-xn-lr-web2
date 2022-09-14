/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\extra-webpack.config.js
 * @summary：init extra-webpack.config.js
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-12-12
 ***************************************************************************/
const TerserPlugin = require('terser-webpack-plugin');

const devConfig = {
  optimization: {
    concatenateModules: false
  },
};

const prodConfig = {
  optimization: {
    concatenateModules: false,
    runtimeChunk: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
          extractComments: true,
          parallel: true,
          exclude: 'assets',
          terserOptions: {
            extractComments: 'all',
            compress: {
              drop_console: false,
            },
          },
      }),
    ],
  },
};

const isProd = process.env.NODE_ENV === 'production';


module.exports = isProd ? prodConfig : devConfig;
