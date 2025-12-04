import Mercancia from '../models/Mercancia.js'; // Importamos el modelo directamente

const MercanciaController = {

    // crearMercancia
    crearMercancia: async (req, res) => {
        try {
            console.log("👕 Creando merch:", req.body);
            const nuevaMerch = req.body

            nuevaMerch['TipoProducto'] = 'Mercancia'
            const nuevaMercancia = new Mercancia(nuevaMerch);
            await nuevaMercancia.save();
            
            res.status(201).json({ 
                mensaje: "Mercancia creada correctamente", 
                mercancia: nuevaMercancia 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al crear la mercancia", error: error.message });
        }
    },

    // obtenerTodaLaMercancia
    obtenerTodaLaMercancia: async (req, res) => {
        try {
            const mercancia = await Mercancia.find().populate('idArtista'); // Trae todo
            res.status(200).json(mercancia);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener la mercancia", error: error.message });
        }
    },

    // obtenerMercanciaPorId
    obtenerMercanciaPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const mercancia = await Mercancia.findById(id);

            if (!mercancia) {
                return res.status(404).json({ mensaje: "Mercancia no encontrada" });
            }
            res.status(200).json(mercancia);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener la mercancia", error: error.message });
        }
    },

    // obtenerMercanciaPorArtista
    obtenerMercanciaPorArtista: async (req, res) => {
        try {
            const { artista } = req.params; // El ID que viene en la URL

            // IMPORTANTE: Asegúrate de que en tu Modelo (Mongo) el campo se llame "idArtista"
            const mercancia = await Mercancia.find({ idArtista: artista });
            
            res.status(200).json(mercancia);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al buscar por artista", error: error.message });
        }
    },

    // actualizarMercancia
    actualizarMercancia: async (req, res) => {
        try {
            const { id } = req.params;
            const mercanciaActualizada = await Mercancia.findByIdAndUpdate(id, req.body, { new: true });

            if (!mercanciaActualizada) {
                return res.status(404).json({ mensaje: "Mercancia no encontrada" });
            }

            res.status(200).json({ 
                mensaje: "Mercancia actualizada correctamente", 
                mercancia: mercanciaActualizada 
            });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar", error: error.message });
        }
    },

    // eliminarMercancia
    eliminarMercancia: async (req, res) => {
        try {
            const { id } = req.params;
            const eliminado = await Mercancia.findByIdAndDelete(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: "Mercancia no encontrada" });
            }
            res.status(200).json({ mensaje: "Mercancia eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
        }
    }
};

export default MercanciaController;