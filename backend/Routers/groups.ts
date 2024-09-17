import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import {
  collection as userscollection,
  collection1 as datacollection,
  collection2 as groupcollection,
} from "../dbconfig/DB_Connection";

export const group_router: Router = Router();

group_router.post(
  "/create_group",
  asyncHandler(async (req: Request, res: Response) => {
    groupcollection.insertOne({
      code: req.body.gcode,
      name: req.body.group_name,
      data: [],
      users: [req.body.email],
    });

    datacollection.findOneAndUpdate(
      { fid: req.body.id },
      { $push: { groups: req.body.gcode } }
    );

    res.status(200);
  })
);

group_router.post(
  "/join_group",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await groupcollection.findOneAndUpdate(
      { code: req.body.gcode },
      { $push: { users: req.body.email } },
      { returnDocument: "after" }
    );
    datacollection.findOneAndUpdate(
      { fid: req.body.id },
      { $push: { groups: req.body.gcode } }
    );
    res.json(response.data);
  })
);

group_router.post(
  "/read_group",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await groupcollection.findOneAndUpdate(
      { code: req.body.gcode },
      { $push: { users: req.body.email } },
      { returnDocument: "after" }
    );
    res.json(response.data);
  })
);
