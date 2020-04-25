import { UserRepository as sut } from '../repos/user-repo';
import { UserInfo } from '../models/user';
import vßalidator from '../util/validator';
import {  
	DataNotFoundError,
	DataNotStoredError,
	AuthenticationError,
	InvalidRequestError
} from '../errors/errors';
import validator from '../util/validator';

describe('userRepo', () =>{
	beforeEach(() => {
		validator.isValidId = jest.fn().mockImplementation(()=>{
			throw new Error('Failed to mock external method: isValidId!');
		});
		validator.isValidObject = jest.fn().mockImplementation(() =>{
			throw new Error('Failed to mock external method: isValidObject!');
		});
		validator.isValidStrings = jest.fn().mockImplementation(()=>{
			throw new Error('Failed to mock exernal method: isValidStrings!');
		});
	});

	test('should be a singleton',()=>{
		//Arrange
		expect.assertions(1);
		// Act
		let reference1 = sut.getInstance();
		let reference2 = sut.getInstance();
		// Assert
		expect(reference1).toEqual(reference2);
	});

	
});