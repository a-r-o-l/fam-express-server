import { Router } from "express";
import Service from "../../models/Service.js";

const router = Router();

router.post("/service", async (req, res) => {
  try {
    const {
      name,
      amount,
     
    } = req.body;
    const newService = new Service({
      name,
      amount,
    });
    await newService.save();
    res.json(newService);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/service/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const {
      name,
      profit,
      amount,
    } = req.body;


    const updateFields = {};
    if (amount !== undefined) updateFields.amount = amount;
    if (name !== undefined) updateFields.name = name;
    if (profit !== undefined) updateFields.profit = profit;
    const updatedService = await Service.findByIdAndUpdate(serviceId, updateFields);


    res.json(updatedService);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/service/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const deletedService = await Service.findByIdAndDelete(serviceId);
    res.json(deletedService);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/service", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


export default router;
