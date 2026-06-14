import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.listen(3000, () => {
  console.log("server started");
});
