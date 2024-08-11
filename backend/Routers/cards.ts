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
            [`Card ${req.body.position}`]: [{ "Task 1": [] }],
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
    const { data } = await datacollection.findOne({ fid: req.body.id });
    const cardData = data
      ?.find((workspace: { [x: string]: any }) => workspace[req.body.wname])
      ?.[req.body.wname]?.find(
        (card: { [x: string]: any }) => card[req.body.oldname]
      )?.[req.body.oldname];

    await datacollection.updateOne(
      { fid: req.body.id },
      {
        $set: {
          [`data.$[workspace].${req.body.wname}.$[card].${req.body.newname}`]:
            cardData,
        },
        $unset: {
          [`data.$[workspace].${req.body.wname}.$[card].${req.body.oldname}`]:
            "",
        },
      },
      {
        arrayFilters: [
          { [`workspace.${req.body.wname}`]: { $exists: true } },
          { [`card.${req.body.oldname}`]: { $exists: true } },
        ],
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
        $pull: {
          [`data.$[workspace].${req.body.wname}`]: {
            [req.body.cname]: { $exists: true },
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
