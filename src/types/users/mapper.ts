

export const usersMapper = (user:any):any => {
    return {
        id:user._id.toString(),
        login:user.accountData.login,
        email:user.accountData.email,
        createdAt:user.accountData.createdAt,
    }
}
// "id": "string",
//     "login": "string",
//     "email": "string",
//     "createdAt": "2024-01-02T11:16:32.713Z"