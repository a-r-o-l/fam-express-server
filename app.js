import express from "express";
import morgan from "morgan";
import cors from "cors";
import accountRoutes from "./routes/Account/index.js";
import saleRoutes from "./routes/Sales/index.js";
import serviceRoutes from "./routes/Services/index.js";
import chargeRoutes from "./routes/Charge/index.js";
import authRoutes from "./routes/Auth/index.js";
import cashClosingRoutes from "./routes/CashClosing/index.js";
import sessionRoutes from "./routes/Session/index.js";
import refreshTokenRoutes from "./routes/RefreshToken/index.js";
import authenticateToken from "./middlewares/authMiddleware.js";



const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(accountRoutes);
app.use(authRoutes);
app.use(refreshTokenRoutes);
app.use(authenticateToken,saleRoutes);
app.use(authenticateToken,serviceRoutes);
app.use(authenticateToken,chargeRoutes);
app.use(authenticateToken,cashClosingRoutes);
app.use(authenticateToken,sessionRoutes);



export default app;
