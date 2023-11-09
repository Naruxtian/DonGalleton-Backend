import { Router } from "express";
import { registerUser, login, getUsers } from "./userController";

const router = Router();

router
    .get("/getAll", getUsers
    )
    .post("/register", registerUser
    )
    .post("/login", login
    );

export default router;