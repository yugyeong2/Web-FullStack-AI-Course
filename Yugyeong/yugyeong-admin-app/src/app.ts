import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import expressLayouts from "express-ejs-layouts";
import dotenv from "dotenv";

import indexRouter from "./routes/index";
import adminRouter from "./routes/admin";
import articleRouter from "./routes/article";
import channelRouter from "./routes/channel";
import memberRouter from "./routes/member";
import messageRouter from "./routes/message";

import db from "./models/index-model"; // Sequelize 인스턴스를 가져옵니다

dotenv.config(); // env

const app = express();

const sequelize = db.sequelize; // Sequelize 인스턴스를 가져옵니다
sequelize.sync(); // sequelize

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.set("layout", "layout"); // layout
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("layout extractMetas", true);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts); // layout

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/article", articleRouter);
app.use("/channel", channelRouter);
app.use("/member", memberRouter);
app.use("/message", messageRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
