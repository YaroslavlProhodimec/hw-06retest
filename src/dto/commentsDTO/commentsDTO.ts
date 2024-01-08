export type CommentInputModel = {
  content: string; // maxLength: 300, minLength: 20
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string; //date-time
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type CommentDBType = {
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  postId: string;
};