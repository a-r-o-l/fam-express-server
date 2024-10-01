import { Router } from "express";
import Payment from "../../models/Payment.js";
import PaymentSession from "../../models/PaymentSession.js";

const router = Router();

router.get("/payment/:paymentSessionId", async (req, res) => {
  try {
    const { paymentSessionId } = req.params;
    const payments = await Payment.find({ payment_session: paymentSessionId });
    res.json({
      transfer: payments.filter((payment) => payment.type === "transfer"),
      cash: payments.filter((payment) => payment.type === "cash"),
      length: payments.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/payment", async (req, res) => {
  try {
    const { description, amount, date, type, receipt, payment_session } =
      req.body;
    const newPayment = new Payment({
      description,
      amount,
      date,
      type,
      receipt,
      payment_session,
    });
    const foundSession = await PaymentSession.findById(payment_session);
    if (!foundSession) {
      return res.status(404).json({ message: "Sesión no encontrada." });
    }
    if (type === "cash") {
      if (foundSession.cash < amount) {
        return res.status(410).json({
          message: "No hay suficiente efectivo para realizar el pago.",
        });
      }
      foundSession.cash -= amount;
    } else {
      if (foundSession.transfer < amount) {
        return res.status(410).json({
          message:
            "No hay suficiente dinero en la cuenta para realizar el pago.",
        });
      }
      foundSession.transfer -= amount;
    }
    await newPayment.save();
    await foundSession.save();
    res.json(newPayment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/payment/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { description, amount, date, type, receipt, payment_session } =
      req.body;

    const updateFields = {};
    if (description !== undefined) updateFields.description = description;
    if (amount !== undefined) updateFields.amount = amount;
    if (type !== undefined) updateFields.type = type;
    if (receipt !== undefined) updateFields.receipt = receipt;
    if (payment_session !== undefined)
      updateFields.payment_session = payment_session;
    if (date !== undefined) updateFields.date = date;

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      updateFields
    );
    res.json(updatedPayment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/payment/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    res.json(deletedPayment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
