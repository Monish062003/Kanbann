import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import { collection as users } from "../dbconfig/DB_Connection";
import { ObjectId } from "mongodb";

export const user_router: Router = Router();

user_router.post(
  "/create_user",
  asyncHandler(async (req: Request, res: Response) => {
    await users.insertOne(req.body);
    res.sendStatus(200);
  })
);

user_router.post(
  "/read_user",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);
