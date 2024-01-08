import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db";
import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";
import { transformCommentsResponse } from "../../utils/comments-utils/transformCommentsResponse";
export const commentsCommandsRepository = {
  async createComment(newComment: CommentDBType): Promise<CommentViewModel> {
    const result = await commentsCollection.insertOne(newComment);
    const findCreatedComment = await commentsCollection.findOne({
      _id: result.insertedId,
    });

    return transformCommentsResponse(findCreatedComment!);
  },
  async findCommentById(id: string) {
    const comments = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    return comments;
  },
  async deleteComment(commentId: string): Promise<boolean> {
    const deletedComment = await commentsCollection.findOneAndDelete({
      _id: new ObjectId(commentId),
    });
    return !!deletedComment.ok;
  },
  async updateComment(commentId: string, content: string): Promise<boolean> {
    const newUpdatedComment = await commentsCollection.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: { content } }
    );
    return !!newUpdatedComment.ok;
  },
};
