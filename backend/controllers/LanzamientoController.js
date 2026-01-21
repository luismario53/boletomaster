import Lanzamiento from '../models/Lanzamiento.js';

const LanzamientoController = {

    // Crear
    crear: async (req, res) => {
        try {
            console.log("🎵 Nuevo lanzamiento:", req.body);
            const nuevo = new Lanzamiento(req.body);
            await nuevo.save();
            res.status(201).json({ mensaje: "Lanzamiento creado", lanzamiento: nuevo });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear lanzamiento", error: error.message });
        }
    },

    // Obtener todos (opcional)
    obtenerTodos: async (req, res) => {
        try {
            const lista = await Lanzamiento.find();
            res.json(lista);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener lanzamientos", error: error.message });
        }
    },

    // Obtener por Artista (VITAL PARA EL PERFIL)
    obtenerPorArtista: async (req, res) => {
        try {
            const { idArtista } = req.params;
            const lista = await Lanzamiento.find({ idArtista: idArtista });
            res.json(lista);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al buscar por artista", error: error.message });
        }
    }
};

export default LanzamientoController;