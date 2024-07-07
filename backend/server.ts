import express from 'express'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'
import connectDB from './db/connectDB'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT||5000
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.listen(PORT,() => console.log(`Server started at http://localhost:${PORT}`))