import dotenv from 'dotenv'
import {app} from "./settings";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {BlogType} from "./types/blog/output";
import {PostType} from "./types/post/output";
import {testingRouter} from "./testing-router";
import {MongoClient} from "mongodb";
import {authRouter} from "./routes/auth-route";
import {usersRouter} from "./routes/users-route";
import {commentsRoute} from "./routes/comments-route";
import {emailRouter} from "./routes/email-router";

// app.use('/testing',testingRouter)

dotenv.config()
export const mongoURI = process.env.MONGO_URL

// @ts-ignore
export const client = new MongoClient(mongoURI);

export async function runDb() {
    try {
        await client.connect()
    } catch (e) {
        await client.close()
    }
}

const port = 5000

app.use('/blogs', blogRoute)
app.use('/posts', postRoute)
app.use('/testing', testingRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRoute)
app.use('/', emailRouter)

export const dbBlogs = client.db('node-blogs')

export const blogCollection = dbBlogs.collection<BlogType>('blogs')
export const postCollection = dbBlogs.collection<PostType>('post')
export const commentsCollection = dbBlogs.collection('comments')
export const usersCollection = dbBlogs.collection<any>('users')


const startApp = async () => {
    await runDb()
    app.listen(port, async () => {
        console.log(`Listen on port ${port}`)
    })
}

startApp()
