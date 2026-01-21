import Evento from "../models/Evento.js";

const EventoController = {

  // POST /api/eventos
  crearEvento: async (req, res) => {
    try {
      console.log("Creando evento. Lineup:", req.body.artistas);
      
      const evento = new Evento(req.body);
      
      // Si el middleware de auth guardó el usuario, lo asignamos como creador
      if (req.usuario) evento.creador = req.usuario.id;

      await evento.save();
      
      res.status(201).json({ 
          mensaje: "Evento creado correctamente", 
          evento 
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el evento", error: error.message });
    }
  },

  // GET /api/eventos (Para el Home)
  obtenerEventos: async (req, res) => {
    try {
      // .populate('artistas') sirve para traer el nombre del artista en lugar de solo su ID
      const eventos = await Evento.find().populate('artistas', 'nombre imagenes');
      res.status(200).json(eventos);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener los eventos", error: error.message });
    }
  },

  // GET /api/eventos/:id (Para el Perfil del Evento)
  obtenerEventoPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const evento = await Evento.findById(id).populate('artistas', 'nombre imagenes biografia');

      if (!evento) {
        return res.status(404).json({ mensaje: "Evento no encontrado" });
      }

      res.status(200).json(evento);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener el evento", error: error.message });
    }
  },

  // === NUEVO: OBTENER EVENTOS DE UN ARTISTA ESPECÍFICO ===
  // GET /api/eventos/artista/:idArtista
  obtenerEventosPorArtista: async (req, res) => {
      try {
          const { idArtista } = req.params;
          console.log("🔍 Buscando eventos donde participe artista:", idArtista);

          // Mongo es inteligente: Si 'artistas' es un array, .find busca si el ID está dentro
          const eventos = await Evento.find({ artistas: idArtista });
          
          res.status(200).json(eventos);
      } catch (error) {
          res.status(500).json({ mensaje: "Error al buscar eventos del artista", error: error.message });
      }
  },

  // PUT /api/eventos/:id
  actualizarEvento: async (req, res) => {
    try {
      const { id } = req.params;
      const eventoActualizado = await Evento.findByIdAndUpdate(id, req.body, { new: true });

      if (!eventoActualizado) {
        return res.status(404).json({ mensaje: "Evento no encontrado" });
      }

      res.status(200).json({ 
          mensaje: "Evento actualizado correctamente", 
          evento: eventoActualizado 
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar el evento", error: error.message });
    }
  },

  // DELETE /api/eventos/:id
  eliminarEvento: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await Evento.findByIdAndDelete(id);

      if (!eliminado) {
        return res.status(404).json({ mensaje: "Evento no encontrado" });
      }

      res.status(200).json({ mensaje: "Evento eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al eliminar el evento", error: error.message });
    }
  }
};

export default EventoController;