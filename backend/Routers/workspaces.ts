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
            [`Workspace ${req.body.position}`]: [
              { "Card 1": [{ "Task 1": [] }] },
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
    const workspaceData = oldcontents?.find(
      (workspace: { [x: string]: any }) => workspace[req.body.oldname]
    )?.[req.body.oldname];

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $set: { [`data.$[elem].${req.body.newname}`]: workspaceData },
        $unset: { [`data.$[elem].${req.body.oldname}`]: "" },
      },
      {
        arrayFilters: [{ [`elem.${req.body.oldname}`]: { $exists: true } }],
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
        $pull: {
          data: { [req.body.wname]: { $exists: true } },
        },
      }
    );

    res.sendStatus(200);
  })
);
