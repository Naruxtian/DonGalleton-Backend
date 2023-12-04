import { Router } from "express";
import {cocinarOrden, getOrdenesCocina, cancelarOrden, completarOrden, createOrdenCocina} from "./cocinaController";

const router = Router();

router
    .get("/getAll", getOrdenesCocina
    )
    .post("/create", createOrdenCocina
    )
    .put("/cocinar", cocinarOrden
    )
    .put("/completar", completarOrden
    )
    .put("/cancelar", cancelarOrden
    );

export default router;