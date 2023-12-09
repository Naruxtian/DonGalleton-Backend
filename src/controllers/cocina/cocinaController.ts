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
            cantidadLotes: parseInt(cantidadLotes),
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

        const ordenesCocina: any[] = [];
        const q = query(collection(db, "ordenesCocina"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            ordenesCocina.push({ ...doc.data(), id: doc.id});
        });

        let ordenCocina;

        ordenesCocina.forEach(async (orden) => {
            if(orden.id == id){
                ordenCocina = orden;
            }
        });

        const galletas: any[] = [];
        const q2 = query(collection(db, "galletas"));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            doc.data().id = doc.id;
            galletas.push({ ...doc.data(), id: doc.id});
        });

        let galletaData;
        galletas.forEach(async (galleta) => {
            if(galleta.id == ordenCocina!.id_galleta){
                galletaData = galleta;
         }
        });
        
        galletaData!.inventario = galletaData!.inventario + (ordenCocina!.cantidadLotes * galletaData!.cantidadLote);

        const docRef2 = doc(db, "galletas", galletaData!.id!);
        const update2 = {
            inventario: galletaData!.inventario,
        };
        await updateDoc(docRef2, update2);

        const inventarios: any[] = [];
        const q3 = query(collection(db, "materiaPrima"));
        const querySnapshot3 = await getDocs(q3);
        querySnapshot3.forEach((doc) => {
            doc.data().id = doc.id;
            inventarios.push({ ...doc.data(), id: doc.id});
        });

        galletaData!.ingredientes.forEach((ingrediente: any) => {
            inventarios.forEach(async (inventario) => {
                if(ingrediente.materiaPrima == inventario.id){
                    inventario.inventario = inventario.inventario - (ingrediente.cantidad * ordenCocina!.cantidadLotes);
                    const docRef3 = doc(db, "materiaPrima", inventario.id!);
                    const update3 = {
                        inventario: inventario.inventario,
                    };
                    await updateDoc(docRef3, update3);
                }
            });
        });

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