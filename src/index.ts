import { AppDataSource } from "./data-source";
import express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { userRouter } from "./routes/user.routes";
import { movieRouter } from "./routes/movie.routes";
import "reflect-metadata";
import { errorHandler } from "./middleware/errorHandler";
dotenv.config();
import cors from "cors";

const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;
app.use(errorHandler);

const allowedOrigins = ["http://localhost:5173"]; // Frontend origin (your React app)

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If you are using cookies or session
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

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
