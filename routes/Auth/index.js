import { Router } from "express";
import Account from "../../models/Account.js";
import RefreshToken from "../../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config()

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

const router = Router();

router.post("/sign-in", async (req, res) => {
  try {
    const {
      name,
      password,
    } = req.body;
    const foundAccount = await Account.findOne({ name });
    if (!foundAccount) {
      return res.status(409).json({ message: "El usuario no existe" });
    }
    if (foundAccount.password !== password) {
      return res.status(401).json({ message: "usuario o contraseña incorrecta" });
    }
    const accessToken = jwt.sign(
      {
        _id: foundAccount._id,
        name: foundAccount.name || "",
        password: foundAccount.password,
        role: foundAccount.role,
        session: foundAccount.session,
      },
      secret,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign({ _id: foundAccount._id }, refreshSecret, {
      expiresIn: "30d",
    });

    const new_refresh_token = new RefreshToken({
      account: foundAccount._id,
      token: refreshToken,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await new_refresh_token.save();
    res.json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/re-sign-in/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundAccount = await Account.findById(id);
    if (!foundAccount) {
      return res.status(409).json({ message: "El usuario no existe" });
    }
    const accessToken = jwt.sign(
      {
        _id: foundAccount._id,
        name: foundAccount.name || "",
        password: foundAccount.password,
        role: foundAccount.role,
        session: foundAccount.session,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


export default router;
