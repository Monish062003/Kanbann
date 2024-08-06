import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import { db, collection as users } from '../dbconfig/DB_Connection'

export const user_router: Router = Router();

user_router.post("/create_user", asyncHandler(async (req: Request, res: Response) => {
    res.sendStatus(200)
}))

user_router.get("/read_user", asyncHandler(async (req: Request, res: Response) => {
    res.send("User Found")
}))