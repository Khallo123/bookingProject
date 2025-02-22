import express from 'express'
const app = express()
import cookieParser from 'cookie-parser'
import authoRoute from './routes/auth.route.js'
import postRoute from './routes/post.route.js'
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())


app.use('/api/autho', authoRoute)
app.use('/api/posts', postRoute)

app.listen(PORT, () =>{
    console.log(`Surver is running on ${PORT}`)
})