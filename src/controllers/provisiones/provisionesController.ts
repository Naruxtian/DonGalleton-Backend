import { addDoc, collection, doc, getDocs, query, where, updateDoc, getDoc} from "firebase/firestore";
import asyncHandler from "../../middleware/async"
import ResponseHttp from "../../util/response";
import ErrorResponse from "../../util/errorResponse";
import { NextFunction, Request, Response } from "express";
import {db} from "../../config/firebaseConfig";
import { Provision } from "../../models/provision";

//Realizado - Recibido - Cancelado
//1 - 2 - 0

export const createProvision = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {proveedor, materiaPrima, cantidad, costoTotal} = req.body;
        
        const newProvision: Provision = {
            proveedor: proveedor,
            materiaPrima: materiaPrima,
            cantidad: cantidad,
            costoTotal: costoTotal,
            fechaPedido: new Date(),
            estatus: 1,
        };
        const docRef = await addDoc(collection(db, "provisiones"), newProvision);

        if(docRef){
            new ResponseHttp(res).send("Provision creado correctamente", newProvision, true, 200);
        }
        else{
            return next(new ErrorResponse("Ocurrió un error al crear el Provision", 500));
        }
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getProvisiones = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const provisiones: Provision[] = [];
        const q = query(collection(db, "provisiones"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            provisiones.push(doc.data() as Provision);
        });
        new ResponseHttp(res).send("Provisiones obtenidos correctamente", provisiones, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const recibirProvision = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const provision = getDoc(doc(db, "provisiones", id));
        const provisionData = (await provision).data();
        await updateDoc(doc(db, "provisiones", id), {
            estatus: 2,
            fechaEntrega: new Date(),
        });
        
        const q2 = query(collection(db, "materiaPrima"));
        const querySnapshot2 = await getDocs(q2);
        const materiasPrimas: any[] = [];
        querySnapshot2.forEach((doc) => {
            doc.data().id = doc.id;
            const data = {
                ...doc.data(),
                id: doc.id,
            }
            materiasPrimas.push(data);
        });
        materiasPrimas.forEach(async (materiaPrima) => {
            if(materiaPrima.id == provisionData!.materiaPrima){
                const cantidad = materiaPrima.inventario + parseFloat(provisionData!.cantidad);
                await updateDoc(doc(db, "materiaPrima", materiaPrima.id), {
                    inventario: cantidad,
                });
            }
        });
        
        new ResponseHttp(res).send("Provision recibida correctamente", {}, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const cancelarProvision = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        await updateDoc(doc(db, "provisiones", id), {
            estatus: 0,
        });
      
        new ResponseHttp(res).send("Provision cancelada correctamente", {}, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});