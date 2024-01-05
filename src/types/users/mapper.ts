

export const usersMapper = (user:any):any => {
    return {
        id:user._id.toString(),
        login:user.login,
        email:user.email,
        createdAt:user.createdAt,
    }
}
// "id": "string",
//     "login": "string",
//     "email": "string",
//     "createdAt": "2024-01-02T11:16:32.713Z"