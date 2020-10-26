import StatService from "./stat.service";
import {BadRequest} from "../../utils/errors";
import succesResponse from "../../utils/response";

const statService = StatService();

exports.create = async (req, res, next) => {    
    try { 
        const { id, name, type } = req.body;
        if(!id || !name || !type){
            throw new BadRequest('Id, name y type requeridos');
        }
        const stat = await statService.insert({
            _id: id,
            name, 
            type
        });
        return succesResponse(res, "Estadística creada", stat);
    } catch (err) {
        next(err);
    }
}

exports.get = async (req, res, next) => {    
    try { 
        const stats = await statService.get();
        return succesResponse(res, "Estadísticas disponibles", stats);
    } catch (err) {        
        next(err);
    }
}