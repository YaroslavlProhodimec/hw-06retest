import { transformCommentsResponse } from "../../utils/comments-utils/transformCommentsResponse";
import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db";
import { CommentViewModel } from "../../dto/commentsDTO/commentsDTO";

export const commentsQueryRepository = {
  async findComment(id: string): Promise<CommentViewModel | null> {
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) {
      return null;
    } else {
      return transformCommentsResponse(comment);
    }
  },
};
