import { BlogDBType, BlogViewModel } from "../../dto/blogsDTO/BlogModel";

export const transformBlogsResponse = (
  blog: BlogDBType,
  id?: string
): BlogViewModel => {
  return {
    id: id ? id : blog._id?.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
