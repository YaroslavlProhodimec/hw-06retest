import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../utils/common";
import {userValidation} from "../validators/users-validator";
import {UsersRepository} from "../repositories/users-repository";

export const usersRouter = Router({})

usersRouter.get('/',
    authMiddleware,
    async (req: Request, res: Response) => {
        const sortData = {
            searchNameTerm: req.query.searchNameTerm,
            searchEmailTerm: req.query.searchEmailTerm,
            searchLoginTerm: req.query.searchLoginTerm,
            loginOrEmail: req.query.loginOrEmail,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        }
        const users = await UsersRepository.getAllUsers(sortData)
        res.status(HTTP_STATUSES.OK_200).send(users)
    })
usersRouter.post('/',
    authMiddleware,
    userValidation(),
    async (req: Request, res: Response) => {

        const newProduct = await UsersRepository.createUser(req.body.login, req.body.email,
            req.body.password,
            null,
            true,
            null)
        // if (newBlog) {
        res.status(HTTP_STATUSES.CREATED_201).json(newProduct)
        // return;
        // }
        // res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

usersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await UsersRepository.deleteUser(req.params.id)
        if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
