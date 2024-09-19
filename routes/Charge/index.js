import { Router } from "express";
import Sale from "../../models/Sale.js";
import Service from "../../models/Service.js";
import dayjs from "dayjs";
import Charge from "../../models/Charge.js";

const router = Router();

router.post("/charge", async (req, res) => {
  try {
    const {
      amount,
      date,
      service,
    } = req.body;
    const foundService = await Service.findById(service);
  if (!foundService) {
    throw new Error('Servicio no encontrado');
  }
  const newCharge = new Charge({
    service,
    amount: amount,
    date
  });
  await newCharge.save();
  foundService.amount += amount;
  await foundService.save();
  res.json(newCharge);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



router.get("/charges", async (req, res) => {
  try {
    const charges = await Charge.find().populate(['service']).sort({ createdAt: -1 })
    .limit(20);
    res.json(charges);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/charges/pagination", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const charges = await Charge.find()
      .populate(['service'])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalcharges = await Sale.countDocuments();
    res.json({
      charges,
      totalPages: Math.ceil(totalcharges / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/charges/:date", async (req, res) => {
  try {
    if (req.params.date === undefined) {
      return res.status(400).json({ message: "Fecha no proporcionada" });
    }
    const { date } = req.params;
    const startDate = dayjs(date).startOf('day').toDate();
    const endDate = dayjs(date).endOf('day').toDate();

    const charges = await Charge.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate
      }
    })
    .populate(['service'])
    .sort({ createdAt: -1 })

    res.json(charges);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/charge/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      amount,
      date,
      service,
    } = req.body;
    if (!!service) {
      const foundService = await Service.findById(service);
      if (!foundService) {
        throw new Error('Servicio no encontrado');
      }
    }
    const charge = await Charge.findById(id);
    if (!charge) {
      throw new Error('Carga no encontrada');
    }
    if (amount !== undefined && amount !== null) charge.amount = amount;
    if (date !== undefined && date !== null) charge.date = date;
    if (service !== undefined && service !== null) charge.service = service;
    await charge.save();
    res.json(charge);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/charge/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const charge = await Charge.findById(id);
    if(!charge) {
      throw new Error('Carga no encontrada');
    }
    await charge.remove();
    res.json({ message: 'Carga eliminada' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})


export default router;


