import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import {
  collection as userscollection,
  collection1 as datacollection,
} from "../dbconfig/DB_Connection";

export const user_router: Router = Router();

user_router.post(
  "/create_user",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await userscollection.insertOne(req.body);
    datacollection.insertOne({ fid: response.insertedId.toString(), data: [] });
    res.json(response.insertedId);
  })
);

user_router.post(
  "/read_user",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await datacollection.findOne({
      fid: req.body.id,
    });
    res.json(response);
  })
);
