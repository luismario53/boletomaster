import MercanciaDAO from "../dao/MercanciaDAO.js";

class MercanciaController {

    async crearMercancia(req, res) {
        try {
            const mercancia = req.body;
            const nuevaMercancia = await MercanciaDAO.crearMercancia(mercancia);
            res.status(201).json({
                mensaje: "Mercancia creada correctamente",
                mercancia: nuevaMercancia
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear la mercancia",
                error: error.message
            });
        }
    }

    async obtenerTodaLaMercancia(req, res) {
        try {
            const mercancia = await MercanciaDAO.obtenerTodaLaMercancia({activo: true});
            res.status(200).json(mercancia);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener la mercancia",
                error: error.message
            });
        }
    }

    async obtenerMercanciaPorArtista(req, res) {
        try {
            const { idArtista } = req.params
            const mercancia = await MercanciaDAO.obtenerMercanciaPorArtista(idArtista);
            res.status(200).json(mercancia);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener la mercancia",
                error: error.message
            });
        }
    }

    async obtenerMercanciaPorId(req, res) {
        try {
            const { id } = req.params;
            const mercancia = await MercanciaDAO.obtenerMercanciaPorId(id);

            if (!mercancia) {
                return res.status(404).json({ mensaje: "Mercancia no encontrado" });
            }

            res.status(200).json(mercancia);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener la mercancia",
                error: error.message
            });
        }
    }

    async actualizarMercancia(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;

            const mercanciaActualizada = await MercanciaDAO.actualizarMercancia(id, datosActualizados);

            if (!mercanciaActualizada) {
                return res.status(404).json({ mensaje: "Mercancia no encontrado" });
            }

            res.status(200).json({
                mensaje: "Mercancia actualizado correctamente",
                mercancia: mercanciaActualizada
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al actualizar la mercancia",
                error: error.message
            });
        }
    }

    async eliminarMercancia(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await MercanciaDAO.eliminarMercancia(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: "Mercancia no encontrado" });
            }

            res.status(200).json({ mensaje: "Mercancia eliminado correctamente" });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar la mercancia",
                error: error.message
            });
        }
    }

    async desactivarMercancia(req, res) {
        try {
            const { id } = req.params;
            const desactivado = await MercanciaDAO.desactivarMercancia(id);

            if (!desactivado) {
                return res.status(404).json({ mensaje: "Mercancia no encontrado" });
            }

            res.status(200).json({ mensaje: "Mercancia eliminado correctamente" });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al desactivar la mercancia",
                error: error.message
            });
        }
    }
}

export default new MercanciaController();
