// import { UserRepository as sut, UserRepository } from '../repo/user-repo';
// import { UserInfo } from '../models/user';
// import validator from '../util/validator';
// import {  
// 	BadRequestError, 
// 	AuthenticationError, 
// 	ResourceNotFoundError, 
// 	ResourcePersistenceError,
// 	NotImplementedError 
// } from '../errors/errors';
// import {UserService} from '../services/user-services';


// describe('userRepo', () =>{

// 	let sut: UserService;
// 	let mockRepo: UserRepository = new UserRepository();
	
// 	let mockUsers = [
// 		new UserInfo(1, 'Jeremy', 'Elam', 'jeremyelam@gmail.com', 'password', 'Admin'),
// 		new UserInfo(2, 'Kenan', 'Hilman', 'flameking0127@gmail.com', 'password', 'User'),
// 		new UserInfo(3, 'Jalen', 'Hilman', 'jalenhilman@gmail.com', 'password', 'User'),
// 		new UserInfo(4, 'Ameline', 'Chua', 'amelinechua@gmail.com', 'password', 'User'),
// 		new UserInfo(5, 'Salt', 'Elam', 'saltelam@gmail.com', 'password', 'Cat')
// 	];

// 	beforeEach(() => {
// 		sut = new UserService(mockRepo);
// 		//Rest all external methods
// 		for(let method in UserRepository.prototype){
// 			UserRepository.prototype[method] = jest.fn().mockImplementation(() => {
// 				throw new Error(`Failed to mock external method: UserRepository.${method}!`);
// 			});
// 		}
// 	});


// 	test('will invoke ResourceNotFoundError when database empty', async()=>{
// 		// Arrange
// 		expect.assertions(1);
// 		UserRepository.prototype.getAll = jest.fn().mockReturnValue([]);
// 		//Act
// 		try{
// 			await sut.getAllUsers();
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof ResourceNotFoundError).toBe(true);
// 		}
// 	});
// 	test('will return all the uses in the database without their passwords', async()=>{
// 		// Arrange
// 		expect.hasAssertions();
// 		UserRepository.prototype.getAll = jest.fn().mockReturnValue(mockUsers);
// 		//Act
// 		let result = await sut.getAllUsers();
// 		//Assert
// 		expect(result).toBeTruthy();
// 		expect(result.length).toBe(5);
// 		result.forEach(val => expect(val.user_pw).toBeUndefined());
// 	});


// 	test('will return a user given an id', async() =>{
// 		//Arrange
// 		expect.assertions(3);
// 		UserRepository.prototype.getById = jest.fn().mockImplementation((id:number)=>{
// 			return new Promise<UserInfo>((resolve)=> resolve(mockUsers[id -1]));
// 		});
// 		//Act
// 		let result = await sut.getUserById(1);
// 		//Assert
// 		expect(result).toBeTruthy();
// 		expect(result.user_fn).toBe('Jeremy');
// 		expect(result.user_pw).toBeUndefined();
// 	});

// 	test('will invoke BadRequestError when given an invalid user id (negative number)', async() =>{
// 		expect.assertions(1);
// 		UserRepository.prototype.getById = jest.fn().mockReturnValue(false);
// 		//Act
// 		try{
// 			await sut.getUserById(-1);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof BadRequestError).toBe(true);
// 		}
// 	});
	
// 	test('will invoke BadRequestError when given an invalid user id (float/double number)',async()=>{
// 		// Arrange
// 		expect.assertions(1);
// 		UserRepository.prototype.getById = jest.fn().mockReturnValue(false);
// 		// Act
// 		try{
// 			await sut.getUserById(3.14);
// 		}catch(e){
// 			expect(e instanceof BadRequestError).toBe(true);
// 		}
// 	});

// 	test('will invoke ResourceNotFoundError when given an unknown user id', async ()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		UserRepository.prototype.getById = jest.fn().mockReturnValue(true);
// 		//Act
// 		try{
// 			await sut.getUserById(111);
// 		}catch(e){
// 			expect(e instanceof ResourceNotFoundError).toBeTruthy();
// 		}
// 	});

// 	test('will return user given user name and password', async()=>{
// 		// Arrange
// 		expect.assertions(3);

