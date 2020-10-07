class GeneralError extends Error{
    
    constructor(message){
        super(message);
        this.message = message;
    }

    getCode(){        
        if(this instanceof BadRequest){
            return 400;
        }
        return 500;
    }

}

class BadRequest extends GeneralError{}

class NotFound extends GeneralError{}


export {GeneralError, BadRequest, NotFound};