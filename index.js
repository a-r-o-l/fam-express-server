import app from "./app.js";
import { startConnection } from "./database.js";

startConnection();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
