import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectToDatabase } from "./dbconfig/DB_Connection";

import { user_router } from "./Routers/users";
import { workspace_router } from "./Routers/workspaces";
import { card_router } from "./Routers/cards";
import { task_router } from "./Routers/tasks";
import { group_router } from "./Routers/groups";

const parser: any = dotenv.config().parsed;
const app: Application = express();
const PORT: number = parser.PORT;
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors());

connectToDatabase().then(() => {
  app.use("/users", user_router);
  app.use("/workspaces", workspace_router);
  app.use("/cards", card_router);
  app.use("/tasks", task_router);
  app.use("/groups", group_router);

  app.listen(PORT, () => {
    console.log(`Listen to http://localhost:${PORT}/`);
  });
});
