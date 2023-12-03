import { Router } from "express";
import { getAllGalletas, insertGalleta, updateGalleta, deleteGalleta, mermarGalleta} from "./galletasController";

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
    );

export default router;