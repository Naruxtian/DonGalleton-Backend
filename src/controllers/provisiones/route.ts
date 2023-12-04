import { Router } from "express";
import {getProvisiones, createProvision, recibirProvision, cancelarProvision} from "./provisionesController";

const router = Router();
router
    .get("/getAll", getProvisiones
    )
    .post("/create", createProvision
    )
    .put("/recibir/:id", recibirProvision
    )
    .put("/cancelar/:id", cancelarProvision
    );

export default router;