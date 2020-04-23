class ApplicationError{
    message : string;
    reason: string;

    constructor(reason?: string){
        this.message = 'An unexpected error has occurred.';
        reason ? (this.reason = reason) : this.reason = 'Unknown reason';
    }

    setMessage(message:string){
        this.message = message;
    }
}

class DataNotFoundError extends ApplicationError{
    constructor(reason?: string){
        super(reason);
        super.setMessage('Error: No data was found')
    }
}

class InvalidRequestError extends ApplicationError{
    constructor(reason?: string){
        super(reason);
        super.setMessage('Error: Invalid Request')
    }
}

class AuthenticationError extends ApplicationError{
    constructor(reason?: string){
        super(reason);
        super.setMessage('Error: Authentication Failed')
    }
}

class DataNotStoredError extends ApplicationError{
    constructor(reason?: string){
        super(reason);
        super.setMessage('Error: The data has not been stored')
    }
}

export{
    DataNotFoundError,
    DataNotStoredError,
    AuthenticationError,
    InvalidRequestError
}
