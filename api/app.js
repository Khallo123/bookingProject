import express from 'express'
import authoRoute from './routes/auth.route.js'
import postRoute from './routes/post.route.js'
const app = express()

app.use(express.json())

app.use('/api/posts', postRoute)
app.use('/api/autho', authoRoute)

app.listen(2000, ()=> {
    console.log(`Server is running!`)
})