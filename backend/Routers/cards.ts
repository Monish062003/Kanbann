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
      ];
    if (req.body.target === "card_title") {
      await datacollection.updateOne(
        { fid: req.body.id },
        {
          $set: {
            [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}.${req.body.newname}`]:
              cardData[req.body.oldname],
          },
          $unset: {
            [`data.${req.body.workspace_index}.${req.body.workspace_name}.${req.body.card_index}.${req.body.oldname}`]:
              "",
          },
        }
      );
    } else {
      console.log([Object.keys(cardData)[0]].length);
      await datacollection.updateOne(
        { fid: req.body.id },
        {
          $set: {
            [`data.${req.body.workspace_index}.${req.body.workspace_name}.${
              req.body.card_index
            }.${Object.keys(cardData)[0]}.${
              [Object.keys(cardData)[0]].length
            }`]: req.body.newname,
          },
        }
      );
    }
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
