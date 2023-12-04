import { Router } from "express";
import { getAllGalletas, insertGalleta, updateGalleta, deleteGalleta, mermarGalleta, addIngrediente, removeIngrediente} from "./galletasController";

const router = Router();

router
    .get("/getAll", getAllGalletas
    )
    .post("/insert", insertGalleta
    )
    .put("/update", updateGalleta
    )
    .delete("/delete/:id", deleteGalleta
    )
    .put("/mermar", mermarGalleta
    )
    .put("/addIngrediente", addIngrediente
    )
    .put("/removeIngrediente", removeIngrediente
    );

export default router;