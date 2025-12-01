import ArtistaDAO from "../dao/ArtistaDAO.js";

class ArtistaController {

    async crearArtista(req, res) {
        try {
            const artista = req.body;
            const nuevoArtista = await ArtistaDAO.crearArtista(artista);
            res.status(201).json({
                mensaje: "Aritsta creado correctamente",
                artista: nuevoArtista
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear el artista",
                error: error.message
            });
        }
    }

    async obtenerArtistas(req, res) {
        try {
            const artistas = await ArtistaDAO.obtenerArtistas();
            res.status(200).json(artistas);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener los artistas",
                error: error.message
            });
        }
    }

    async obtenerArtistaPorId(req, res) {
        try {
            const { id } = req.params;
            const artista = await ArtistaDAO.obtenerArtistaById(id);

            if (!artista) {
                return res.status(404).json({ mensaje: "Artista no encontrado" });
            }

            res.status(200).json(artista);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener el artista",
                error: error.message
            });
        }
    }

    async actualizarArtista(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;

            const artistaActualizado = await ArtistaDAO.actualizarArtista(id, datosActualizados);

            if (!artistaActualizado) {
                return res.status(404).json({ mensaje: "Artista no encontrado" });
            }

            res.status(200).json({
                mensaje: "Artista actualizado correctamente",
                artista: artistaActualizado
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al actualizar el artista",
                error: error.message
            });
        }
    }

    async eliminarArtista(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await ArtistaDAO.eliminarArtista(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: "Artista no encontrado" });
            }

            res.status(200).json({ mensaje: "Artista eliminado correctamente" });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar el ertista",
                error: error.message
            });
        }
    }
}

export default new ArtistaController();
