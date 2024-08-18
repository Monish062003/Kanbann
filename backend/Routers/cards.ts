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
          [`data.$[workspace].${req.body.wname}`]: {
            "Card Name": [{ "Task 1": [] }, "Card Desc"],
          },
        },
      },
      {
        arrayFilters: [{ [`workspace.${req.body.wname}`]: { $exists: true } }],
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

    const cardData = oldcontents
      ?.find((workspace: { [x: string]: any }) => workspace[req.body.wname])
      ?.[req.body.wname]?.find(
        (card: { [x: string]: any }) => card[req.body.oldname]
      )?.[req.body.oldname];

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $set: {
          [`data.${req.body.w_index}.${req.body.wname}.${req.body.c_index}.${req.body.newname}`]:
            cardData,
        },
        $unset: {
          [`data.${req.body.w_index}.${req.body.wname}.${req.body.c_index}.${req.body.oldname}`]:
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
          [`data.${req.body.w_index}.${req.body.wname}.${req.body.c_index}`]: 1,
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
