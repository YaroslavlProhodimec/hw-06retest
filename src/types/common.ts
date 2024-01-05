import {Request} from 'express'
export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithQuery<Q> = Request<{}, {},{},Q>
export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>

// export type ResponseType<T> = Response<T,{}>


type  ErrorType = {
    errorsMessages: ErrorMessageType[]
}

type  ErrorMessageType = {
    field: string
    message: string
}