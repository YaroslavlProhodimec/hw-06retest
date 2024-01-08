import { WithId } from "mongodb";
import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";

export const transformCommentsResponse = (
  newComment: WithId<CommentDBType>
): CommentViewModel => {
  return {
    id: newComment._id.toString(),
    content: newComment.content,
    createdAt: newComment.createdAt,
    commentatorInfo: newComment.commentatorInfo,
  };
};
