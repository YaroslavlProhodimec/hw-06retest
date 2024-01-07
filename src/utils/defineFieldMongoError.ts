export const defineFieldMongoError = (error: any) => {
    let result
    if (error.includes("email")) {
        result = "email"
    } else {
        result = "login"
    }
    return result
}