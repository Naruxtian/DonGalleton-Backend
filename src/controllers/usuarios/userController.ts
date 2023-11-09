import { addDoc, collection, doc, getDocs, query, updateDoc} from "firebase/firestore";
import asyncHandler from "../../middleware/async"
import ResponseHttp from "../../util/response";
import ErrorResponse from "../../util/errorResponse";
import { NextFunction, Request, Response } from "express";
import {db} from "../../config/firebaseConfig";
import { User } from "../../models/user";

export const registerUser = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password, name, rol, cellphone, adress } = req.body;
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const usrs: any[] = [];
        querySnapshot.forEach((doc) => {
            usrs.push({ ...doc.data(), id: doc.id });
        });

        const user = usrs.find((user) => user.email === email);
        if (user) {
            return next(new ErrorResponse("El email ya está registrado", 400));
        }
        const newUser: User = {
            nombre: name,
            email: email,
            password: password,
            rol: rol,
            telefono: cellphone,
            direccion: adress,
        };
        const docRef = await addDoc(collection(db, "users"), newUser);
        if(docRef){
            new ResponseHttp(res).send("Usuario creado correctamente", newUser, true, 200);
        }
        else{
            return next(new ErrorResponse("Ocurrió un error al crear el usuario", 500));
        }
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const login = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const usrs: any[] = [];
        querySnapshot.forEach((doc) => {
            usrs.push({ ...doc.data(), id: doc.id });
        });

        const user = usrs.find((user) => user.email === email && user.password === password);
        if (!user) {
            return next(new ErrorResponse("El email o la contraseña no son correctos", 400));
        }
        new ResponseHttp(res).send("Usuario logueado correctamente", user, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const usrs: any[] = [];
        querySnapshot.forEach((doc) => {
            usrs.push({ ...doc.data(), id: doc.id });
        });
        new ResponseHttp(res).send("Usuarios obtenidos correctamente", usrs, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
    }
});