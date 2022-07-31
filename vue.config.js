const { defineConfig } = require("@vue/cli-service")
const path = require("path")

const resolve = (dir) => path.join(__dirname, dir)

const port = process.env.port || 3000

module.exports = defineConfig({
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  transpileDependencies: true,
  devServer: {
    port,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    setupMiddlewares: require("./mock/mock-server"),
  },
  chainWebpack: (config) => {
    // set @ as alias to /src
    config.resolve.alias.set("@", resolve("src"))

    // set page title
    config.plugin("html").tap((args) => {
      args[0].title = process.env.VUE_APP_TITLE
      return args
    })

    // svgo-loader && svg-sprite-loader
    const dir = resolve("src/assets/svg")
    config.module.rule("svg").exclude.add(dir).end()
    config.module
      .rule("svg-icons")
      .test(/\.svg$/)
      .include.add(dir)
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end()
      .before("svg-sprite-loader")
      .use("svgo-loader")
      .loader("svgo-loader")
      .options({
        plugins: [
          {
            name: "removeAttrs",
            params: {
              attrs: "(fill|fill-rule|stroke)",
            },
          },
          {
            name: "removeTitle",
          },
        ],
      })
      .end()

    // set runtime chunk to single
    config.optimization.runtimeChunk("single")

    // split chunks
    config.optimization.splitChunks({
      chunks: "all",
      cacheGroups: {
        vendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial",
        },
        commons: {
          name: "chunk-commons",
          test: resolve("src/components"),
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    })
  },
})
