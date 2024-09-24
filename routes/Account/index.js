import { Router } from "express";
import Account from "../../models/Account.js";
import Session from "../../models/Session.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const secret = process.env.JWT_SECRET;

const router = Router();

router.post("/account", async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const newAccount = new Account({
      name,
      password,
      role,
    });
    await newAccount.save();
    res.json(newAccount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/account/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, session, password, profit } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (role !== undefined) updateFields.role = role;
    if (password !== undefined) updateFields.password = password;
    if (profit !== undefined) updateFields.profit = profit;
    updateFields.session = session;

    const account = await Account.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    res.json(account);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/accounts", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.json({
      message: error,
    });
  }
});

router.get("/account/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id).populate("session");
    res.json(account);
  } catch (error) {
    res.json({
      message: error,
    });
  }
});

router.delete("/account/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndDelete(id);
    res.json(account);
  } catch (error) {
    res.json({
      message: error,
    });
  }
});

router.put("/open-box/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, opening, change } = req.body;

    const newSession = new Session({
      date,
      opening,
      change,
      account: id,
    });
    await newSession.save();
    const account = await Account.findByIdAndUpdate(
      id,
      {
        session: newSession._id,
      },
      { new: true }
    );

    const accessToken = jwt.sign(
      {
        _id: account._id,
        name: account.name || "",
        password: account.password,
        role: account.role,
        session: newSession,
      },
      secret,
      { expiresIn: "10h" }
    );

    res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
