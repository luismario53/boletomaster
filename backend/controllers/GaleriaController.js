import GaleriaDAO from "../dao/GaleriaDAO.js";

class GaleriaController {

    async crearGaleria(req, res) {
        try {
            const galeria = req.body;
            const nuevoGaleria = await GaleriaDAO.crearGaleria(galeria);
            res.status(201).json({
                mensaje: "Galeria creado correctamente",
                galeria: nuevoGaleria
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear galeria",
                error: error.message
            });
        }
    }

    async obtenerGalerias(req, res) {
        try {
            const galerias = await GaleriaDAO.obtenerTodasLasGalerias();
            res.status(200).json(galerias);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener los galerias",
                error: error.message
            });
        }
    }

    async obtenerGaleriaPorId(req, res) {
        try {
            const { id } = req.params;
            const galeria = await GaleriaDAO.obtenerGaleriaPorId(id);

            if (!galeria) {
                return res.status(404).json({ mensaje: "Galeria no encontrado" });
            }

            res.status(200).json(galeria);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener galeria",
                error: error.message
            });
        }
    }

    async actualizarGaleria(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;

            const galeriaActualizado = await GaleriaDAO.actualizarGaleria(id, datosActualizados);

            if (!galeriaActualizado) {
                return res.status(404).json({ mensaje: "Galeria no encontrado" });
            }

            res.status(200).json({
                mensaje: "Galeria actualizado correctamente",
                galeria: galeriaActualizado
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al actualizar galeria",
                error: error.message
            });
        }
    }

    async eliminarGaleria(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await GaleriaDAO.eliminarGaleria(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: "Galeria no encontrado" });
            }

            res.status(200).json({ mensaje: "Galeria eliminado correctamente" });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar galeria",
                error: error.message
            });
        }
    }
}

export default new GaleriaController();
