import {commentsCommandsRepository} from "../repositories/commands-repository/commentsCommandsRepository";

export const commentsService = {
  async deleteCommentById(commentId: string): Promise<boolean> {
    const deletedComment = await commentsCommandsRepository.deleteComment(
      commentId
    );
    return deletedComment;
  },
  async updateCommentById(
    commentId: string,
    content: string
  ): Promise<boolean> {
    const updatedComment = await commentsCommandsRepository.updateComment(
      commentId,
      content
    );
    return updatedComment;
  },
};
