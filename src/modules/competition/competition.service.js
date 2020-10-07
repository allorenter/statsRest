import CompetitionModel from "./competition.model";

const CompetitionService = () => {
    
    const insertCompetition = competition => new CompetitionModel(competition).save();

    return Object.freeze({
       insertCompetition,
      // getCompetitionById
    });

};

export default CompetitionService;