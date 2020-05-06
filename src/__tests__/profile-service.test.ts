import {ProfileService} from '../services/profile-service';
import {UserProfile} from '../models/profile';
import validator from '../util/validator';
import {
	BadRequestError,  
	ResourceNotFoundError, 
	ResourcePersistenceError,
}from '../errors/errors';

jest.mock('../repo/profile-repo', ()=>{
	return class ProfileRepository{
		getAll = jest.fn();
		getById = jest.fn();
		save = jest.fn();
		getProfileByUniqueKey = jest.fn();
		update = jest.fn();
		deleteById = jest.fn();
	};
});

describe('profileService', ()=>{
	let sut: ProfileService;
	let mockRepo;

	let mockProfiles = [
		new UserProfile ('lazyspell', 1,'bant', 'green', 'WAR', 'Nissa', 1),
		new UserProfile ('spellyspell', 2,'bant', 'green', 'WAR', 'Nissa', 2),
		new UserProfile ('lazyspell', 3,'bant', 'green', 'WAR', 'Nissa', 3),
		new UserProfile ('lazyspell', 4,'bant', 'green', 'WAR', 'Nissa', 4),
		new UserProfile ('lazyspell', 5,'bant', 'green', 'WAR', 'Nissa', 5),

	];

	beforeEach(()=>{
		mockRepo = jest.fn(()=>{
			return{
				getAll: jest.fn(),
				getById: jest.fn(),
				getProfileByUniqueKey: jest.fn(),
				save: jest.fn(),
				update:jest.fn(),
				deleteById: jest.fn()
			};
		});
		sut = new ProfileService(mockRepo);
	});

	test('should resolve to UserProfile when getAllProfiles successfully retrieves profiles from the data source', async() =>{
		//Arrange 
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockProfiles);
		//Act
		let result = await sut.getAllProfile();
		//Assert
		expect(result).toBeTruthy();
		expect(result.length).toBe(5);
	});
	test('should reject with ResourcesNotFound Error when getAllProfiles fails to get any profiles from the data sources', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getAll = jest.fn().mockReturnValue([]);
		//Act
		try{
			await sut.getAllProfile();
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

	test('should return use when given a valid id number', async()=>{
		//Arrange
		expect.assertions(3);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.getById = jest.fn().mockImplementation((id:number)=>{
			return new Promise<UserProfile>((resolve) => resolve(mockProfiles[id -1]));
		});
		//Act
		let result = await sut.getProfileById(1);

		//Assert
		expect(result).toBeTruthy();
		expect(result.user_un).toBe('lazyspell');
		expect(result.fav_archetypes).toBe('bant');
	});
	test('should throw bad request error when given an invalid id number (negative)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getProfileById(-1);
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
			await sut.getProfileById(3.14);
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
			await sut.getProfileById(0);
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
			await sut.getProfileById(NaN);
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
			await sut.getProfileById(100);
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});

	test('should return new profile information when a new profile is given', async()=>{
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		mockRepo.isEmailAvailable = jest.fn().mockReturnValue(true);
		mockRepo.save = jest.fn().mockImplementation((newUser:UserProfile)=>{
			return new Promise<UserProfile>((resolve) => {
				mockProfiles.push(newUser);
				resolve(newUser);
			});
		});
		//Act 
		let result = await sut.addNewProfile(new UserProfile('lazyspell', 6,'bant', 'green', 'WAR', 'Nissa', 6));
		//Assert 
		expect(result).toBeTruthy();
		expect(mockProfiles.length).toBe(6);
	});

	test('should return BadRequestError when given a bad UserInfo object', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewProfile(new UserProfile('lazyspell', 6,'', 'green', 'WAR', 'Nissa', 6));
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should return ResourcePersistenceError when given a ProfileInfo with an UserInfo id that is already being used', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		sut.isUserInfoAvailable = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewProfile(new UserProfile('lazyspell', 6,'', 'green', 'WAR', 'Nissa', 5));
		}catch(e){
			//Assert
			expect(e instanceof ResourcePersistenceError).toBe(false);
		}
	});
	test('should return BadRequestError when given a bad Cards object', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewProfile(new UserProfile('lazyspell', 6,'', 'green', '', 'Nissa', 5));
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should return true if a card with the given id number was successfully deleted', async ()=>{
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.deleteById = jest.fn().mockReturnValue(true);

		//Act
		let result = await sut.deleteProfileById({'id':1});
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
			await sut.deleteProfileById({'id': -1});
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
			await sut.deleteProfileById({'': 1});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.assertions(1);
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isEmptyObject = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getProfileByUniqueKey({id: ''});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});
	test('should return correct user when given correct key and value for getByUniqueKey', async () => {

		expect.assertions(2);

		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isEmptyObject = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(true);
		
		sut.getProfileById = jest.fn().mockImplementation((id: number)=>{
			return new Promise<UserProfile>((resolve)=>{
				resolve(mockProfiles.find(user => user.id === id));
			});
		});
		mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
			return new Promise<UserProfile> ((resolve) => {
				resolve(mockProfiles.find(user => user[key] === val));
			});
		});

		let result = await sut.getProfileByUniqueKey({id: 1});

		expect(result).toBeTruthy();
		expect(result.id).toBe(1);
	});

	test('should return ResourceNotFoundError when given a value for getByUniqueKey that does not exist', async () => {

		expect.assertions(1);

		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isEmptyObject = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(false);

		mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
			return new Promise<UserProfile> ((resolve) => {
				resolve(mockProfiles.find(user => user[key] === val));
			});
		});

		try{
			await sut.getProfileByUniqueKey({user_un: ''});
		} catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}

	});
	test('should return ResourceNotFoundError when given a value for getByUniqueKey that does not exist', async () => {

		expect.assertions(1);

		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isEmptyObject = jest.fn().mockReturnValue(false);
		validator.isValidStrings = jest.fn().mockReturnValue(true);

		mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
			return new Promise<UserProfile> ((resolve) => {
				resolve(mockProfiles.find(user => user[key] === val));
			});
		});

		try{
			await sut.getProfileByUniqueKey({user_un: ''});
		} catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}

	});
	test('should return ResourceNotFoundError when given a value for getByUniqueKey that does not exist', async () => {

		expect.assertions(1);

		validator.isPropertyOf = jest.fn().mockReturnValue(false);
		validator.isEmptyObject = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(true);

		mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
			return new Promise<UserProfile> ((resolve) => {
				resolve(mockProfiles.find(user => user[key] === val));
			});
		});

		try{
			await sut.getProfileByUniqueKey({user_username: 'lazyspell'});
		} catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}

	});
	test('should return correct user when given correct key and value for getByUniqueKey', async () => {

		expect.assertions(2);

		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isEmptyObject = jest.fn().mockReturnValue(true);
		validator.isValidStrings = jest.fn().mockReturnValue(true);
		
		sut.getProfileById = jest.fn().mockImplementation((id: number)=>{
			return new Promise<UserProfile>((resolve)=>{
				resolve(mockProfiles.find(user => user.id === id));
			});
		});
		mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
			return new Promise<UserProfile> ((resolve) => {
				resolve(mockProfiles.find(user => user[key] === val));
			});
		});

		let result = await sut.getProfileByUniqueKey({id: 1});

		expect(result).toBeTruthy();
		expect(result.id).toBe(1);

	});

	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		//Act
		try{
			await sut.updatedProfile(new UserProfile('', 1, '', 'green', 'none', 'none', 1));
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
		
	});
	test('should return ResourceNotFoundError a key value is given out of the scope of the data', async ()=>{
		//Arrange
		expect.hasAssertions();
		mockRepo.getProfileByUniqueKey = jest.fn().mockReturnValue([]);
		//Act
		try{
			await sut.getProfileByUniqueKey({user_un:'lazyspell'});
		}catch(e){
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
		
	});
	
});