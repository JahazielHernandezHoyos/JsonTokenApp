//variable de entorno "shh"
const mySecret = process.env['JWT_SECRET']

const express = require('express')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken')
const cors = require("cors");

app.use(cors())

const bd = [{username: "test", password: "123456", id: 0}]
app.use(express.json())

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(403).json({message: "no proveido"})
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id, username } = decoded
    req.user = { id, username }
    next()
  } catch (error) {
    res.status(403).json({message: "no autorizado"})
  }
}

const token = (user)=> jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })

app.post('/auth', (req, res) => {
  console.log(req.body)
  const {username, password} = req.body
  const tokenAuth = token({username, id: 0})
  const user = bd.filter(u => u.username == username).map(u => {
    return {
      user: {
        username: u.username,
        id: u.id,
      },
      token: tokenAuth
    }
  })
  res.status(200).json({data: user[0]})
})

app.get("/home", authenticationMiddleware, (req,res)=> {
  res.send("home")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})