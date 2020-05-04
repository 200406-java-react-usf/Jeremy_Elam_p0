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
import e from 'express';



jest.mock('../repo/user-repo', ()=>{
	return class UserRepository{
		getAllUsers = jest.fn();
		getUserById = jest.fn();
		getUserByUniqueKey = jest.fn();
		addNewUser = jest.fn();
		deleteUserById = jest.fn();
		updateUser = jest.fn();
		removePassword = jest.fn();
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
		//Arrange
		try{
			await sut.getAllUsers();
		}catch (e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	})
})