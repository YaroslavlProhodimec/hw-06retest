import { Filter, ObjectId, SortDirection } from "mongodb";
import { blogsCollection, postsCollection } from "../../db";
import { BlogDBType, BlogViewModel } from "../../dto/blogsDTO/BlogModel";
import { Paginator } from "../../dto/common/PaginatorModel";
import { transformBlogsResponse } from "../../utils/blogs-utils/transformBlogsResponse";
import { PostDBType, PostViewModel } from "../../dto/postsDTO/PostModel";
import { transformPostsResponse } from "../../utils/posts-utils/transformPostsResponse";
import { paginationHandler } from "../../utils/common-utils/paginationHandler";
import { paginatorReturnObject } from "../../utils/common-utils/paginatorReturnObject";

export const blogsQueryRepository = {
  async findBlogs(
    searchNameTerm: string,
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortDirection
  ): Promise<Paginator<BlogViewModel>> {
    let filter: Filter<BlogDBType> = {};
    const skip = paginationHandler(pageNumber, pageSize);
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }
    const totalCount = await blogsCollection.countDocuments(filter);
    const foundBlogs = await blogsCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return paginatorReturnObject<BlogDBType>(
      foundBlogs,
      transformBlogsResponse,
      totalCount,
      pageSize,
      pageNumber
    );
  },
  async findPostsForSpecificBlog(
    id: string,
    pageNumber: number,
    sortBy: string,
    pageSize: number,
    sortDirection: SortDirection
  ): Promise<Paginator<PostViewModel>> {
    const skip = paginationHandler(pageNumber, pageSize);

    const totalCount = await postsCollection.countDocuments({
      blogId: new ObjectId(id),
    });
    const foundPosts = await postsCollection
      .find({ blogId: new ObjectId(id) })
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return paginatorReturnObject<PostDBType>(
      foundPosts,
      transformPostsResponse,
      totalCount,
      pageSize,
      pageNumber
    );
  },
  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogsCollection.findOne<BlogDBType>({
      _id: new ObjectId(id),
    });
    if (foundBlog) {
      return transformBlogsResponse(foundBlog);
    }
    return foundBlog;
  },
};
