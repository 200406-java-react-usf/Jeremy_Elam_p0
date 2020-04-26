import { UserRepository as sut } from '../repo/user-repo';
import { UserInfo } from '../models/user';
import validator from '../util/validator';
import {  
	BadRequestError, 
	AuthenticationError, 
	ResourceNotFoundError, 
	ResourcePersistenceError,
	NotImplementedError
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

	test('should throw BadRequestError when given invalid user id', async()=>{
		// Arrange
		expect.assertions(1);
		validator.isValidId = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getInstance().getById(-1);
		}catch (e){
			// Assert
			expect(e instanceof  BadRequestError).toBeTruthy();
		}
	});

	test('should throw ResourceNotFoundError when id is out of range of current database',async ()=>{
		//Arrange
		expect.assertions(1);
		validator.isValidId = jest.fn().mockReturnValue(true);
		try{
			await sut.getInstance().getById(55);
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBeTruthy();
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
		expect(result.id).toBe(1);
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
		expect(result.id).toBe(6);
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
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});

	test('will return ResourcePersistenceError when new users tries to use an already existing email address', async () => {
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(true);
		//Act
		let invalidMockUser = new UserInfo(6,'Pepper', 'Elam','jeremyelam@gmail.com','password',new Date('10/15/2018'));
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof ResourcePersistenceError).toBeTruthy();
		}
	});
	test('will return BadRequestError when new users tries to pass in an object with an invalid id', async () =>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		let invalidMockUser = new UserInfo(-1,'Pepper', 'Elam','jeremyelam@gmail.com','password',new Date('10/15/2018'));
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will return BadRequestError when new users tries to pass in an object with an invalid first name', async () =>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		let invalidMockUser = new UserInfo(6,'', 'Elam','jeremyelam@gmail.com','password',new Date('10/15/2018'));
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will return BadRequestError when new users tries to pass in an object with an invalid last name', async () =>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		let invalidMockUser = new UserInfo(6,'Jeremy', 'Pepper','jeremyelam@gmail.com','password',new Date('10/15/2018'));
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will return BadRequestError when new users tries to pass in an object with an invalid password', async () =>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		let invalidMockUser = new UserInfo(6,'Pepper', 'Elam','jeremyelam@gmail.com','',new Date('10/15/2018'));
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will return BadRequestError when new users tries to pass in an object with an invalid date', async () =>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		let invalidMockUser = new UserInfo(6,'Pepper', 'Elam','jeremyelam@gmail.com','password',null);
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});

	test('will return InvalidRequestError when new user tries to pass in an invalid user', async () =>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		
		try{
			await sut.getInstance().save(null);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});

	test(' will return true when successful update of user by id', async ()=>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(true);
		//Act
		let validMockUser = new UserInfo(1, 'update','update','update','update',null);
		let result = sut.getInstance().update(validMockUser);
		//Assert
		expect(result).toBeTruthy();
	});

	test('will invoke BadRequestError when given invalid id', async ()=>{
		//Arrange
		expect.assertions(1);
		let invalidMockUser = new UserInfo(9999, 'update','update','update','update',new Date());
		validator.isValidId = jest.fn().mockReturnValue(true);
		validator.isValidObject = jest.fn().mockReturnValue(true);
		//Act
		try{
			await sut.getInstance().update(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBeTruthy();
		}
	});
	

	test('will invoke BadRequestError when given an invalid id (double)', async ()=>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		try {
			let invalidMockUser = new UserInfo(3.5, 'update','update','update','update',null);
			//Assert
			await sut.getInstance().update(invalidMockUser);
		}catch(e){
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will invoke BadRequestError when given an invalid id (negative)', async ()=>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		try {
			let invalidMockUser = new UserInfo(-1, 'update','update','update','update',null);
			//Assert
			await sut.getInstance().update(invalidMockUser);
		}catch(e){
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});

	test('will invoke InvalidRequestError when given an invalid id (negative)', async ()=>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(false);
		
		//Act
		try {
			let invalidMockUser = new UserInfo(-1, 'update','update','update','update', new Date());
			//Assert
			await sut.getInstance().update(invalidMockUser);
		}catch(e){
			expect(e instanceof BadRequestError).toBeTruthy();
		}
		//logic doesn't make sense going back to it later. 
	});
	test('will invoke ResourcePersistenceError when trying to update a user with an already used email address. ', async() =>{
		//Arrange
		expect.assertions(1);
		validator.isValidObject = jest.fn().mockReturnValue(true);
		//Act
		try{
			let invalidMockUser = new UserInfo(3, 'update', 'update','jeremyelam@gmail.com', 'update', new Date());
			await sut.getInstance().update(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof ResourcePersistenceError).toBeTruthy();
		}
	});

});