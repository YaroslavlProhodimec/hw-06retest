import { Request } from "express";

export type RequestBodyModel<B> = Request<{}, {}, B>;
export type RequestQueryParamsModel<Q> = Request<{}, {}, {}, Q>;
export type RequestWithURIParam<I> = Request<I, {}, {}>;
export type RequestWithURIParamsAndBody<I, T> = Request<I, {}, T>;
export type RequestWithURIParamAndQueryParam<P, Q> = Request<P, {}, {}, Q>;
