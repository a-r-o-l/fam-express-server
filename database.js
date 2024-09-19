import { connect } from "mongoose";
import {config  } from "dotenv";
config();
// const dbUrl = process.env.MONGO_PUBLIC_URL;
const dbUrl ="mongodb://localhost:27017/virtual_charges_server"

export const startConnection = async () => {
  try {
    if(!dbUrl) throw new Error("MongoDB URL is not defined");
    const db = await connect(dbUrl);
    console.log("Database is connected to:", db.connection.name);
  } catch (error) {
    console.log(error);
  }
};
