import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import { collection1 as datacollection } from "../dbconfig/DB_Connection";

export const task_router: Router = Router();

task_router.post(
  "/create_task",
  asyncHandler(async (req: Request, res: Response) => {
    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $push: {
          [`data.$[workspace].${req.body.wname}.$[card].${req.body.cname}`]: {
            [`Task ${req.body.position}`]: [],
          },
        },
      },
      {
        arrayFilters: [
          { [`workspace.${req.body.wname}`]: { $exists: true } },
          { [`card.${req.body.cname}`]: { $exists: true } },
        ],
      }
    );
    res.sendStatus(200);
  })
);

task_router.post(
  "/update_task",
  asyncHandler(async (req: Request, res: Response) => {
    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $set: {
          [`data.$[workspace].${req.body.wname}.$[card].${req.body.cname}.$[task].${req.body.newname}`]:
            [],
        },
        $unset: {
          [`data.$[workspace].${req.body.wname}.$[card].${req.body.cname}.$[task].${req.body.oldname}`]:
            "",
        },
      },
      {
        arrayFilters: [
          { [`workspace.${req.body.wname}`]: { $exists: true } },
          { [`card.${req.body.cname}`]: { $exists: true } },
          { [`task.${req.body.oldname}`]: { $exists: true } },
        ],
      }
    );

    res.sendStatus(200);
  })
);

task_router.post(
  "/delete_task",
  asyncHandler(async (req: Request, res: Response) => {
    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $pull: {
          [`data.$[workspace].${req.body.wname}.$[card].${req.body.cname}`]: {
            [req.body.tname]: { $exists: true },
          },
        },
      },
      {
        arrayFilters: [
          { [`workspace.${req.body.wname}`]: { $exists: true } },
          { [`card.${req.body.cname}`]: { $exists: true } },
        ],
      }
    );
    res.sendStatus(200);
  })
);
