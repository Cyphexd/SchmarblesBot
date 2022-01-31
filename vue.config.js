module.exports = {
    pluginOptions: {
        electronBuilder: {
            chainWebpackMainProcess: (config) => {
                config.module
                    .rule('mjs$')
                    .test(/.mjs$/)
                    .include
                        .add(/node_modules/)
                        .end()
                    .type('javascript/auto')
            },

            outputDir: 'final_release',
            preload: 'public/preload.js',
            builderOptions: {
                productName: 'Schmarbles Bot',
                appId: 'com.bot.schmarbles',
                win: {
                    icon: 'resources/icons/icon.ico',
                    target: 'portable',   
                }
                
            }
        
        }
    }
  }