import jwt from 'jsonwebtoken'

export const jwtService = {
    async createJWT(user: any) {
        const token =  jwt.sign({userId: user._id},'333',{expiresIn: '3h'})
        return token
    },
    async getUserIdByToken(token:any){
        try {
            const result:any =  jwt.verify(token,'333')
            return  result.userId
        } catch (e) {
            return null
        }
    }
}

// export const jwtService = {
//     async createJWT(user: any) {
//         const token = jwt.sign({ userId: user._id.toString() }, settings.JWT_SECRET, { expiresIn: '3h' });
//         console.log(token, 'token createJWT');
//         return token;
//     },
//     async getUserIdByToken(token: any) {
//         console.log(token, 'getUserIdByToken');
//         try {
//             const result: any = jwt.verify(token, settings.JWT_SECRET);
//             console.log(result, 'result');
//             return result.userId; // Если result.userId уже строка, преобразование в ObjectId не требуется
//         } catch (e) {
//             console.log(e, 'e e e');
//             return null;
//         }
//     },
// };
