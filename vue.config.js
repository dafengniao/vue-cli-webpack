const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")

const resolve = dir => {
	return path.join(__dirname, dir)
}

module.exports = {
	publicPath: '/', // 基本路径
	filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
	lintOnSave: true, // eslint-loader 是否在保存的时候检查
	productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
	
	configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
      // 将每个依赖包打包成单独的js文件
      const optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`
              }
            }
          }
        },

        // 移除console
        minimizer: [new UglifyPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true, // console
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })]
      }
      Object.assign(config, {
        optimization
      })
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': resolve('src'),
          '@_c': resolve('/src/components'),
          '@_img': resolve('/src/assets/images'),
          '@_v': resolve('/src/views'),
        } // 别名配置
      }
    })
	},
	
	chainWebpack: config => {
    // 开启图片压缩
    config.module.rule('images')
    // .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    // .use('image-webpack-loader')
    //     .loader('image-webpack-loader')
    //     .options({ bypassOnDebug: true })
		// 		.end()
		.test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
		.use('url-loader')
				.loader('url-loader')
				.options({
						limit: 10240    // 图片小于10k转为base64,默认4k
			})
				.end()
      
    // 开启js、css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
      .use(new CompressionPlugin({
        test:/\.js$|\.html$|.\css/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      }))
    }
	},
	
	// css相关配置
  css: {
    extract: false, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: true, // 开启 CSS source maps?
    requireModuleExtension: true, // 是否仅对文件名包含module的css相关文件使用 CSS Modules
    loaderOptions: {
      css: {
        modules: {
          localIdentName: '[local]_[hash:base64:8]' // 设定 CSS Modules 命名规则
        }
			},
			less:{
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: '#fff'
        }
      }
    } // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
	},
	
	devServer: {
    // open: true,
    // inline: true, // 开启实时刷新
    // host: '0.0.0.0', // 允许外部ip访问
    port: 8024, // 端口
    https: false, // 启用https
    // overlay: {
    //   warnings: true,
    //   errors: true
    // }, // 错误、警告在页面弹出
    proxy: {
      '/api': {
        target: 'http://10.1.107.1',
        changeOrigin: true // 允许websockets跨域
      }
    } // 代理转发配置，用于调试环境
  }
}



