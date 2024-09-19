import { Router } from "express";
import jwt from "jsonwebtoken";
import RefreshToken from "../../models/RefreshToken.js";
import Account from "../../models/Account.js";

const router = Router();
const secret = process.env.JWT_SECRET
const refreshSecret = process.env.REFRESH_SECRET

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "El refresh-token es requerido" });
  }
  try {
    const decoded = jwt.verify(refreshToken, refreshSecret)

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      account: decoded.id,
    })

    if (!storedToken) {
      return res.status(403).json({ message: "No existe el refresh-token" });
    }

    if (Date.now() > new Date(storedToken.expiry_date).getTime()) {
      return res.status(403).json({ message: "El refresh-token está expirado" });
    }

    const account = await Account.findById(decoded.id);

    if (!account) {
      return res.status(404).json({ message: "La cuenta no existe" });
    }

    const newAccessToken = jwt.sign(
      {
        _id: account._id,
        name: account.user_name,
        password: account.password,
        role: account.role,
        session: account.session,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
