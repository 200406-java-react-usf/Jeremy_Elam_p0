import { UserRepository as sut, UserRepository } from '../repo/user-repo';
import {UserService} from '../services/user-services';
import { UserInfo } from '../models/user';
import validator from '../util/validator';
import {  
	BadRequestError, 
	AuthenticationError, 
	ResourceNotFoundError, 
	ResourcePersistenceError,
	NotImplementedError 
} from '../errors/errors';



jest.mock('../repo/user-repo', ()=>{
	return class UserRepository{
		getAllUsers = jest.fn();
		getUserById = jest.fn();
		getUserByUniqueKey = jest.fn();
		addNewUser = jest.fn();
		deleteUserById = jest.fn();
		updateUser = jest.fn();
		removePassword = jest.fn();
		isEmailAvailable = jest.fn();
	}
});

describe('userService', ()=>{
	let sut: UserService;
	let mockRepo;

	let mockUsers = [
		new UserInfo(1, 'Jeremy', 'Elam', 'jeremyelam@gmail.com', 'password', 'Admin'),
		new UserInfo(2, 'Kenan', 'Hilman', 'flameking0127@gmail.com', 'password', 'User'),
		new UserInfo(3, 'Jalen', 'Hilman', 'jalenhilman@gmail.com', 'password', 'User'),
		new UserInfo(4, 'Ameline', 'Chua', 'amelinechua@gmail.com', 'password', 'User'),
		new UserInfo(5, 'Salt', 'Elam', 'saltelam@gmail.com', 'password', 'Admin')
	];

	beforeEach(() =>{
		mockRepo = jest.fn(()=>{
			return {
				getAll: jest.fn(),
				getById: jest.fn(),
				getUserByUniqueKey: jest.fn(),
				addNewUser: jest.fn(),
				deleteUserById: jest.fn(),
				updateUser: jest.fn(),
				removePassword: jest.fn(),
				isEmailAvailable: jest.fn()
			}
		});
		sut = new UserService(mockRepo);
	});
	test('should resolve to User[] (without passwords) when getAllUsers successfully retrieves users from the data source', async()=>{
		//Arrange
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);
		//Act
		let result = await sut.getAllUsers();
		//Assert 
		expect(result).toBeTruthy();
		expect(result.length).toBe(5);
		result.forEach(val => expect(val.user_pw).toBeUndefined());
	});

	test('should reject with ResourceNotfound Error when getAllUsers fails to get any users from the data source', async() =>{
		//Arrange 
		expect.assertions(1);
		mockRepo.getAll = jest.fn().mockReturnValue([]);
		//Act
		try{
			await sut.getAllUsers();
		}catch (e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

	test('should return use when given a valid id number', async()=>{
		//Arrange
		expect.assertions(3);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.getById = jest.fn().mockImplementation((id:number)=>{
			return new Promise<UserInfo>((resolve) => resolve(mockUsers[id -1]));
		});
		//Act
		let result = await sut.getUserById(1);

		//Assert
		expect(result).toBeTruthy();
		expect(result.user_fn).toBe('Jeremy');
		expect(result.user_pw).toBeUndefined();
	});

	test('should throw bad request error when given an invalid id number (negative)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getUserById(-1)
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should throw bad request error when given an invalid id number (double number)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getUserById(3.14)
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should throw bad request error when given an invalid id number (fasly)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getUserById(0)
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should throw badRequestError when given an invalid id number (NaN)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getUserById(NaN)
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should throw ResourceNotFoundError when given a valid id but not an idea inside the database', async ()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(true);
		//Act
		try{
			await sut.getUserById(100);
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

	test('should return new user information without password when a new user is given', async()=>{
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		mockRepo.isEmailAvailable = jest.fn().mockReturnValue(true);
		mockRepo.save = jest.fn().mockImplementation((newUser:UserInfo)=>{
			return new Promise<UserInfo>((resolve) => {
				mockUsers.push(newUser);
				resolve(newUser);
			});
		});
		//Act 
		let result = await sut.addNewUser(new UserInfo(6, 'Pepper', 'Elam', 'pepperelam@gmail.com', 'password', 'User'))
		//Assert 
		expect(result).toBeTruthy();
		expect(mockUsers.length).toBe(6);
	});

	test('should return BadRequestError when given a bad UserInfo object', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewUser(new UserInfo(2, 'pepper', '', 'flameking0127@gmail.com', 'password', 'User'))
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should return ResourcePersistenceError when given a UserInfo with an email address that is already being used', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		sut.isEmailAvailable = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewUser(new UserInfo(6, 'pepper', 'elam', 'flameking0127@gmail.com', 'password', 'User'))
		}catch(e){
			//Assert
			expect(e instanceof ResourcePersistenceError).toBe(true);
		}
	});

	test('should return true if a user with the given id number was successfully deleted', async ()=>{
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.deleteById = jest.fn().mockReturnValue(true);

		//Act
		let result = await sut.deleteUserById({"id":1});
		//Assert 
		expect(result).toBe(true);
	});

	test('should return BadRequestError when trying to delete an id but given an invalid id', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.deleteUserById({"id": -1});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});
	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.deleteUserById({"": 1});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});

	test('should return true when an user is successfully update given a valid user object', async ()=>{
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		sut.isEmailAvailable = jest.fn().mockReturnValue(true);
		sut.getUserById = jest.fn().mockReturnValue(true);
		sut.getUserByUniqueKey = jest.fn().mockReturnValue(true);
		mockRepo.update = jest.fn().mockReturnValue(true);

		//Act
		let result = await sut.updateUser( new UserInfo(5, 'pepper', 'Elam', 'saltelam@gmail.com', 'passwords', 'Admin'));
		console.log(result);
		//Assert
		expect(result).toBe(true);
	});

	
	
});