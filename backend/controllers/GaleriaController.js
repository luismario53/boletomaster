import Galeria from '../models/Galeria.js'; // Importamos el modelo directo

const GaleriaController = {

    // crearGaleria
    crearGaleria: async (req, res) => {
        try {
            console.log("📷 Creando galería:", req.body);
            const nuevaGaleria = new Galeria(req.body);
            await nuevaGaleria.save();
            
            res.status(201).json({ 
                mensaje: "Galería creada correctamente", 
                galeria: nuevaGaleria 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al crear galería", error: error.message });
        }
    },

    // obtenerGalerias
    obtenerGalerias: async (req, res) => {
        try {
            const galerias = await Galeria.find().sort({ createdAt: -1 }); // Las más nuevas primero
            res.status(200).json(galerias);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener galerías", error: error.message });
        }
    },

    // obtenerGaleriaPorId
    obtenerGaleriaPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const galeria = await Galeria.findById(id);

            if (!galeria) {
                return res.status(404).json({ mensaje: "Galería no encontrada" });
            }
            res.status(200).json(galeria);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener galería", error: error.message });
        }
    },

    // actualizarGaleria
    actualizarGaleria: async (req, res) => {
        try {
            const { id } = req.params;
            const galeriaActualizada = await Galeria.findByIdAndUpdate(id, req.body, { new: true });

            if (!galeriaActualizada) {
                return res.status(404).json({ mensaje: "Galería no encontrada" });
            }

            res.status(200).json({ 
                mensaje: "Galería actualizada correctamente", 
                galeria: galeriaActualizada 
            });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar", error: error.message });
        }
    },

    // eliminarGaleria
    eliminarGaleria: async (req, res) => {
        try {
            const { id } = req.params;
            const eliminado = await Galeria.findByIdAndDelete(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: "Galería no encontrada" });
            }
            res.status(200).json({ mensaje: "Galería eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
        }
    }
};

export default GaleriaController;