import { CardRepository as sut } from '../repo/card-repo';
import { Cards } from '../models/cards';
import validator from '../util/validator';
import {  
	BadRequestError, 
	AuthenticationError, 
	ResourceNotFoundError, 
	ResourcePersistenceError,
	NotImplementedError 
} from '../errors/errors';

describe('cardRepo', ()=>{
	beforeEach(() =>{
		validator.isValidId = jest.fn().mockImplementation(()=>{
			throw new Error('Failed to mock external method: isValidId!');
		});
		validator.isCardValidObject = jest.fn().mockImplementation(() =>{
			throw new Error('Failed to mock external method: isCardValidObject!');
		});
		validator.isValidStrings = jest.fn().mockImplementation(()=>{
			throw new Error('Failed to mock external method: isValidStrings!');
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

	test('should give all the cards when function is invoked.',async ()=>{
		//Arrange 
		expect.assertions(2);
		//Act 
		let result = await sut.getInstance().getAll();
		//Assert
		expect(result).toBeTruthy();
		expect(result[0].card_name).toBe('Domri something something');
	});
	
});