import { UserRepository as sut } from '../repo/user-repo';
import { UserInfo } from '../models/user';
import validator from '../util/validator';
import {  
	DataNotFoundError,
	DataNotStoredError,
	AuthenticationError,
	InvalidRequestError
} from '../errors/errors';


describe('userRepo', () =>{
	beforeEach(() => {
		validator.isValidId = jest.fn().mockImplementation(()=>{
			throw new Error('Failed to mock external method: isValidId!');
		});
		validator.isValidObject = jest.fn().mockImplementation(() =>{
			throw new Error('Failed to mock external method: isValidObject!');
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
	test('should return all uses (without passwords) when getAll is called', async ()=>{
		// Arrange
		expect.assertions(3);
		// Act 
		let result = await sut.getInstance().getAll();
		// Assert
		expect(result).toBeTruthy();
		expect(result.length).toBeGreaterThan(0);
		expect(result[0].user_pw).toBeUndefined();
	});

	test('should throw InvalidRequestError when ', async()=>{
		// Arrange
		expect.assertions(1);
		validator.isValidId = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getInstance().getById(-1);
		}catch (e){
			// Assert
			expect(e instanceof  InvalidRequestError).toBeTruthy();
		}
	});

	test('should return correct user (without password) when getById', async ()=>{
		//Arrange
		expect.assertions(3);
		validator.isValidId = jest.fn().mockReturnValue(true);

		// Act
		let result = await sut.getInstance().getById(1);

		//Assert
		expect(result).toBeTruthy();
		expect(result.user_id).toBe(1);
		expect(result.user_pw).toBeUndefined();
	});

	test('should return new user information without password', async ()=>{
		//Arrange
		expect.assertions(3);
		validator.isValidObject = jest.fn().mockReturnValue(true);
		//Act
		let validMockUser = new UserInfo(6,'Pepper', 'Elam','pepper@gmail.com','password',new Date('10/15/2018'));
		let result = await sut.getInstance().save(validMockUser);
		//Assert 
		expect(result).toBeTruthy();
		expect(result.user_id).toBe(6);
		expect(result.user_pw).toBeUndefined();
	});

	test('should return InvalidRequestError when invalid user is given', async () =>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act 
		let invalidMockUser = new UserInfo(6,'', 'Elam','pepper@gmail.com','',new Date('10/15/2018'));
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof InvalidRequestError).toBeTruthy();
		}
	})

	test('will return InvalidRequestError when new users tries to user an already existing email address', async () => {
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(true);
		//Act
		let invalidMockUser = new UserInfo(6,'Pepper', 'Elam','jeremyelam@gmail.com','password',new Date('10/15/2018'));
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof InvalidRequestError).toBeTruthy();
		}
	})

});