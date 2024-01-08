import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PostInputModel, PostViewModel } from "../dto/postsDTO/PostModel";
import { postsService } from "../domain/posts-service";
import {
  RequestBodyModel,
  RequestQueryParamsModel,
  RequestWithURIParam,
  RequestWithURIParamAndQueryParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import { postsQueryRepository } from "../repositories/query-repository/postsQueryRepository";
import { Paginator } from "../dto/common/PaginatorModel";
import {
  QueryParamsWithSearch,
  PaginationSortingQueryParams,
} from "../dto/common/SortPaginatorQueryParamsType";
import {
  CommentInputModel,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";

// @desc Get all posts
// @route GET /api/posts
// @access Public
export const getPosts = async (
  req: RequestQueryParamsModel<QueryParamsWithSearch>,
  res: Response<Paginator<PostViewModel>>
) => {
  let {
    pageNumber = 1,
    sortBy = "createdAt",
    pageSize = 10,
    sortDirection = "desc",
  } = req.query;
  const posts: Paginator<PostViewModel> = await postsQueryRepository.findPosts(
    Number(pageNumber),
    sortBy,
    Number(pageSize),
    sortDirection
  );
  res.status(StatusCodes.OK).send(posts);
};

// @desc Get post by ID
// @route GET /api/posts/:id
// @access Public
export const getPostsById = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response<PostViewModel>
) => {
  const foundPost = await postsQueryRepository.findPostById(req.params.id);
  if (!foundPost) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundPost);
  }
};

// @desc Create new post
// @route POST /api/posts
// @access Private
export const createNewPost = async (
  req: RequestBodyModel<PostInputModel>,
  res: Response<PostViewModel | TApiErrorResultObject>
) => {
  const newPost = await postsService.createNewPost(req.body);
  if (!newPost) {
    res.sendStatus(StatusCodes.CONFLICT);
  } else {
    res.status(StatusCodes.CREATED).send(newPost);
  }
};

// @desc Update a post
// @route PUT /api/posts/:id
// @access Private
export const updatePostById = async (
  req: RequestWithURIParamsAndBody<URIParamsRequest, PostInputModel>,
  res: Response<TApiErrorResultObject>
) => {
  const isUpdated = await postsService.updatePostById(req.params.id, req.body);
  if (!isUpdated) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};

// @desc Delete post by ID
// @route DELETE /api/posts/:id
// @access Private
export const deletePostById = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response
) => {
  const isDeleted = await postsService.deletePostById(req.params.id);

  if (!isDeleted) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};

export const createComment = async (
  req: RequestWithURIParamsAndBody<URIParamsRequest, CommentInputModel>,
  res: Response<CommentViewModel>
) => {
  const { content } = req.body;
  const createdComment = await postsService.createNewComment(
    req.params.id,
    content,
    req.userId!
  );
  if (!createdComment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.CREATED).send(createdComment);
  }
};

export const findCommentsForSpecifiedPost = async (
  req: RequestWithURIParamAndQueryParam<
    URIParamsRequest,
    PaginationSortingQueryParams
  >,
  res: Response<Paginator<CommentViewModel>>
) => {
  let {
    pageNumber = 1,
    sortBy = "createdAt",
    pageSize = 10,
    sortDirection = "desc",
  } = req.query;
  const commentsForSpecifiedPost =
    await postsQueryRepository.findCommentsForSpecifiedPost(
      req.params.id,
      Number(pageNumber),
      sortBy,
      Number(pageSize),
      sortDirection
    );
  if (!commentsForSpecifiedPost) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(commentsForSpecifiedPost);
  }
};
