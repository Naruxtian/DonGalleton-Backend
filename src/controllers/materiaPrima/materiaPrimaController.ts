import { addDoc, collection, doc, getDocs, query, deleteDoc} from "firebase/firestore";
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
            materiasPrimas.push({ ...doc.data(), id: doc.id });
        });
        new ResponseHttp(res).send("Materias primas obtenidas correctamente", materiasPrimas, true, 200);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        next(new ErrorResponse(errorMessage, errorCode));
      }
});

// export const updateMateriaPrima = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
//     try{
//         const {id} = req.params;
//         const {nombre, inventario, unidad} = req.body;
//         const materiaPrimaRef = doc(db, "materiaPrima", id);
//         const materiaPrima = await materiaPrimaRef.get();
//         if (!materiaPrima.exists()) {
//             return next(new ErrorResponse("No existe una materia prima con ese id", 400));
//         }
//         const materiaPrimaData = materiaPrima.data();
//         const materiaPrimaNombre = materiaPrimaData.nombre;
//         const materiaPrimaInventario = materiaPrimaData.inventario;
//         const materiaPrimaUnidad = materiaPrimaData.unidad;
//         const materiaPrimaNombreNuevo = nombre ? nombre : materiaPrimaNombre;
//         const materiaPrimaInventarioNuevo = inventario ? inventario : materiaPrimaInventario;
//         const materiaPrimaUnidadNuevo = unidad ? unidad : materiaPrimaUnidad;
//         const materiaPrimaActualizada: MateriaPrima = {
//             nombre: materiaPrimaNombreNuevo,
//             inventario: materiaPrimaInventarioNuevo,
//             unidad: materiaPrimaUnidadNuevo
//         };
//         const materiaPrimaActualizadaRef = await updateDoc(materiaPrimaRef, materiaPrimadata);
//         if(materiaPrimaActualizadaRef){
//             new ResponseHttp(res).send("Materia prima actualizada correctamente", {materiaPrimaActualizada}, true, 200);
//         }
//         else{
//             return next(new ErrorResponse("Ocurrió un error al actualizar la materia prima", 500));
//         }
//     }
//     catch (error: any) {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         next(new ErrorResponse(errorMessage, errorCode));
//       }
// });

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