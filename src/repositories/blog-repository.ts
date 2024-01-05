import {v4 as uuidv4} from 'uuid';
import {BlogType, OutputBlogType} from "../types/blog/output";
import {ObjectId, WithId} from "mongodb";
import {CreateBlogDto, SortDataType, UpdateBlogDto} from "../types/blog/input";
import {blogMapper} from "../types/blog/mapper";
import {blogCollection, postCollection} from "../index";
import {shortDescriptionValidation} from "../validators/post-validator";


export class BlogRepository {

    static async getAllBlogs(sortData: SortDataType) {

        const sortDirection = sortData.sortDirection ?? 'desc'
        const sortBy = sortData.sortBy ?? 'createdAt'
        const searchNameTerm = sortData.searchNameTerm ?? null
        const pageSize = sortData.pageSize ?? 10
        const pageNumber = sortData.pageNumber ?? 1

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }

        const blogs: WithId<BlogType>[] = await blogCollection.find(
            // {
            filter
            // }
        )
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await blogCollection
            .countDocuments(filter)

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: blogs.map(blogMapper)
        }

        // return blogs.map(blogMapper)

    }

    static async getPostsByBlogId(blogId: string, sortData: any) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        //
        const posts = await postCollection
            .find({blogId: blogId})
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()
if (!posts){
    return  null
}

        const totalCount = await postCollection
            .countDocuments({blogId: blogId})

        const pagesCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount,
            page: +pageNumber,
            // pageSize: +pageSize,
            pageSize: +pageSize,
            totalCount,
            items: posts.map((p: any) => ({
                id: p._id,
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                createdAt: p.createdAt,
                blogName: p.blogName,
                blogId: p.blogId,
            }))
        }

    }

    static async createPostToBlog(blogId: string, postData: any) {
        const blog = await this.getBlogById(blogId)
        // {"id":"658ecf37c9fe3dbe552d7186",
        //     "name":"new blog",
        //     "description":"description",
        //     "websiteUrl":"https://someurl.com",
        //     "createdAt":"2023-12-29T13:52:55.790Z",
        //     "isMembership":false
        const post: any = {
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: new Date(),
        }
        const res = await postCollection.insertOne(post)

        return res.insertedId
    }

    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        try {
            const blog: WithId<BlogType> | null = await blogCollection.findOne({_id: new ObjectId(id)})
            if (!blog) {
                return null
            }
            return blogMapper(blog)
        } catch (err) {
            return null
        }

    }

    // static async getBlogById(id: string,sortData:any): Promise<any | null> {
    //     const sortDirection = sortData.sortDirection ?? 'desc'
    //     const sortBy = sortData.sortBy ?? 'createdAt'
    //     const searchNameTerm = sortData.searchNameTerm ?? null
    //     const pageSize = sortData.pageSize ?? 10
    //     const pageNumber = sortData.pageNumber ?? 1
    //
    //     let filter = {}
    //
    //     if (searchNameTerm) {
    //         filter = {
    //             name: {
    //                 $regex: searchNameTerm,
    //                 $options: 'i'
    //             }
    //         }
    //     }
    //
    //     const blogs: WithId<BlogType>[] = await blogCollection.find({filter})
    //         .sort(sortBy, sortDirection)
    //         .skip((+pageNumber - 1) * +pageSize)
    //         .limit(+pageSize)
    //         .toArray()
    //
    //     const totalCount = await blogCollection
    //         .countDocuments(filter)
    //
    //     const pageCount = Math.ceil(totalCount / +pageSize)
    //
    //     return {
    //         pagesCount:pageCount,
    //         pageNumber:pageNumber,
    //         pageSize:+pageSize,
    //         totalCount:+totalCount,
    //         items:blogs.map(blogMapper)
    //     }
    //         try {
    //             const blog: any = await blogCollection.findOne({_id: new ObjectId(id)})
    //             if (!blog) {
    //
    //                 return null
    //             }
    //             return blogMapper(blog)
    //         } catch (err) {
    //             return null
    //         }
    //
    // }

    static async createBlog(data: CreateBlogDto) {

        const createdAt = new Date()
        const newBlog: BlogType = {
            ...data,
            createdAt: createdAt.toISOString(),
            isMembership: false
        }
        const result = await blogCollection.insertOne(newBlog)
        return result.insertedId.toString()

    }

    static async updateBlog(id: string, data: UpdateBlogDto) {


        let result = await blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
            }
        })
        return result.matchedCount === 1
    }

    static async deleteBlog(id: string) {
        try {
            const result = await blogCollection.deleteOne({_id: new ObjectId(id)})
            return result.deletedCount === 1
        } catch (e) {
            return false
        }

    }

    static async deleteAllBlogs() {

        const result = await blogCollection.deleteMany({})

        return !!result.deletedCount
    }

}

export function generateUniqueId(): string {
    const fullUUID = uuidv4();
    return fullUUID.slice(0, 28);
}

