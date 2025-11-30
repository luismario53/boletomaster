import ItemDAO from "../dao/ItemDAO.js";
import AppError from "../utils/AppError.js";

class ItemController {
    static async crearItem(req, res, next) {
        try {
            const nuevoItem = await ItemDAO.crear(req.body);
            res.status(201).json(nuevoItem);
        } catch (error) {
            next(new AppError("Error al crear el ítem", 500, error.message));
        }
    }

    static async obtenerItems(req, res, next) {
        try {
            const items = await ItemDAO.obtenerTodos();
            res.json(items);
        } catch (error) {
            next(new AppError("Error al obtener los ítems", 500, error.message));
        }
    }

    static async obtenerItemPorId(req, res, next) {
        try {
            const { id } = req.params;
            const item = await ItemDAO.obtenerPorId(id);

            if (!item) {
                return next(new AppError("Ítem no encontrado", 404));
            }

            res.json(item);
        } catch (error) {
            next(new AppError("Error al obtener el ítem", 500, error.message));
        }
    }

    static async actualizarItem(req, res, next) {
        try {
            const { id } = req.params;
            const itemActualizado = await ItemDAO.actualizar(id, req.body);

            if (!itemActualizado) {
                return next(new AppError("Ítem no encontrado para actualizar", 404));
            }

            res.json(itemActualizado);
        } catch (error) {
            next(new AppError("Error al actualizar el ítem", 500, error.message));
        }
    }

    static async eliminarItem(req, res, next) {
        try {
            const { id } = req.params;
            const eliminado = await ItemDAO.eliminar(id);

            if (!eliminado) {
                return next(new AppError("Ítem no encontrado para eliminar", 404));
            }

            res.json({ mensaje: "Ítem eliminado correctamente" });
        } catch (error) {
            next(new AppError("Error al eliminar el ítem", 500, error.message));
        }
    }
}

export default ItemController;
