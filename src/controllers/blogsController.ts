import { Response } from "express";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogModel";
import { StatusCodes } from "http-status-codes";
import {
  RequestBodyModel,
  RequestQueryParamsModel,
  RequestWithURIParam,
  RequestWithURIParamAndQueryParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import { blogsService } from "../domain/blogs-service";
import { QueryParamsWithSearch } from "../dto/common/SortPaginatorQueryParamsType";
import { Paginator } from "../dto/common/PaginatorModel";
import {
  CreatePostForSpecificBlogType,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { blogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";

// @desc Get all blogs
// @route GET /api/blogs
// @access Public
export const getBlogs = async (
  req: RequestQueryParamsModel<QueryParamsWithSearch>,
  res: Response<Paginator<BlogViewModel>>
) => {
  let {
    searchNameTerm = "",
    pageNumber = 1,
    sortBy = "createdAt",
    pageSize = 10,
    sortDirection = "desc",
  } = req.query;

  const blogs: Paginator<BlogViewModel> = await blogsQueryRepository.findBlogs(
    searchNameTerm,
    Number(pageNumber),
    sortBy,
    Number(pageSize),
    sortDirection
  );
  res.status(StatusCodes.OK).send(blogs);
};

// @desc Return all posts for specified blog
// @route GET /api/blogs/:blogId/posts
// @access Public
export const getBlogPosts = async (
  req: RequestWithURIParamAndQueryParam<
    URIParamsRequest,
    QueryParamsWithSearch
  >,
  res: Response<Paginator<PostViewModel>>
) => {
  let {
    pageNumber = 1,
    sortBy = "createdAt",
    pageSize = 10,
    sortDirection = "desc",
  } = req.query;

  const foundBlog = await blogsQueryRepository.findBlogById(req.params.id);
  if (!foundBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    const postsFromSpecificBlog =
      await blogsQueryRepository.findPostsForSpecificBlog(
        req.params.id,
        Number(pageNumber),
        sortBy,
        Number(pageSize),
        sortDirection
      );
    res.status(StatusCodes.OK).send(postsFromSpecificBlog);
  }
};

// @desc Create new post for specified blog
// @route GET /api/blogs/:blogId/posts
// @access Private
export const createPostForSpecificBlog = async (
  req: RequestWithURIParamsAndBody<
    URIParamsRequest,
    CreatePostForSpecificBlogType
  >,
  res: Response<PostViewModel>
) => {
  const createdPost = await blogsService.createNewPostForSpecificBlog(
    req.body,
    req.params.id
  );
  if (!createdPost) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else res.status(StatusCodes.CREATED).send(createdPost);
};

// @desc Get blog by ID
// @route GET /api/blogs/:id
// @access Public
export const getBlogsById = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response<BlogViewModel>
) => {
  const foundBlog = await blogsQueryRepository.findBlogById(req.params.id);
  if (!foundBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundBlog);
  }
};

// @desc Create new blog
// @route POST /api/blogs
// @access Private
export const createNewBlog = async (
  req: RequestBodyModel<BlogInputModel>,
  res: Response<BlogViewModel | TApiErrorResultObject>
) => {
  const newBlog = await blogsService.createNewBlog(req.body);
  res.status(StatusCodes.CREATED).send(newBlog);
};

// @desc Update blog by ID
// @route PUT /api/blogs/:id
// @access Private
export const updateBlogById = async (
  req: RequestWithURIParamsAndBody<URIParamsRequest, BlogInputModel>,
  res: Response<TApiErrorResultObject>
) => {
  const updatedBlog = await blogsService.updateBlogById(
    req.params.id,
    req.body
  );
  if (!updatedBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};

// @desc Delete blog by ID
// @route DELETE /api/blogs/:id
// @access Private
export const deleteBlogById = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response
) => {
  const foundBlog = await blogsService.deleteBlogById(req.params.id);
  if (!foundBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else res.sendStatus(StatusCodes.NO_CONTENT);
};
