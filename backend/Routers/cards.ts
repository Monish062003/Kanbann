import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import { collection as users } from "../dbconfig/DB_Connection";
import { ObjectId } from "mongodb";

export const card_router: Router = Router();

card_router.post(
  "/create_card",
  asyncHandler(async (req: Request, res: Response) => {
    await users.insertOne(req.body);
    res.sendStatus(200);
  })
);

card_router.post(
  "/update_card",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);

card_router.post(
  "/read_card",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);

card_router.post(
  "/delete_card",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await users.findOne({
      _id: new ObjectId(`${req.body.id}`),
    });
    res.json(response);
  })
);
