import {Router, Request, Response} from "express";
import {UsersRepository} from "../repositories/users-repository";
import {jwtService} from "../domain/jwt-service";
import {bearerAuth} from "../middlewares/auth/auth-middleware";
import {userValidation} from "../validators/users-validator";
import {authService} from "../service/authService";
import {confirmationCodeValidator} from "../validators/code-validator";
import {emailValidation, emailValidator} from "../utils/usersUtils/emailValidator";
import {UserAlreadyExistsError} from "../utils/errors-utils/registration-errors/UserAlreadyExistsError";
import {HTTP_STATUSES} from "../utils/common";
import {StatusCodes} from "http-status-codes";
import {responseErrorFunction} from "../utils/common-utils/responseErrorFunction";
import {RegistrationError} from "../utils/errors-utils/registration-errors/RegistrationError";


export const authRouter = Router({})

authRouter.post('/registration',
    userValidation(),
    async (req: any, res: Response) => {
        const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
        if (user instanceof UserAlreadyExistsError) {
            res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction([user]))
            return
        }
        if (user instanceof RegistrationError) {
            res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction([user]))
            return
        }
        if (user) {
            res.sendStatus(StatusCodes.NO_CONTENT);
            return
        } else {
            res.status(400).send({})
            return
        }
    })

authRouter.post('/registration-confirmation',
    confirmationCodeValidator(),
    async (req: any, res: Response) => {
        const confirmCodeResult = await authService.confirmCode(req.body.code)
        if (confirmCodeResult) {
            res.sendStatus(204)
        } else {
            res.status(400).send({})
        }
    })


authRouter.post('/registration-email-resending',
    emailValidation(),
    async (req: any, res: Response) => {
        const confirmCodeResult = await authService.resendEmail(req.body.email)
        if (confirmCodeResult) {
            res.sendStatus(204)
        } else {
            res.status(400).send({})
        }
    })

authRouter.post('/login',
    async (req: Request, res: Response) => {

        let {loginOrEmail, password} = req.body

        const user = await UsersRepository.checkCredentials({loginOrEmail, password})
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send({accessToken: token})
        } else {
            res.sendStatus(401)
        }

    })

authRouter.get('/me',
    bearerAuth,
    async (req: any, res: Response) => {

        // const user = await UsersRepository.checkCredentials({loginOrEmail, password})
        console.log(req.user, 'req.user')
        if (req.user) {
            // const token = await jwtService.createJWT(user)
            let {_id: id, login, email} = req.user
            let userId = id.toString()
            const user = {userId, login, email}
            res.status(200).send(user)
        } else {
            res.sendStatus(401)
        }

    })

