import {Router, Request, Response} from "express";
import {UsersRepository} from "../repositories/users-repository";
import {jwtService} from "../domain/jwt-service";
import {bearerAuth} from "../middlewares/auth/auth-middleware";


export const authRouter = Router({})


authRouter.post('/login',
    async (req: Request, res: Response) => {

        let {loginOrEmail, password} = req.body

        const user = await UsersRepository.checkCredentials({loginOrEmail, password})

        console.log(user, 'user login,login')

        if (user) {
            const token = await jwtService.createJWT(user)
            console.log(token,'token')
            console.log( typeof token,'typeof token')
            res.status(200).send({accessToken: token})
        } else {
            res.sendStatus(401)
        }

        // if (!checkResult) {
        //     res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        // } else {
        //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        // }
    })

authRouter.get('/me',
    bearerAuth,
    async (req: any, res: Response) => {

        // const user = await UsersRepository.checkCredentials({loginOrEmail, password})
        console.log(req.user, 'req.user')
        if (req.user) {
            // const token = await jwtService.createJWT(user)
            let {_id:id, login, email} = req.user
            let userId =  id.toString()
            const user = {userId,login, email}
            res.status(200).send(user)
        } else {
            res.sendStatus(401)
        }

        // if (!checkResult) {
        //     res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        // } else {
        //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        // }
    })
