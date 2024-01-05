import {Router,Request,Response} from "express";
import {blogCollection, commentsCollection, dbBlogs, postCollection, usersCollection} from "./index";
export const testingRouter = Router({})


testingRouter.delete('/all-data',async (req:Request,res:Response)=>{
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    // await dbBlogs.dropDatabase()
    res.sendStatus(204)
})