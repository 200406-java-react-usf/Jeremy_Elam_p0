class ApplicationError {

	statusCode: number;
	timestamp: Date;
	message: string;
	reason: string;

	constructor(statusCode: number, rsn?: string) {
		this.message = 'An unexpected error occurred.';
		this.statusCode = statusCode;
		this.timestamp = new Date();
		rsn ? (this.reason = rsn) : this.reason = 'Unspecified reason.';
	}

	setMessage(message: string) {
		this.message = message;
	}
}

class ResourcePersistenceError extends ApplicationError {
	constructor(reason?: string) {
		super(409, reason);
		super.setMessage('The resource was not persisted.');
	}	
}

class ResourceNotFoundError extends ApplicationError {
	constructor(reason?: string) {
		super(404, reason);
		super.setMessage('No resource found using provided criteria.');
	}
	
}

class BadRequestError extends ApplicationError {
	constructor(reason?: string) {
		super(400, reason);
		super.setMessage('Invalid parameters provided.');
	}
}

// class AuthenticationError extends ApplicationError {
// 	constructor(reason?: string) {
// 		super(401, reason);
// 		super.setMessage('Authentication failed.');
// 	}
// }
// class AuthorizationError extends ApplicationError{
// 	constructor(reason?: string){
// 		super(403, reason);
// 		super.setMessage('Authentication failed');
// 	}
// }
class InternalServerError extends ApplicationError {
	constructor(reason?: string) {
		super(500, reason);
		super.setMessage('An unexpected error has ocurred!');
	}
}

// class NotImplementedError extends ApplicationError {
// 	constructor(reason?: string) {
// 		super(501, reason);
// 		super.setMessage('No implementation yet!');
// 	}
// }


export {
	ResourceNotFoundError,
	ResourcePersistenceError,
	BadRequestError,
	// AuthenticationError,
	// NotImplementedError,
	// AuthorizationError,
	InternalServerError
};