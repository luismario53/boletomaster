import EventoDAO from "../dao/EventoDAO.js";

class EventoController {

    async crearEvento(req, res) {
        try {
            const evento = req.body;
            const nuevoEvento = await EventoDAO.insertarEvento(evento);
            res.status(201).json({
                mensaje: "Evento creado correctamente",
                evento: nuevoEvento
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear el evento",
                error: error.message
            });
        }
    }

    async obtenerEventos(req, res) {
        try {
            const eventos = await EventoDAO.obtenerEventos();
            res.status(200).json(eventos);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener los eventos",
                error: error.message
            });
        }
    }

    async obtenerEventoPorId(req, res) {
        try {
            const { id } = req.params;
            const evento = await EventoDAO.obtenerEventoPorId(id);

            if (!evento) {
                return res.status(404).json({ mensaje: "Evento no encontrado" });
            }

            res.status(200).json(evento);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener el evento",
                error: error.message
            });
        }
    }

    async actualizarEvento(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;

            const eventoActualizado = await EventoDAO.actualizarEvento(id, datosActualizados);

            if (!eventoActualizado) {
                return res.status(404).json({ mensaje: "Evento no encontrado" });
            }

            res.status(200).json({
                mensaje: "Evento actualizado correctamente",
                evento: eventoActualizado
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al actualizar el evento",
                error: error.message
            });
        }
    }

    async eliminarEvento(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await EventoDAO.eliminarEvento(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: "Evento no encontrado" });
            }

            res.status(200).json({ mensaje: "Evento eliminado correctamente" });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar el evento",
                error: error.message
            });
        }
    }
}

export default new EventoController();
