import express from "express";
import dotenv from "dotenv"; 
import connectDB from "./config/dbConnect.js";
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/events', eventRoutes);

app.use((err, req, res, next) => {
  console.error("Server Error Stack:", err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})


