import { addDoc, collection, doc, getDocs, query, updateDoc} from "firebase/firestore";
import asyncHandler from "../../middleware/async"
import ResponseHttp from "../../util/response";
import ErrorResponse from "../../util/errorResponse";
import { NextFunction, Request, Response } from "express";
import {db} from "../../config/firebaseConfig";
import { Galleta } from "../../models/galleta";

export const insertGalleta = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {nombre, inventario, precio, descripcion, cantidadLote, imagen, estatus, receta   } = req.body;
        const q = query(collection(db, "galletas"));
        const querySnapshot = await getDocs(q);
        const galletas: any[] = [];
        querySnapshot.forEach((doc) => {
            galletas.push({ ...doc.data(), id: doc.id });
        });

        const galleta = galletas.find((galleta) => galleta.nombre === nombre);
        if (galleta) {
            return next(new ErrorResponse("Ya existe una galleta registrada con ese nombre", 400));
        }
        const newGalleta: Galleta = {
            nombre: nombre,
            inventario: inventario,
            precio: precio,
            descripcion: descripcion,
            cantidadLote: cantidadLote,
            imagen: imagen,
            estatus: estatus,
            receta: receta
        };
        const docRef = await addDoc(collection(db, "galletas"), newGalleta);
        if(docRef){
            new ResponseHttp(res).send("Galleta creada correctamente", newGalleta, true, 200);
        }
        else{
            return next(new ErrorResponse("Ocurrió un error al crear la galleta", 500));
        }
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getAllGalletas = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const q = query(collection(db, "galletas"));
        const querySnapshot = await getDocs(q);
        const galletas: any[] = [];
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            galletas.push({ ...doc.data(), id: doc.id });
        });
        new ResponseHttp(res).send("Galletas obtenidas correctamente", galletas, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const updateGalleta = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const {nombre, inventario, precio, descripcion, cantidadLote, imagen, receta, ingredientes} = req.body;
        const docRef = doc(db, "galletas", id);

        const updateData: any = {
            nombre,
            inventario,
            precio,
            descripcion,
            cantidadLote,
            imagen,
            receta,
          };
      
          // Si hay ingredientes, agregarlos al objeto de actualización
          if (ingredientes && ingredientes.length > 0) {
            updateData.ingredientes = ingredientes;
          }
      
          await updateDoc(docRef, updateData);

        new ResponseHttp(res).send("Galleta actualizada correctamente", {}, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      } 
});

export const deleteGalleta = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const q = query(collection(db, "galletas"));
        const querySnapshot = await getDocs(q);
        const galletas: any[] = [];
        querySnapshot.forEach((doc) => {
            galletas.push({ ...doc.data(), id: doc.id });
        });
        const galleta = galletas.find((galleta) => galleta.id === id);
        if(galleta.empty){
            return next(new ErrorResponse("No existe una galleta con ese id", 400));
        }
        await updateDoc(doc(db, "galletas", id), {
            estatus: false
        });
        new ResponseHttp(res).send("Galleta eliminada correctamente", galleta, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      } 
});

export const mermarGalleta = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const {merma} = req.body;
        const q = query(collection(db, "galletas"));
        const querySnapshot = await getDocs(q);
        const galletas: any[] = [];
        querySnapshot.forEach((doc) => {
            galletas.push({ ...doc.data(), id: doc.id });
        });
        const galleta = galletas.find((galleta) => galleta.id === id);
        if(galleta.empty){
            return next(new ErrorResponse("No existe una galleta con ese id", 400));
        }
        if(galleta.inventario < merma){
            return next(new ErrorResponse("No se puede merma más de lo que hay en inventario", 400));
        }
        await updateDoc(doc(db, "galletas", id), {
            inventario: galleta.inventario - merma
        });
        new ResponseHttp(res).send("Galleta merma actualizada correctamente", galleta, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      } 
});

export const addIngrediente = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id, materiaPrima, cantidad} = req.body;
        const q = query(collection(db, "galletas"));
        const querySnapshot = await getDocs(q);
        const galletas: any[] = [];
        querySnapshot.forEach((doc) => {
            galletas.push({ ...doc.data(), id: doc.id });
        });
        const galleta = galletas.find((galleta) => galleta.id === id);
        if(galleta.empty){
            return next(new ErrorResponse("No existe una galleta con ese id", 400));
        }
        const q2 = query(collection(db, "materiasPrimas"));
        const querySnapshot2 = await getDocs(q2);
        const materiasPrimas: any[] = [];
        querySnapshot2.forEach((doc) => {
            materiasPrimas.push({ ...doc.data(), id: doc.id });
        });
        const materiaPrimaObj = materiasPrimas.find((materiaPrimaObj) => materiaPrimaObj.id === id);
        if(materiaPrimaObj.empty){
            return next(new ErrorResponse("No existe esa materia prima", 400));
        }
        galleta.Ingredientes.push({
            materiaPrima: materiaPrima,
            cantidad: cantidad
        });
        await updateDoc(doc(db, "galletas", id), {
            Ingredientes: galleta.Ingredientes
        });

        new ResponseHttp(res).send("Ingrediente agregado correctamente", galleta, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      } 
});

export const removeIngrediente = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id, materiaPrima} = req.body;
        const q = query(collection(db, "galletas"));
        const querySnapshot = await getDocs(q);
        const galletas: any[] = [];
        querySnapshot.forEach((doc) => {
            galletas.push({ ...doc.data(), id: doc.id });
        });
        const galleta = galletas.find((galleta) => galleta.id === id);
        if(galleta.empty){
            return next(new ErrorResponse("No existe una galleta con ese id", 400));
        }
        const q2 = query(collection(db, "materiasPrimas"));
        const querySnapshot2 = await getDocs(q2);
        const materiasPrimas: any[] = [];
        querySnapshot2.forEach((doc) => {
            materiasPrimas.push({ ...doc.data(), id: doc.id });
        });
        const materiaPrimaObj = materiasPrimas.find((materiaPrimaObj) => materiaPrimaObj.id === id);
        if(materiaPrimaObj.empty){
            return next(new ErrorResponse("No existe esa materia prima", 400));
        }
        const ingredientes = galleta.Ingredientes.filter((ingrediente: any) => ingrediente.materiaPrima !== materiaPrima);
        await updateDoc(doc(db, "galletas", id), {
            Ingredientes: ingredientes
        });

        new ResponseHttp(res).send("Ingrediente eliminado correctamente", galleta, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});