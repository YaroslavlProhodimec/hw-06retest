export const responseErrorFunction = (
    errors: any
    // TFieldError[]
) => {
    return {
        errorsMessages: errors,
    };
};
// : TApiErrorResultObject
