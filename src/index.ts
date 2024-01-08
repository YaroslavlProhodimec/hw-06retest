import { runDB } from "./db";
import { app } from "./settings";
import * as dotenv from "dotenv";

dotenv.config();
const port =
    // process.env.PORT ||
    5000;

const startApp = async () => {
  await runDB();
  app.listen(port, () => {
    console.log(`Example 1 app listening on port ${port}`);
  });
};

startApp();
module.exports = app;
