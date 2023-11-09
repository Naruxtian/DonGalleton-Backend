import { addDoc, collection, doc, getDocs, query, deleteDoc, updateDoc} from "firebase/firestore";
import asyncHandler from "../../middleware/async"
import ResponseHttp from "../../util/response";
import ErrorResponse from "../../util/errorResponse";
import { NextFunction, Request, Response } from "express";
import {db} from "../../config/firebaseConfig";
import { MateriaPrima } from "../../models/materiaPrima";

export const insertMateriaPrima = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {nombre, inventario, unidad} = req.body;
        const q = query(collection(db, "materiaPrima"));
        const querySnapshot = await getDocs(q);
        const materiasPrimas: any[] = [];
        querySnapshot.forEach((doc) => {
            materiasPrimas.push({ ...doc.data(), id: doc.id });
        });

        const materiaPrima = materiasPrimas.find((materiaPrima) => materiaPrima.nombre === nombre);
        if (materiaPrima) {
            return next(new ErrorResponse("Ya existe una materia prima registrada con ese nombre", 400));
        }
        const newMateriaPrima: MateriaPrima = {
            nombre: nombre,
            inventario: inventario,
            unidad: unidad
        };
        const docRef = await addDoc(collection(db, "materiaPrima"), newMateriaPrima);
        if(docRef){
            new ResponseHttp(res).send("Materia prima creada correctamente", newMateriaPrima, true, 200);
        }
        else{
            return next(new ErrorResponse("Ocurrió un error al crear la materia prima", 500));
        }
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const getAllMateriasPrimas = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const q = query(collection(db, "materiaPrima"));
        const querySnapshot = await getDocs(q);
        const materiasPrimas: any[] = [];
        querySnapshot.forEach((doc) => {
            doc.data().id = doc.id;
            materiasPrimas.push({ ...doc.data(), id: doc.id });
        });
        new ResponseHttp(res).send("Materias primas obtenidas correctamente", materiasPrimas, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const updateMateriaPrima = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {id} = req.params;
        const {nombre, inventario, unidad} = req.body;
        const q = query(collection(db, "materiaPrima"));
        const querySnapshot = await getDocs(q);
        const materias: any[] = [];
        querySnapshot.forEach((doc) => {
            materias.push({ ...doc.data(), id: doc.id });
        });

        const materia = materias.find((materia) => materia.nombre === nombre);
        if(materia.empty){
            return next(new ErrorResponse("No existe una materia prima con ese nombre", 400));
        }

        await updateDoc(doc(db, "materiaPrima", id), {
            nombre: nombre,
            inventario: inventario,
            unidad: unidad
        });

        new ResponseHttp(res).send("Materia prima actualizada correctamente", {}, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

export const deleteMateriaPrimaa = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {nombre} = req.params;
        const q = query(collection(db, "materiaPrima"));
        const querySnapshot = await getDocs(q);
        const materiasPrimas: any[] = [];
        querySnapshot.forEach((doc) => {
            materiasPrimas.push({ ...doc.data(), id: doc.id });
        });
        const materiaPrima = materiasPrimas.find((materiaPrima) => materiaPrima.nombre === nombre);
        if (!materiaPrima) {
            return next(new ErrorResponse("No existe una materia prima con ese nombre", 400));
        }
        const materiaPrimaRef = doc(db, "materiaPrima", materiaPrima.id);
        await deleteDoc(materiaPrimaRef);
        new ResponseHttp(res).send("Materia prima eliminada correctamente", {}, true, 200);
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});