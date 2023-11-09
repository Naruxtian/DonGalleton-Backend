import { addDoc, collection, doc, getDocs, query, updateDoc} from "firebase/firestore";
import asyncHandler from "../../middleware/async"
import ResponseHttp from "../../util/response";
import ErrorResponse from "../../util/errorResponse";
import { NextFunction, Request, Response } from "express";
import {db} from "../../config/firebaseConfig";
import { Galleta } from "../../models/galleta";

export const insertGalleta = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {nombre, inventario, precio, descripcion, cantidadLote, imagen, estatus   } = req.body;
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
            estatus: estatus
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
        const {nombre, inventario, precio, descripcion, cantidadLote, imagen, estatus   } = req.body;
        const q = query(collection(db, "galletas"));
        const querySnapshot = await getDocs(q);
        const galletas: any[] = [];
        querySnapshot.forEach((doc) => {
            galletas.push({ ...doc.data(), id: doc.id });
        });

        const galleta = galletas.find((galleta) => galleta.nombre === nombre);
        if(galleta.empty){
            return next(new ErrorResponse("No existe una galleta con ese nombre", 400));
        }
        const galletaData = galleta.docs[0].data();
        const galletaNombre = galletaData.nombre;
        const galletaInventario = galletaData.inventario;
        const galletaPrecio = galletaData.precio;
        const galletaDescripcion = galletaData.descripcion;
        const galletaCantidadLote = galletaData.cantidadLote;
        const galletaImagen = galletaData.imagen;
        const galletaEstatus = galletaData.estatus;
        const galletaIngredientes = galletaData.ingredientes;
        const galletaReceta = galletaData.receta;
        const newGalleta: Galleta = {
            nombre: nombre ? nombre : galletaNombre,
            inventario: inventario ? inventario : galletaInventario,
            precio: precio ? precio : galletaPrecio,
            descripcion: descripcion ? descripcion : galletaDescripcion,
            cantidadLote: cantidadLote ? cantidadLote : galletaCantidadLote,
            imagen: imagen ? imagen : galletaImagen,
            estatus: estatus ? estatus : galletaEstatus,
            ingredientes: galletaIngredientes,
            receta: galletaReceta
        };
        const docRef = doc(db, "galletas", id);
        const newGalletaObj = Object.entries(newGalleta).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {} as { [key: string]: any });
        await new ResponseHttp(res).send("Galleta actualizada correctamente", newGalletaObj, true, 200);
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