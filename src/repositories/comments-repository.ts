import {OutputPostType, PostType} from "../types/post/output";
import {commentsCollection, postCollection, usersCollection} from "../index";
import {ObjectId, WithId} from "mongodb";
import {BlogType} from "../types/blog/output";
import {postMapper} from "../types/post/mapper";
import {commentsMapper} from "../types/comments/mapper";
import {UpdatePostDto} from "../types/post/input";
import {BlogRepository} from "./blog-repository";
import {usersCommandsRepository} from "./commands-repository/usersCommandsRepository";

export class CommentsRepository {
    static async getAllCommentsQueryParam(sortData: any, postId: any) {
        const sortDirection = sortData.sortDirection ?? 'desc'
        const sortBy = sortData.sortBy ?? 'createdAt'
        const searchNameTerm = sortData.searchNameTerm ?? null
        const pageSize = (sortData.pageSize) ?? 10
        const pageNumber = sortData.pageNumber ?? 1

        let filter = {
            id: postId
        }

        // if (searchNameTerm) {
        //     filter = {
        //         name: {
        //             $regex: searchNameTerm,
        //             $options: 'i'
        //         }
        //     }
        // }
        // const filter = {id: id}

        const comments: any = await commentsCollection.find({postId: postId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await commentsCollection
            .countDocuments({postId:postId})

        const pagesCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: comments.map(commentsMapper)
        }


    }

    static async getCommentById(id: any): Promise<OutputPostType | null> {
        try {
            const comment: any = await commentsCollection.findOne({_id: new ObjectId(id)
            })
            console.log(comment, 'comment')
            if (!comment) {
                return null
            }
            return commentsMapper(comment)
        } catch (e) {
            return null
        }
    }

    static async createComments(content: string, id: string, postId: any) {

        const createdAt = new Date()

        // const user: any = await usersCollection.findOne({_id: id})
        const foundUser = await usersCommandsRepository.findUserById(id);

        const newComment: any = {
            // id: postId,
            postId:postId,
            content,
            commentatorInfo: {
                userId: id,
                userLogin: foundUser.accountData.login,
            },
            createdAt: createdAt.toISOString()
        }
        const comment = await commentsCollection.insertOne(newComment)

        if (comment) {
            const result: any = await commentsCollection.findOne({_id:comment.insertedId })
            return {
                id: result!._id,
                content: result!.content,
                commentatorInfo: result.commentatorInfo,
                // commentatorInfo: {
                //     userId: result.commentatorInfo.userId,
                //     userLogin: result.commentatorInfo.userLogin,
                // },
                createdAt: result!.createdAt,
            }

        } else {
            return null
        }
        //
    }

    static async updateComment(id: string, content: any,) {

        let result = await commentsCollection.updateOne({_id:
            new ObjectId(
            id
            )
        }, {
            $set: {
                content: content,
            }
        })

        return result.matchedCount === 1
    }

    static async deleteComment(id: string) {

        try {

            const result = await commentsCollection.deleteOne({_id:
                new ObjectId(
                id
                )
            })
            return result.deletedCount === 1

        } catch (e) {

            return false

        }
    }
}