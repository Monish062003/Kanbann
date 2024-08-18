import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import { collection1 as datacollection } from "../dbconfig/DB_Connection";

export const workspace_router: Router = Router();

workspace_router.post(
  "/create_workspace",
  asyncHandler(async (req: Request, res: Response) => {
    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $push: {
          data: {
            Workspace: [
              {
                "Card 1": [{ "Task 1": [] }, "Card Description"],
              },
            ],
          },
        },
      }
    );
    res.sendStatus(200);
  })
);

workspace_router.post(
  "/update_workspace",
  asyncHandler(async (req: Request, res: Response) => {
    const { data: oldcontents } = await datacollection.findOne({
      fid: req.body.id,
    });

    const workspaceData: any = oldcontents[req.body.w_index][req.body.oldname];

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $set: {
          [`data.${req.body.w_index}.${req.body.newname}`]: workspaceData,
        },
        $unset: { [`data.${req.body.w_index}.${req.body.oldname}`]: "" },
      }
    );

    res.sendStatus(200);
  })
);

workspace_router.post(
  "/delete_workspace",
  asyncHandler(async (req: Request, res: Response) => {
    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $unset: {
          [`data.${req.body.w_index}`]: 1,
        },
      }
    );

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $pull: {
          data: null,
        },
      }
    );

    res.sendStatus(200);
  })
);
