import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { responseErrorFunction } from "../utils/common-utils/responseErrorFunction";
import { db } from "../temporal-database/project-db";
import { validatePostBody } from "../utils/videoUtils/videoPostRequestValidator";
import { TUpdateVideoInputModel } from "../dto/videosDTO/UpdateVideoModel";
import { URIParamsRequestForVideo } from "../dto/videosDTO/URIParamsRequestForVideo";
import {
  TCreateVideoInputModel,
  TVideo,
} from "../dto/videosDTO/CreateVideoModel";
import {
  creationDate,
  publicationVideoDate,
} from "../utils/common-utils/creation-publication-dates";
import {
  TApiErrorResultObject,
  TFieldError,
} from "../dto/common/ErrorResponseModel";
import { videoPutRequestValidator } from "../utils/videoUtils/videoPutRequestValidator";
import {
  RequestBodyModel,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";

export const videosRouter = express.Router({});

//TODO get all videos
videosRouter.get("/", (req: Request, res: Response<TVideo[]>) => {
  res.status(StatusCodes.OK).send(db.videos);
});

//TODO get video by Id
videosRouter.get(
  "/:id",
  (
    req: Request<URIParamsRequestForVideo>,
    res: Response<TVideo | TApiErrorResultObject>
  ) => {
    const errors = [];
    const foundVideoById = db.videos.find(
      (element) => element.id === +req.params.id
    );
    if (!foundVideoById) {
      errors.push({
        message: "There is no video with such Id",
        field: "Invalid Id",
      });
      res.status(StatusCodes.NOT_FOUND).send(responseErrorFunction(errors));
    } else {
      res.status(StatusCodes.OK).send(foundVideoById);
    }
  }
);

//TODO create new video
videosRouter.post(
  "/",
  (
    req: RequestBodyModel<TCreateVideoInputModel>,
    res: Response<TApiErrorResultObject | TVideo>
  ) => {
    let errors: TFieldError[] = validatePostBody(req.body);
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
      return;
    } else {
      const { title, author, availableResolutions } = req.body;
      res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
      });

      const newVideo: TVideo = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        title,
        author,
        availableResolutions,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: creationDate(),
        publicationDate: publicationVideoDate(),
      };

      db.videos.push(newVideo);
      res.status(StatusCodes.CREATED).send(newVideo);
    }
  }
);

//TODO delete video by Id
videosRouter.delete(
  "/:id",
  (
    req: Request<URIParamsRequestForVideo>,
    res: Response<TVideo | TApiErrorResultObject>
  ) => {
    const foundVideoById = db.videos.findIndex(
      (element) => element.id === +req.params.id
    );
    if (foundVideoById === -1) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      db.videos.splice(foundVideoById, 1);
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
);

//TODO update video by id
videosRouter.put(
  "/:id",
  (
    req: RequestWithURIParamsAndBody<
      URIParamsRequestForVideo,
      TUpdateVideoInputModel
    >,
    res: Response
  ) => {
    const errors: TFieldError[] = videoPutRequestValidator(req.body);
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
      return;
    }
    const foundVideo = db.videos.find((el) => el.id === +req.params.id);
    if (!foundVideo) {
      errors.push({ message: "Not_Found video with such ID", field: "id" });
      res.status(StatusCodes.NOT_FOUND).send(responseErrorFunction(errors));
      return;
    } else {
      res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
      });
      foundVideo.publicationDate = publicationDate;
      foundVideo.canBeDownloaded = canBeDownloaded;
      foundVideo.author = author;
      foundVideo.title = title;
      foundVideo.minAgeRestriction = minAgeRestriction;
      foundVideo.availableResolutions = availableResolutions;
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
);
