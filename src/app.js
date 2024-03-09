import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import router from "./app/router";

const app = express();

app.set("port", process.env.PORT || 8003);
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "500mb" }));

app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    safeFileNames: false,
    abortOnLimit: true,
  })
);

app.use(router);

export default app;
