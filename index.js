import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import api from "./routes/api.js";
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", api);

dotenv.config({ path: './variable.env' })

app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/pages/Principal/main.html"));
});

app.get("/principal", (req, res) => {
  res.sendFile(path.join(__dirname, "src/pages/Principal/main.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`corriendo en http://localhost:${PORT}/principal`);
});
