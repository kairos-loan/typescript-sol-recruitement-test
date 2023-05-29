import express, {Router, Request, Response} from "express";
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();
import httpError from "./errorManagement";
import {listRoutes} from "./NFTList/route";
import userRoutes from "./users/route";

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Light check for admin, not enough for PROD env
const checkIsAdmin = (req: Request, res: Response, next: Function) => {
  const secretKey = req.headers['x-admin-secret-key'];
  if (secretKey && secretKey === ADMIN_SECRET_KEY) {
    next();
  } else {
    return res.status(403).send("Access denied. You are not an admin.");
  }
};

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello!');
});

router.use("/nfts", listRoutes);
router.use("/users", userRoutes);

app.use(router);
app.use((err: httpError, req: Request, res: Response, next: Function) => {
  res.status(err.statusCode).send(err.message);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});