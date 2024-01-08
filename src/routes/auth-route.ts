import {Router, Request, Response} from "express";
import {UsersRepository} from "../repositories/users-repository";
import {jwtService} from "../domain/jwt-service";
import {bearerAuth} from "../middlewares/auth/auth-middleware";
import {userValidation} from "../validators/users-validator";
import {authService} from "../service/authService";
import {confirmationCodeValidator} from "../validators/code-validator";
import {emailValidation} from "../utils/usersUtils/emailValidator";
import {UserAlreadyExistsError} from "../utils/errors-utils/registration-errors/UserAlreadyExistsError";
import {StatusCodes} from "http-status-codes";
import {responseErrorFunction} from "../utils/common-utils/responseErrorFunction";
import {RegistrationError} from "../utils/errors-utils/registration-errors/RegistrationError";
import {UpdateUserError} from "../utils/errors-utils/registration-confirmation-errors/UpdateUserError";
import {
    ConfirmationCodeExpiredError
} from "../utils/errors-utils/registration-confirmation-errors/ConfirmationCodeExpiredError";
import {UserIsConfirmedError} from "../utils/errors-utils/registration-confirmation-errors/UserIsConfirmedError";
import {
    IncorrectConfirmationCodeError
} from "../utils/errors-utils/registration-confirmation-errors/IncorrectConfirmationCodeError";
import {WrongEmailError} from "../utils/errors-utils/resend-email-errors/WrongEmailError";
import {EmailAlreadyConfirmedError} from "../utils/errors-utils/resend-email-errors/EmailAlreadyConfirmedError";
import {authValidator} from "../utils/auth-utils/auth-validator";


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
        const confirmCodeResult = await authService.confirmCode(req.body.code);
        if (
            confirmCodeResult instanceof IncorrectConfirmationCodeError ||
            confirmCodeResult instanceof UserIsConfirmedError ||
            confirmCodeResult instanceof ConfirmationCodeExpiredError
        ) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .send(responseErrorFunction([confirmCodeResult]));
            return;
        }
        if (confirmCodeResult instanceof UpdateUserError) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(responseErrorFunction([confirmCodeResult]));
            return;
        }
        res.sendStatus(StatusCodes.NO_CONTENT);
    })


authRouter.post('/registration-email-resending',
    emailValidation(),
    async (req: any, res: Response) => {
        const resendEmailResult = await authService.resendEmail(req.body.email);
        if (
            resendEmailResult instanceof WrongEmailError ||
            resendEmailResult instanceof EmailAlreadyConfirmedError
        ) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .send(responseErrorFunction([resendEmailResult]));
            return;
        }
        if (resendEmailResult instanceof UpdateUserError) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(responseErrorFunction([resendEmailResult]));
            return;
        }
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
)
authRouter.post('/login',
    authValidator(),
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

