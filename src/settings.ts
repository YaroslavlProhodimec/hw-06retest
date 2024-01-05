import express, {Request, Response} from "express";
export const settings = {
JWT_SECRET:
    // process.env.JWT_SECRET ||
    '123'
}

export const app = express()

app.use(express.json())