// 		UserRepository.prototype.getUserByCredentials = jest.fn().mockReturnValue(true);
		
// 		//Act 
// 		let result = await sut.authenticateUser('jeremyelam@gmail.com', 'password');
// 		//Assert
// 		expect(result).toBeTruthy();
// 		expect(result.user_fn).toBe('Jeremy');
// 		expect(result.user_pw).toBeUndefined();
// 	});

// 	test('will invoke BadRequestError when given bad user name', async()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		UserRepository.prototype.getUserByCredentials = jest.fn().mockReturnValue(false);
// 		//Act
// 		try{
// 			await sut.authenticateUser('', 'password');
// 		}catch(e){
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});

// 	test('will invoke BadRequestError when given an invalid password', async()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		UserRepository.prototype.getUserByCredentials = jest.fn().mockReturnValue(false);
// 		//Act
// 		try{
// 			await sut.authenticateUser('jeremyelam@gmail.com', '');
// 		}catch(e){
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});

// test('will invoke ResourceNotFoundError when given invalid email', async()=>{
// 	//Arrange
// 	expect.assertions(1);
// 	UserRepository.prototype.getUserByCredentials = jest.fn().mockReturnValue(true);
// 	//Act
// 	try{
// 		await sut.authenticateUser('jeremelm@gmail.com', 'password');
// 	}catch(e){
// 		expect(e instanceof AuthenticationError).toBeTruthy();
// 	}
// });

// test('will add new user to database', async()=>{
// 	expect.hasAssertions();
// 	let testing = new UserInfo(1, 'Jeremy', 'update', 'update', 'update', 'update');
// 	UserRepository.prototype.getUserByCredentials = jest.fn().mockReturnValue(true);
// 	//Act
// 	let result = await sut.updateUser(testing);
// 	expect(result).toBe(true);
// });

// test('will invoke BadRequestError when given a user with bad user id', async() =>{
// 	//Arrange
// 	expect.assertions(1);
// 	let testing = new UserInfo(6, 'Jeremy', 'update', 'update', 'update', 'update');
// 	UserRepository.prototype.update = jest.fn().mockReturnValue(true);
// 	//Act
// 	try{
// 		await sut.updateUser(testing);
// 	}catch(e){
// 		expect(e instanceof BadRequestError).toBeTruthy();
// 	}
// });

// 	test('should throw ResourceNotFoundError when id is out of range of current database',async ()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidId = jest.fn().mockReturnValue(true);
// 		try{
// 			await sut.getInstance().getById(55);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof ResourceNotFoundError).toBeTruthy();
// 		}
// 	});

// 	test('should return correct user (without password) when getById', async ()=>{
// 		//Arrange
// 		expect.assertions(3);
// 		validator.isValidId = jest.fn().mockReturnValue(true);

// 		// Act
// 		let result = await sut.getInstance().getById(1);

// 		//Assert
// 		expect(result).toBeTruthy();
// 		expect(result.id).toBe(1);
// 		expect(result.user_pw).toBeUndefined();
// 	});

// 	test('should return new user information without password', async ()=>{
// 		//Arrange
// 		expect.assertions(3);
// 		validator.isValidObject = jest.fn().mockReturnValue(true);
// 		//Act
// 		let validMockUser = new UserInfo(6,'Pepper', 'Elam','pepper@gmail.com','password',new Date('10/15/2018'));
// 		let result = await sut.getInstance().save(validMockUser);
// 		//Assert 
// 		expect(result).toBeTruthy();
// 		expect(result.id).toBe(6);
// 		expect(result.user_pw).toBeUndefined();
// 	});

// 	test('should return InvalidRequestError when invalid user is given', async () =>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act 
// 		let invalidMockUser = new UserInfo(6,'', 'Elam','pepper@gmail.com','',new Date('10/15/2018'));
// 		try{
// 			await sut.getInstance().save(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});

