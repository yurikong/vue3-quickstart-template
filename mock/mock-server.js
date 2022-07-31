const Mock = require("mockjs")
const express = require("express")
const chokidar = require("chokidar")
const chalk = require("chalk")

const responseFake = ({ url, type, response }) => ({
  url: new RegExp(url),
  type,
  response(req, res) {
    console.log(`${chalk.yellow(req.method)} ${chalk.yellow(req.path)} ${chalk.green(new Date().toLocaleString())}`)
    res
      .status(200)
      .json(Mock.mock(response instanceof Function ? response(req) : response))
      .end()
  },
})

const registerRoutes = (app) => {
  const { mocks } = require(".")
  const routes = mocks.map((mock) => responseFake(mock))
  routes.forEach(({ url, type = "get", response }) => app[type](url, response))
  const length = routes.length
  return {
    startIndex: app._router.stack.length - length,
    length,
  }
}

const unregisterRoutes = (app, index, length) => {
  // clear router stack
  app._router.stack.splice(index, length)

  // clear require cache
  Object.keys(require.cache).forEach((n) => {
    n.includes(__dirname) && delete require.cache[n]
  })
}

module.exports = (middlewares, devServer) => {
  if (!devServer) {
    throw new Error("webpack-dev-server is not defined")
  }

  const { app } = devServer

  // https://expressjs.com/en/4x/api.html#req.body
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const routes = registerRoutes(app)
  let startIndex = routes.startIndex
  let length = routes.length

  chokidar
    .watch(__dirname, {
      ignored: /mock-server/,
      ignoreInitial: true,
    })
    .on("all", (event, path) => {
      if (event === "add" || event === "change") {
        try {
          unregisterRoutes(app, startIndex, length)

          const routes = registerRoutes(app)
          startIndex = routes.startIndex
          length = routes.length

          console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed ${path}\n`))
        } catch (err) {
          console.log(chalk.redBright(err))
        }
      }
    })
  return middlewares
}
