import { Router } from "express";
import { getAllMateriasPrimas, insertMateriaPrima, deleteMateriaPrimaa} from "./materiaPrimaController";

const router = Router();

router
    .get("/getAll", getAllMateriasPrimas
    )
    .post("/insert", insertMateriaPrima
    )    
    .delete("/delete/:id", deleteMateriaPrimaa
    );

export default router;