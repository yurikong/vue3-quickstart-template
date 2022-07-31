const tokens = {
  admin: "admin-token",
}

const users = {
  "admin-token": {
    username: "admin",
    password: "1234",
    role: "admin",
  },
}

module.exports = [
  {
    url: "/user/login",
    type: "post",
    response: (req) => {
      const { username, password } = req.body
      const token = tokens[username.trim().toLowerCase()]
      const data = users[token]
      if (!data || data.password !== password) {
        return {
          code: 401,
          message: "Username and password are incorrect.",
        }
      }
      return {
        code: 200,
        data: token,
      }
    },
  },
  {
    url: "/user/logout",
    type: "post",
    response: {
      code: 200,
      message: "success",
    },
  },
  {
    url: "/user/info",
    type: "get",
    response: (req) => {
      const { token } = req.query
      const data = users[token]
      if (!data) {
        return {
          code: 500,
          message: "Login failed. Unable to get user info.",
        }
      }
      return {
        code: 200,
        data,
      }
    },
  },
]