// 	test('will return ResourcePersistenceError when new users tries to use an already existing email address', async () => {
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(true);
// 		//Act
// 		let invalidMockUser = new UserInfo(6,'Pepper', 'Elam','jeremyelam@gmail.com','password',new Date('10/15/2018'));
// 		try{
// 			await sut.getInstance().save(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof ResourcePersistenceError).toBeTruthy();
// 		}
// 	});
// 	test('will return BadRequestError when new users tries to pass in an object with an invalid id', async () =>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act
// 		let invalidMockUser = new UserInfo(-1,'Pepper', 'Elam','jeremyelam@gmail.com','password',new Date('10/15/2018'));
// 		try{
// 			await sut.getInstance().save(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});
// 	test('will return BadRequestError when new users tries to pass in an object with an invalid first name', async () =>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act
// 		let invalidMockUser = new UserInfo(6,'', 'Elam','jeremyelam@gmail.com','password',new Date('10/15/2018'));
// 		try{
// 			await sut.getInstance().save(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});
// 	test('will return BadRequestError when new users tries to pass in an object with an invalid last name', async () =>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act
// 		let invalidMockUser = new UserInfo(6,'Jeremy', 'Pepper','jeremyelam@gmail.com','password',new Date('10/15/2018'));
// 		try{
// 			await sut.getInstance().save(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});
// 	test('will return BadRequestError when new users tries to pass in an object with an invalid password', async () =>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act
// 		let invalidMockUser = new UserInfo(6,'Pepper', 'Elam','jeremyelam@gmail.com','',new Date('10/15/2018'));
// 		try{
// 			await sut.getInstance().save(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});
// 	test('will return BadRequestError when new users tries to pass in an object with an invalid date', async () =>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act
// 		let invalidMockUser = new UserInfo(6,'Pepper', 'Elam','jeremyelam@gmail.com','password',null);
// 		try{
// 			await sut.getInstance().save(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});

// 	test('will return InvalidRequestError when new user tries to pass in an invalid user', async () =>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act
		
// 		try{
// 			await sut.getInstance().save(null);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});

// 	test(' will return true when successful update of user by id', async ()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(true);
// 		validator.isValidId = jest.fn().mockReturnValue(true);
// 		//Act
// 		let validMockUser = new UserInfo(1, 'update','update','update','update',null);
// 		let result = sut.getInstance().update(validMockUser);
// 		//Assert
// 		expect(result).toBeTruthy();
// 	});

// 	test('will invoke BadRequestError when given invalid id', async ()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		let invalidMockUser = new UserInfo(9999, 'update','update','update','update',new Date());
// 		validator.isValidId = jest.fn().mockReturnValue(true);
// 		validator.isValidObject = jest.fn().mockReturnValue(true);
// 		//Act
// 		try{
// 			await sut.getInstance().update(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof ResourceNotFoundError).toBeTruthy();
// 		}
// 	});
	

// 	test('will invoke BadRequestError when given an invalid id (double)', async ()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act
// 		try {
// 			let invalidMockUser = new UserInfo(3.5, 'update','update','update','update',null);
// 			//Assert
// 			await sut.getInstance().update(invalidMockUser);
// 		}catch(e){
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});
// 	test('will invoke BadRequestError when given an invalid id (negative)', async ()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
// 		//Act
// 		try {
// 			let invalidMockUser = new UserInfo(-1, 'update','update','update','update',null);
// 			//Assert
// 			await sut.getInstance().update(invalidMockUser);
// 		}catch(e){
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 	});

// 	test('will invoke InvalidRequestError when given an invalid id (negative)', async ()=>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(false);
		
// 		//Act
// 		try {
// 			let invalidMockUser = new UserInfo(-1, 'update','update','update','update', new Date());
// 			//Assert
// 			await sut.getInstance().update(invalidMockUser);
// 		}catch(e){
// 			expect(e instanceof BadRequestError).toBeTruthy();
// 		}
// 		//logic doesn't make sense going back to it later. 
// 	});
// 	test('will invoke ResourcePersistenceError when trying to update a user with an already used email address. ', async() =>{
// 		//Arrange
// 		expect.assertions(1);
// 		validator.isValidObject = jest.fn().mockReturnValue(true);
// 		//Act
// 		try{
// 			let invalidMockUser = new UserInfo(3, 'update', 'update','jeremyelam@gmail.com', 'update', new Date());
// 			await sut.getInstance().update(invalidMockUser);
// 		}catch(e){
// 			//Assert
// 			expect(e instanceof ResourcePersistenceError).toBeTruthy();
// 		}
// 	});

// });