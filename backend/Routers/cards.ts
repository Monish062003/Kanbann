import { Request, Response, Router } from "express";
import asyncHandler from "../Async/asynchandler";
import { collection1 as datacollection } from "../dbconfig/DB_Connection";

export const card_router: Router = Router();

card_router.post(
  "/create_card",
  asyncHandler(async (req: Request, res: Response) => {
    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $push: {
          [`data.${req.body.workspace_index}.${req.body.workspace_name}`]: {
            "Card Name": [{ "Task 1": [] }, "Card Description"],
          },
        },
      }
    );

    res.sendStatus(200);
  })
);

card_router.post(
  "/update_card",
  asyncHandler(async (req: Request, res: Response) => {
    const { data: oldcontents } = await datacollection.findOne({
      fid: req.body.id,
    });

    const cardData =
      oldcontents[req.body.workspace_index][req.body.workspace_name][
        req.body.card_index
      ][req.body.oldname];

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $set: {
          [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}.${req.body.newname}`]:
            cardData,
        },
        $unset: {
          [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}.${req.body.oldname}`]:
            "",
        },
      }
    );
    res.sendStatus(200);
  })
);

card_router.post(
  "/delete_card",
  asyncHandler(async (req: Request, res: Response) => {
    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $unset: {
          [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}`]: 1,
        },
      }
    );

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $pull: {
          [`data.${req.body.workspace_index}.${req.body.workspace_name}`]: null,
        },
      }
    );
    res.sendStatus(200);
  })
);
