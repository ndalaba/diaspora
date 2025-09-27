import "reflect-metadata";
import * as dotenv from "dotenv";
import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import DataSource from "./config/ormconfig";
import logger from "./utils/logger.utils";
import routes from "./config/routes";
import trimMiddleware from "./domain/shared/trim.middleware";
import * as session from "express-session";

dotenv.config();

import { buildServer } from "./core/server";

async function start() {

  const app = await buildServer();
  app.listen(3000, "0.0.0.0", (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    DataSource.initialize().then(_ => logger.info("Database connected"));
    app.log.info(`🚀 Server running at ${address}`);
  });
}

start();







let app = express();

app.use(session({secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false}))
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(trimMiddleware);
app.use("/static", express.static(path.join(__dirname, "static")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app = routes(app);

const port = process.env.NODE_ENV === "test" ? process.env.TEST_PORT : process.env.PORT;

app.listen(port, () => {
    logger.info(`Express server running on http://127.0.0.1:${port}`);
    try {
        DataSource.initialize().then(_ => logger.info("Database connected"));
    } catch (error) {
        logger.error(error);
    }
});

export default app;