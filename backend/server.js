const express = require('express')
require('dotenv').config()
const {connectDB} = require('./db/connectDB')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()
app.use(express.json()) // To parse json data in the req.body
app.use(express.urlencoded({ extended:true })) // To parse form data in the req.body
app.use(cookieParser())

app.use('/api/users', userRoutes)

app.listen(PORT,() => console.log(`Server starting at http://localhost:${PORT}`))