import { addDoc, collection, doc, getDocs, query, updateDoc} from "firebase/firestore";
import asyncHandler from "../../middleware/async"
import ResponseHttp from "../../util/response";
import ErrorResponse from "../../util/errorResponse";
import { NextFunction, Request, Response } from "express";
import {db} from "../../config/firebaseConfig";
import { Proveedor } from "../../models/proveedor";

export const insertProveedor = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {nombre, telefono, empresa, direccion, email, producto, estatus} = req.body;
        
        const newProveedor: Proveedor = {
            nombre: nombre,
            telefono: telefono,
            empresa: empresa,
            direccion: direccion,
            email: email,
            producto: producto,
            estatus: estatus
        };
        const docRef = await addDoc(collection(db, "proveedores"), newProveedor);

        if(docRef){
            new ResponseHttp(res).send("Proveedor creado correctamente", newProveedor, true, 200);
        }
        else{
            return next(new ErrorResponse("Ocurrió un error al crear el proveedor", 500));
        }
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getProvedores = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const q = query(collection(db, "proveedores"));
        const querySnapshot = await getDocs(q);
        const proveedores: any[] = [];
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            proveedores.push({ ...doc.data(), id: doc.id });
        });
        new ResponseHttp(res).send("Proveedores obtenidos correctamente", proveedores, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const updateProveedor = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {nombre, telefono, empresa, direccion, email, producto} = req.body;
        const id = req.params.id;
        const docRef = doc(db, "proveedores", id);
        await updateDoc(docRef, {
            nombre: nombre,
            telefono: telefono,
            empresa: empresa,
            direccion: direccion,
            email: email,
            producto: producto,
        });
        new ResponseHttp(res).send("Proveedor actualizado correctamente", null, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const deleteProveedor = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.params.id;
        const docRef = doc(db, "proveedores", id);
        await updateDoc(docRef, {
            estatus: false
        });
        new ResponseHttp(res).send("Proveedor eliminado correctamente", null, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});
