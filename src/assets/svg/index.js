const context = require.context(".", false, /\.svg$/)
const requireAll = (context) => context.keys().map(context)
requireAll(context)
