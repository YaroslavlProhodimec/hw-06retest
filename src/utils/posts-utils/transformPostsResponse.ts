import { PostDBType, PostViewModel } from "../../dto/postsDTO/PostModel";

export const transformPostsResponse = (
  post: PostDBType,
  id?: string
): PostViewModel => {
  return {
    id: (id as string) ?? post._id?.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    createdAt: post.createdAt,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
  };
};
