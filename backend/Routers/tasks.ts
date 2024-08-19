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
          [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}.${req.body.card_name}`]:
            {
              $each: [{ "Sip A Coffee": [] }],
              $position: req.body.task_index,
            },
        },
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
          [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}.${req.body.card_name}.${req.body.task_index}`]:
            { [req.body.newname]: [] },
        },
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
        $unset: {
          [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}.${req.body.card_name}.${req.body.task_index}`]: 1,
        },
      }
    );

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $pull: {
          [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}.${req.body.card_name}`]:
            null,
        },
      }
    );

    res.sendStatus(200);
  })
);
