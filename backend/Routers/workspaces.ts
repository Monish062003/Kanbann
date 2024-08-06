import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import { collection as users } from "../dbconfig/DB_Connection";
import { ObjectId } from "mongodb";

export const workspace_router: Router = Router();

workspace_router.post(
  "/create_workspace",
  asyncHandler(async (req: Request, res: Response) => {
    await users.insertOne(req.body);
    res.sendStatus(200);
  })
);

workspace_router.post(
  "/update_workspace",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);

workspace_router.post(
  "/read_workspace",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);

workspace_router.post(
  "/delete_workspace",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);
