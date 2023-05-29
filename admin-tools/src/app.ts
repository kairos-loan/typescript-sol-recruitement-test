import express, {Router, Request, Response} from "express";
import dotenv from 'dotenv';

dotenv.config();
import httpError from "./errorManagement";
import {listRoutes} from "./NFTList/route";

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello!');
});

router.use("/nfts", listRoutes);

app.use(router);
app.use((err: httpError, req: Request, res: Response, next: Function) => {
  res.status(err.statusCode).send(err.message);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});