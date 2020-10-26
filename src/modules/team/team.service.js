import TeamModel from "./team.model";

const TeamService = () => {
    
    const insert = stat => new TeamModel(stat).save();

    const get = async() => await TeamModel.find();

    return Object.freeze({
      insert,
      get
    });

};

export default TeamService;