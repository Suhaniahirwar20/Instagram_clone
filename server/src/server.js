import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import {initSocket} from "./socket.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
initSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }catch (error) {
    console.log("server failed:",error.message);
    process.exit(1);
  }
};

startServer();