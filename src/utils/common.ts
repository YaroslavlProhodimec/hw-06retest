

let counter = 0


export const createdNewId = (descriptor:string)=>{
    counter++
    return (+(new Date()))*Math.random() + descriptor + counter
}



export  const port:number = 5010

export const HTTP_STATUSES = {
    OK_200:200,
    CREATED_201:201,
    NO_CONTENT_204:204,

    BAD_REQUEST_400:400,
    NOT_FOUND_404:404,
    UNAUTHORIZED_401:401
}