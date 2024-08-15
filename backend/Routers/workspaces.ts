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
            Workspace: [{ "Card 1": [{ "Task 1": [] }] }, req.body.wid],
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

    const workspaceData: any[] = [];

    oldcontents.filter((workspace: any, index: number) => {
      if (Object.keys(workspace)[0] === req.body.oldname) {
        if (
          workspace[req.body.oldname][
            workspace[req.body.oldname].length - 1
          ] === req.body.wid
        ) {
          workspaceData.push(workspace[req.body.oldname]);
          workspaceData.push(index);
        }
      }
    });

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $set: {
          [`data.${workspaceData[1]}.${req.body.newname}`]: workspaceData[0],
        },
        $unset: { [`data.${workspaceData[1]}.${req.body.oldname}`]: "" },
      }
    );

    res.sendStatus(200);
  })
);

workspace_router.post(
  "/delete_workspace",
  asyncHandler(async (req: Request, res: Response) => {
    const { data: oldcontents } = await datacollection.findOne({
      fid: req.body.id,
    });

    let windex: any;

    oldcontents.filter((workspace: any, index: number) => {
      if (Object.keys(workspace)[0] === req.body.wname) {
        if (
          workspace[req.body.wname][workspace[req.body.wname].length - 1] ===
          req.body.wid
        ) {
          windex = index;
        }
      }
    });

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $unset: {
          [`data.${windex}`]: "",
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
