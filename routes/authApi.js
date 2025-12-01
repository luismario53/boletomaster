import express from "express";
const router = express.Router();
// URL de tu API externa
const API_BASE_URL = process.env.API_URL_DEV || "http://localhost:5000";


// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al conectar con el servidor" });
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error en refresh:", error);
    res.status(500).json({ error: "Error al renovar token" });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al conectar con el servidor" });
  }
});

// GET /api/auth/me (verificar sesión)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: token },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al verificar sesión" });
  }
});

export default router;