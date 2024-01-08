import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

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
// import jwt, {
//     JsonWebTokenError,
//     NotBeforeError,
//     TokenExpiredError,
// } from "jsonwebtoken";
// import * as dotenv from "dotenv";
// import { JwtPayloadResult } from "../dto/common/jwt/JwtPayloadResult";
//


// export const jwtService = {
//     async createJWT(
//         userId: string,
//         secret: string,
//         expiresIn: number
//     ): Promise<string> {
//         const token = jwt.sign({ userId }, secret, {
//             expiresIn,
//         });
//         return token;
//     },
//     async getJwtPayloadResult(
//         token: string,
//         secret: string
//     ): Promise<JwtPayloadResult | null> {
//         try {
//             const result = jwt.verify(token, secret);
//             return result as JwtPayloadResult;
//         } catch (error) {
//             if (error instanceof TokenExpiredError) {
//                 console.log({
//                     name: error.name,
//                     message: error.message,
//                     expiredAt: error.expiredAt,
//                 });
//                 return null;
//             } else if (error instanceof JsonWebTokenError) {
//                 console.log({
//                     name: error.name,
//                     message: error.message,
//                 });
//                 return null;
//             } else if (error instanceof NotBeforeError) {
//                 console.log({
//                     name: error.name,
//                     message: error.message,
//                 });
//                 return null;
//             } else return null;
//         }
//     },
// };

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
