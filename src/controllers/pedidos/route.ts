import { Router } from "express";
import {getPedidos, getPedidosUser, getPedido, createPedido, procesarPedido, enviarPedido, completarPedido, cancelarPedido} from "./pedidosController";

const router = Router();

router
    .get("/getAll", getPedidos
    )
    .get("/getFromUser/:id", getPedidosUser
    )
    .get("/get/:id", getPedido
    )
    .post("/create", createPedido
    )
    .put("/procesar/:id", procesarPedido
    )
    .put("/enviar/:id", enviarPedido
    )
    .put("/completar/:id", completarPedido
    )
    .put("/cancelar/:id", cancelarPedido
    );

export default router;