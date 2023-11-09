import { Router } from "express";
import { getAllGalletas, insertGalleta, updateGalleta, deleteGalleta} from "./galletasController";

const router = Router();

router
    .get("/getAll", getAllGalletas
    )
    .post("/insert", insertGalleta
    )
    .put("/update", updateGalleta
    )
    .delete("/delete/:id", deleteGalleta
    );

export default router;