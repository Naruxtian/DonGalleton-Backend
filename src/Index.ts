import { Router } from "express";
import usersRoute from "./controllers/usuarios/route";
import galletasRoute from "./controllers/galletas/route";
import materiaPrimaRoute from "./controllers/materiaPrima/route";
import proveedoresRoute from "./controllers/provedores/route";
import pedidosRoute from "./controllers/pedidos/route";
import provisionesRoute from "./controllers/provisiones/route";

const router = Router();
router
    .use("/users", usersRoute
    )
    .use("/galletas", galletasRoute
    )
    .use("/materiaPrima", materiaPrimaRoute
    )
    .use("/proveedores", proveedoresRoute
    )
    .use("/pedidos", pedidosRoute
    )
    .use("/provisiones", provisionesRoute
    );

export default router;