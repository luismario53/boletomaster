import express from "express";
const router = express.Router();
import { crearHeadersConAuth } from '../middleware/proxyAuth.js'
// URL de tu API externa
const API_BASE_URL = process.env.API_URL_DEV || "http://localhost:5000";

router.get("/", async (req, res) => {
  
})

// POST /api/auth/login
router.post("/", async (req, res) => {
  try {
    const evento = req.body

    const response = await fetch(`${API_BASE_URL}/api/ordenes`, {
      method: "POST",
      headers: crearHeadersConAuth(req),
      body: JSON.stringify(evento),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(500).json({ error: "Error al conectar con el servidor" });
  }
});

export default router;