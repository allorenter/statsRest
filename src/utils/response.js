const succesResponse = (res, message, data) => res.status(200).json({message, data});

export default succesResponse;
