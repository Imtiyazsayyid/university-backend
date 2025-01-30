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

const allowedOrigins = [
  "https://classifi-admin-stg.imtiyazsayyid.in",
  "https://classifi-teacher-stg.imtiyazsayyid.in",
  "https://classifi-student-stg.imtiyazsayyid.in",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Access-Control-Allow-Origin", // You can add custom headers here, if needed
    ],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

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
