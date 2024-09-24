import { Router } from "express";
import Session from "../../models/Session.js";

const router = Router();

router.post("/session", async (req, res) => {
  try {
    const { opening, closing, change, profit, date } = req.body;
    const newSession = new Session({ opening, closing, change, profit, date });
    await newSession.save();
    res.json(newSession);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { opening, closing, change, profit, date } = req.body;

    const updateFields = {};
    if (opening !== undefined) updateFields.opening = opening;
    if (closing !== undefined) updateFields.closing = closing;
    if (change !== undefined) updateFields.change = change;
    if (profit !== undefined) updateFields.profit = profit;
    if (date !== undefined) updateFields.date = date;

    const updatedSale = await Session.findByIdAndUpdate(
      sessionId,
      updateFields
    );
    res.json(updatedSale);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const deleteSession = await Session.findByIdAndDelete(sessionId);
    res.json(deleteSession);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
