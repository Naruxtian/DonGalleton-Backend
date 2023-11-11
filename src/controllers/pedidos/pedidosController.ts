import { addDoc, collection, doc, getDocs, query, where, updateDoc} from "firebase/firestore";
import asyncHandler from "../../middleware/async"
import ResponseHttp from "../../util/response";
import ErrorResponse from "../../util/errorResponse";
import { NextFunction, Request, Response } from "express";
import {db} from "../../config/firebaseConfig";
import { pedido } from "../../models/pedido";

//Pendiente - procesado - enviado - completado - cancelado
//1 - 2 - 3 - 4  - 0

export const createPedido = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {usuario, fecha, direccion, total, galletas} = req.body;
        
        const newPedido: pedido = {
            usuario: usuario,
            fecha: fecha,
            direccion: direccion,
            total: total,
            galletas: galletas,
            estatus: 1,
        };
        const docRef = await addDoc(collection(db, "pedidos"), newPedido);

        if(docRef){
            new ResponseHttp(res).send("Pedido creado correctamente", newPedido, true, 200);
        }
        else{
            return next(new ErrorResponse("Ocurrió un error al crear el pedido", 500));
        }
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getPedidos = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const pedidos: pedido[] = [];
        const q = query(collection(db, "pedidos"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            pedidos.push(doc.data() as pedido);
        });
        new ResponseHttp(res).send("Pedidos obtenidos correctamente", pedidos, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getPedidosUser = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const pedidos: pedido[] = [];
        const q = query(collection(db, "pedidos"), where("usuario", "==", req.params.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            pedidos.push(doc.data() as pedido);
        });
        
        new ResponseHttp(res).send("Pedidos obtenidos correctamente", pedidos, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getPedido = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const pedido: pedido[] = [];
        const q = query(collection(db, "pedidos"), where("id", "==", req.params.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            pedido.push(doc.data() as pedido);
        });
        
        new ResponseHttp(res).send("Pedido obtenido correctamente", pedido, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const procesarPedido = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const q = query(collection(db, "pedidos"));
        const querySnapshot = await getDocs(q);
        const pedidos: any[] = [];
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            pedidos.push({ ...doc.data(), id: doc.id });
        });
        const pedido = pedidos.find((pedido) => pedido.id === id);
        if(!pedido){
            return next(new ErrorResponse("No existe un pedido con ese id", 400));
        }

        const q2 = query(collection(db, "galletas"));
        const querySnapshot2 = await getDocs(q2);
        const galletasData: any[] = [];
        querySnapshot2.forEach((doc) => {
            doc.data().id = doc.id;
            galletasData.push({ ...doc.data(), id: doc.id });
        });

        const galletasPedido = pedido.galletas;
        
        var flagError = false;
        var galletaError = "";

        galletasPedido.forEach(async (galletaPedido: any) => {
            galletasData.forEach(async (galletaData: any) => {
                if(galletaPedido.galleta === galletaData.nombre){
                    if(galletaPedido.cantidad > galletaData.inventario){
                        flagError = true;
                        galletaError = galletaPedido.galleta;
                    }
                    await updateDoc(doc(db, "galletas", galletaData.id), {
                        inventario: galletaData.inventario - galletaPedido.cantidad,
                    });
                }
            });
        });

        if(flagError){
            galletasPedido.forEach(async (galletaPedido: any) => {
                galletasData.forEach(async (galletaData: any) => {
                    if(galletaPedido.galleta === galletaData.nombre){
                        await updateDoc(doc(db, "galletas", galletaData.id), {
                            inventario: galletaData.inventario + galletaPedido.cantidad,
                        });
                    }
                });
            });
            return next(new ErrorResponse("No hay suficiente inventario de " + galletaError, 400));
        }
        

        await new ResponseHttp(res).send("Pedido procesado correctamente", {}, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      } 
});

export const enviarPedido = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const q = query(collection(db, "pedidos"));
        const querySnapshot = await getDocs(q);
        const pedidos: any[] = [];
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            pedidos.push({ ...doc.data(), id: doc.id });
        });
        const pedido = pedidos.find((pedido) => pedido.id === id);
        if(!pedido){
            return next(new ErrorResponse("No existe un pedido con ese id", 400));
        }
        await updateDoc(doc(db, "pedidos", id), {
            estatus: 3
        });
        await new ResponseHttp(res).send("Pedido enviado correctamente", {}, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      } 
});

export const completarPedido = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const q = query(collection(db, "pedidos"));
        const querySnapshot = await getDocs(q);
        const pedidos: any[] = [];
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            pedidos.push({ ...doc.data(), id: doc.id });
        });
        const pedido = pedidos.find((pedido) => pedido.id === id);
        if(!pedido){
            return next(new ErrorResponse("No existe un pedido con ese id", 400));
        }
        await updateDoc(doc(db, "pedidos", id), {
            estatus: 4
        });
        await new ResponseHttp(res).send("Pedido completado correctamente", {}, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      } 
});

export const cancelarPedido = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const q = query(collection(db, "pedidos"));
        const querySnapshot = await getDocs(q);
        const pedidos: any[] = [];
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            pedidos.push({ ...doc.data(), id: doc.id });
        });
        const pedido = pedidos.find((pedido) => pedido.id === id);
        if(!pedido){
            return next(new ErrorResponse("No existe un pedido con ese id", 400));
        }
        await updateDoc(doc(db, "pedidos", id), {
            estatus: 0
        });
        await new ResponseHttp(res).send("Pedido cancelado correctamente", {}, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      } 
});
