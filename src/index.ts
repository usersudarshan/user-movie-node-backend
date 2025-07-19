import { AppDataSource } from "./data-source";
import express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { userRouter } from "./routes/user.routes";
import { movieRouter } from "./routes/movie.routes";
import "reflect-metadata";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

const { PORT = 3000 } = process.env;

const allowedOrigins = [
  "http://localhost:5173",
  "https://react-ts-frontend.onrender.com",
];

// ✅ Enhanced CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow curl or Postman
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // include OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"], // explicitly allow headers
  })
);

app.use("/auth", userRouter);
app.use("/api", movieRouter);

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

app.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
