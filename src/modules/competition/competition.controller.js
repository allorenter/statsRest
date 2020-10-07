import CompetitionService from "./competition.service";
import {BadRequest} from "../../utils/errors";

const competitionService = CompetitionService();

exports.create = async (req, res, next) => {    
    try { 
        const { id, name } = req.body;
        if(!id || !name){
            throw new BadRequest('Id y nombre requeridos');
        }
        const competition = await competitionService.insertCompetition({_id : id, name});
        return res.status(200).json({ message: "Competicion creada", data: competition });
    } catch (err) {
        next(err);
    }
}
