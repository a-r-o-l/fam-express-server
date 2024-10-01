import { Router } from "express";
import PaymentSession from "../../models/PaymentSession.js";

const router = Router();

router.get("/payment-session/active", async (req, res) => {
  try {
    const paymentSessions = await PaymentSession.find({ closed: false });
    res.json(paymentSessions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/payment-session/all", async (req, res) => {
  try {
    const paymentSessions = await PaymentSession.find();
    res.json(paymentSessions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/payment-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const paymentSession = await PaymentSession.findById(sessionId);
    res.json(paymentSession);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/payment-session", async (req, res) => {
  try {
    const activeSession = await PaymentSession.findOne({ closed: false });
    if (activeSession) {
      return res.status(410).json({ message: "Ya existe una sesión activa." });
    }
    const { date, transfer, cash, total, totalPayments, closed, balance } =
      req.body;
    const newSession = new PaymentSession({
      date,
      transfer,
      cash,
      total,
      totalPayments,
      closed,
      balance,
    });
    await newSession.save();
    res.json(newSession);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/payment-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { date, transfer, cash, total, totalPayments, closed, balance } =
      req.body;

    const updateFields = {};
    if (transfer !== undefined) updateFields.transfer = transfer;
    if (cash !== undefined) updateFields.cash = cash;
    if (total !== undefined) updateFields.total = total;
    if (totalPayments !== undefined) updateFields.totalPayments = totalPayments;
    if (closed !== undefined) updateFields.closed = closed;
    if (balance !== undefined) updateFields.balance = balance;
    if (date !== undefined) updateFields.date = date;

    const updatedSale = await PaymentSession.findByIdAndUpdate(
      sessionId,
      updateFields
    );
    res.json(updatedSale);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/payment-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const deleteSession = await PaymentSession.findByIdAndDelete(sessionId);
    res.json(deleteSession);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
