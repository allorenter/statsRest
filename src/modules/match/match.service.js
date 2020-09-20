import MatchModel from "./match.model";

const MatchService = () => {

    const insertMatches = arrMatches => MatchModel.insertMany(arrMatches, function(error, docs) {
        console.log("Errors insertMatches:", error);
    });

    const insertMatch = match => new MatchModel(match).save();

    return Object.freeze({
       insertMatches,
       insertMatch
    });

};

export default MatchService;