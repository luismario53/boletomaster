import express from "express";
import ItemController from "../controllers/ItemController.js";

const router = express.Router();

router.post("/", ItemController.crearItem);
router.get("/", ItemController.obtenerItems);
router.get("/:id", ItemController.obtenerItemPorId);
router.put("/:id", ItemController.actualizarItem);
router.delete("/:id", ItemController.eliminarItem);

export default router;
