import { Router } from "express";
import { getAllMateriasPrimas, insertMateriaPrima, deleteMateriaPrimaa, mermarMateriaPrima} from "./materiaPrimaController";

const router = Router();

router
    .get("/getAll", getAllMateriasPrimas
    )
    .post("/insert", insertMateriaPrima
    )    
    .delete("/delete/:id", deleteMateriaPrimaa
    )
    .put("/mermar/:id", mermarMateriaPrima
    );

export default router;