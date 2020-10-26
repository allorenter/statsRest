import MatchModel from "./match.model";

const MatchService = () => {

    const insertMatches = arrMatches => MatchModel.insertMany(arrMatches, {ordered: false});
    
    const insertMatch = match => new MatchModel(match).save();

    return Object.freeze({
       insertMatches,
       insertMatch
    });

};

export default MatchService;