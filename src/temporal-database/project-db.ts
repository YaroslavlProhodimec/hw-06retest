import { BlogViewModel } from "../dto/blogsDTO/BlogModel";
import { PostViewModel } from "../dto/postsDTO/PostModel";
import { TVideo } from "../dto/videosDTO/CreateVideoModel";
import { creationDate } from "../utils/common-utils/creation-publication-dates";

export type TDataBase = {
  videos: TVideo[];
  blogs: BlogViewModel[];
  posts: PostViewModel[];
};
export let db: TDataBase = {
  videos: [],
  blogs: [
    {
      id: "123",
      name: "Tania",
      description: "Tania loves backend",
      websiteUrl: "string.com",
      isMembership: false,
      createdAt: creationDate(),
    },
    {
      id: "456",
      name: "Prince",
      description: "Prince loves to read",
      websiteUrl: "prince.com",
      isMembership: false,
      createdAt: creationDate(),
    },
    {
      id: "789",
      name: "Dear Baby",
      description: "Dear Baby loves to play",
      websiteUrl: "dear-baby.com",
      isMembership: false,
      createdAt: creationDate(),
    },
  ],
  posts: [
    {
      id: "string",
      title: "Late night",
      shortDescription: "I am sitting and learning great node js",
      content: "Content - this is content! Love you so much",
      blogId: "123",
      blogName: "Tania",
      createdAt: creationDate(),
    },
  ],
};
