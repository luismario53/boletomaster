import express from "express"
const router = express.Router()
import { crearHeadersConAuth } from '../middleware/proxyAuth.js'
// URL de tu API externa
const API_BASE_URL = process.env.API_URL_DEV || "http://localhost:5000"

router.get("/", async (req, res) => {
  try {

    const response = await fetch(`${API_BASE_URL}/api/merch`)
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ error: "Error al conectar con el servidor" })
  }
})

router.get("/:id", async (req, res) => {
  try {

    const { id } = req.params;
    const response = await fetch(`${API_BASE_URL}/api/merch/${id}`)
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ error: "Error al conectar con el servidor" })
  }
})

// POST /api/auth/login
router.post("/", async (req, res) => {
  try {
    const merch = req.body

    const response = await fetch(`${API_BASE_URL}/api/merch`, {
      method: "POST",
      headers: crearHeadersConAuth(req),
      body: JSON.stringify(merch),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ error: "Error al conectar con el servidor" })
  }
})

export default router