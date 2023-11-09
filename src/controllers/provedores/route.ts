import { Router } from "express";
import {getProvedores, insertProveedor, updateProveedor, deleteProveedor} from "./provedorController";

const router = Router();

router
    .get("/getAll", getProvedores
    )
    .post("/insert", insertProveedor
    )
    .put("/update/:id", updateProveedor
    )
    .delete("/delete/:id", deleteProveedor
    );

export default router;