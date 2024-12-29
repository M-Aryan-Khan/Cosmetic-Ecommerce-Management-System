import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import buyerRoutes from "./routes/buyerRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";

dotenv.config({});

const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", buyerRoutes);
app.use("/", sellerRoutes);

app.listen(5000,() => {
    console.log("server started on port 5000");
})