import { Router } from "express";
import { config } from "dotenv";
import CashClosing from "../../models/CashClosing.js";
config();

const secret = process.env.JWT_SECRET;

const router = Router();

router.post("/cash-closing", async (req, res) => {
  try {
    const {
      account,
      balance,
      chachos,
      coin,
      date,
      fifty,
      fiveHoundred,
      Profit,
      ten,
      tenThousand,
      thousand,
      total,
      twenty,
      twoHoundred,
      houndred,
      twoThousand,
      sale_amount,
      change,
    } = req.body;
    const newAccount = new CashClosing({
      account,
      balance,
      chachos,
      coin,
      date,
      fifty,
      fiveHoundred,
      Profit,
      ten,
      tenThousand,
      thousand,
      total,
      twenty,
      twoHoundred,
      houndred,
      twoThousand,
      sale_amount,
      change,
    });
    await newAccount.save();
    res.json(newAccount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/cash-closing/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cashClosing = await CashClosing.findById(id);
    res.json(cashClosing);
  } catch (error) {
    res.json({
      message: error,
    });
  }
});

router.delete("/cash-closing/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCashClosing = await CashClosing.findByIdAndDelete(id);
    res.json(deletedCashClosing);
  } catch (error) {
    res.json({
      message: error,
    });
  }
});

router.get("/cashes-closing", async (req, res) => {
  try {
    const cashClosing = await CashClosing.find()
      .populate("account")
      .sort({ createdAt: -1 });
    res.json(cashClosing);
  } catch (error) {
    res.json({
      message: error,
    });
  }
});
export default router;
