import { Router } from "express";
import Sale from "../../models/Sale.js";
import Service from "../../models/Service.js";
import Session from "../../models/Session.js";
import dayjs from "dayjs";

const router = Router();

router.post("/sale", async (req, res) => {
  try {
    const { amount, date, service, account, session } = req.body;
    const foundService = await Service.findById({ _id: service });
    if (!foundService) {
      return res.status(404).json({ message: "No se encontro el servicio" });
    }
    if (foundService.amount < amount) {
      return res.status(414).json({ message: "No tienes suficiente credito" });
    }
    foundService.amount = foundService.amount - amount;
    await foundService.save();

    const newSale = new Sale({
      amount,
      date,
      service,
      account,
      session,
    });
    await newSale.save();
    const foundSession = await Session.findById({ _id: session });
    foundSession.profit += foundService.profit;
    await foundSession.save();
    res.json(newSale);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/sale", async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate(["account", "service"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(sales);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/sales/pagination", async (req, res) => {
  try {
    const { service, account } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = {};
    if (service && service !== "all") {
      query.service = service;
    }

    if (account && account !== "all") {
      query.account = account;
    }

    const sales = await Sale.find(query)
      .populate(["account", "service"])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalSales = await Sale.countDocuments();
    res.json({
      sales,
      totalPages: Math.ceil(totalSales / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/sales/:date/:accountId", async (req, res) => {
  try {
    if (req.params.date === undefined) {
      return res.status(400).json({ message: "Fecha no proporcionada" });
    }
    const { date } = req.params;
    const startDate = dayjs(date).startOf("day").toDate();
    const endDate = dayjs(date).endOf("day").toDate();

    const filter = {
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    };
    if (req.params.accountId !== undefined) {
      filter.account = req.params.accountId;
    }

    const sales = await Sale.find(filter)
      .populate(["account", "service"])
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/sales/amount/:sessionId/:accountId", async (req, res) => {
  try {
    const { sessionId, accountId } = req.params;

    const result = await Sale.find({ session: sessionId, account: accountId });
    res.json({
      totalAmount: result.reduce((acc, sale) => acc + sale.amount, 0),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/sale/:saleId", async (req, res) => {
  try {
    const { saleId } = req.params;
    const { amount, date, service, account, session } = req.body;

    const updateFields = {};
    if (amount !== undefined) updateFields.amount = amount;
    if (date !== undefined) updateFields.date = date;
    if (service !== undefined) updateFields.service = service;
    if (account !== undefined) updateFields.account = account;
    if (session !== undefined) updateFields.session = session;

    const updatedSale = await Sale.findByIdAndUpdate(saleId, updateFields);
    res.json(updatedSale);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/sale/:saleId", async (req, res) => {
  try {
    const { saleId } = req.params;
    const deleteSale = await Sale.findByIdAndDelete(saleId);
    res.json(deleteSale);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
