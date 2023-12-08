import { addDoc, collection, doc, getDocs, query, where, updateDoc} from "firebase/firestore";
import asyncHandler from "../../middleware/async"
import ResponseHttp from "../../util/response";
import ErrorResponse from "../../util/errorResponse";
import { NextFunction, Request, Response } from "express";
import {db} from "../../config/firebaseConfig";
import { ordenCocina } from "../../models/ordenCocina";
import { Galleta } from "../../models/galleta";

//Pendiente - cocinando - completado - cancelado
//1 - 2 - 3 - 0

export const createOrdenCocina = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id_galleta, cantidadLotes} = req.body;
        
        const newOrdenCocina: ordenCocina = {
            id_galleta: id_galleta,
            cantidadLotes: cantidadLotes,
            fecha: new Date(),
            estatus: 1,
        };
        const docRef = await addDoc(collection(db, "ordenesCocina"), newOrdenCocina);

        if(docRef){
            new ResponseHttp(res).send("Orden de cocina creada correctamente", newOrdenCocina, true, 200);
        }
        else{
            return next(new ErrorResponse("Ocurrió un error al crear la orden de cocina", 500));
        }
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getOrdenesCocina = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const ordenesCocina: ordenCocina[] = [];
        const q = query(collection(db, "ordenesCocina"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const orden = doc.data() as ordenCocina;
            orden.id = doc.id; 
            ordenesCocina.push(orden);
          });
        new ResponseHttp(res).send("Ordenes de cocina obtenidas correctamente", ordenesCocina, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const cocinarOrden = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.body;
        const docRef = doc(db, "ordenesCocina", id);
        const update = {
            estatus: 2,
        };
        await updateDoc(docRef, update);
        new ResponseHttp(res).send("Orden de cocina actualizada correctamente", null, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const completarOrden = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.body;
        const docRef = doc(db, "ordenesCocina", id);
        const update = {
            estatus: 3,
        };
        await updateDoc(docRef, update);

        const ordenCocina: ordenCocina[] = [];
        const q = query(collection(db, "ordenesCocina"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            ordenCocina.push(doc.data() as ordenCocina);
        });

        const galleta: Galleta[] = [];
        const q2 = query(collection(db, "galletas"), where("id", "==", ordenCocina[0].id_galleta));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            doc.data().id = doc.id;
            galleta.push(doc.data() as Galleta);
        });
        const galletaData = galleta[0];
        galletaData.inventario = galletaData.inventario + (ordenCocina[0].cantidadLotes * galletaData.cantidadLote);

        const docRef2 = doc(db, "galletas", galletaData.id!);
        const update2 = {
            inventario: galletaData.inventario,
        };
        await updateDoc(docRef2, update2);


        new ResponseHttp(res).send("Orden de cocina terminada correctamente", null, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const cancelarOrden = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.body;
        const docRef = doc(db, "ordenesCocina", id);
        const update = {
            estatus: 0,
        };
        await updateDoc(docRef, update);
        new ResponseHttp(res).send("Orden de cocina cancelada correctamente", null, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});