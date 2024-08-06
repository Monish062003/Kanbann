import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import { collection as users } from "../dbconfig/DB_Connection";
import { ObjectId } from "mongodb";

export const task_router: Router = Router();

task_router.post(
  "/create_task",
  asyncHandler(async (req: Request, res: Response) => {
    await users.insertOne(req.body);
    res.sendStatus(200);
  })
);

task_router.post(
  "/update_task",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);

task_router.post(
  "/read_task",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);

task_router.post(
  "/delete_task",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);
