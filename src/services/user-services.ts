/* eslint-disable no-unused-vars */
import {UserInfo} from '../models/user';
import {UserRepository} from '../repo/user-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import { 
	BadRequestError, 
	ResourceNotFoundError, 
	ResourcePersistenceError, 
} from '../errors/errors';




export class UserService{
	constructor(private userRepo: UserRepository){
		this.userRepo = userRepo;
	}
	/**
	 * sends request to server to get all users if database is empty throws error
	 */
	async getAllUsers(): Promise<UserInfo[]>{
		let users = await this.userRepo.getAll();
		if(users.length === 0){
			throw new ResourceNotFoundError();
		}
		return users.map(this.removePassword);
	}
	/**
	 * * checks to see if id is valid
	 * sends request to server and waits for response
	 * if response is empty throw error 
	 * return user info based on id
	 * @param id 
	 */
	async getUserById(id: number):Promise<UserInfo>{
		if(!isValidId(id)){
			throw new BadRequestError();
		}
		let user = {...await this.userRepo.getById(id)};
		if(isEmptyObject(user)){
			throw new ResourceNotFoundError();
		}
		return this.removePassword(user);
	}
	/**
	 *  * check to see if key names in object is the same as property
	 * checks to see if value is string. if string check to see if valid string, if not valid throw error
	 * waits for server response check to see if response is empty, if empty throw error
	 * @param queryObj 
	 */
	async getUserByUniqueKey(queryObj: any): Promise<UserInfo>{
		
		let queryKeys = Object.keys(queryObj);
		
		if(!queryKeys.every(key => isPropertyOf(key, UserInfo))){
			throw new BadRequestError();
		}
		let key = queryKeys[0];
		let val = queryObj[key];
		if(key === 'id'){
			return await this.getUserById(+val);
		}
		if(!isValidStrings(val)){
			throw new BadRequestError();
		}
		let user = await this.userRepo.getUserByUniqueKey(key, val);
		if(isEmptyObject(user)){
			throw new ResourceNotFoundError();
		}
		return this.removePassword(user);
		
	}

	/**
	 *  * check to see if parameter object is valid object, if not valid throw error
	 * check to see if user email is already in use, if email already in use throw error
	 * if all conditions pass give data to database to update in database
	 * @param newUser 
	 */
	async addNewUser(newUser:UserInfo): Promise<UserInfo>{
		
		if(!isValidObject(newUser,'id')){
			throw new BadRequestError('Invalid property values fround in provided user.');
		}
		let emailAvailable = await this.isEmailAvailable(newUser.user_email);
		if(!emailAvailable){
			throw new ResourcePersistenceError('The provided email is already in use.');
		}
		newUser.role = 'User';
		const persistedUser = await this.userRepo.save(newUser);
		return this.removePassword(persistedUser);
		
	}
	/**
	 *  * checks to see if object passed in parameter is valid, if not throw error
	 * checks to see if id is valid id, if not throw error
	 * delete sends request to delete user by database
	 * @param id 
	 */
	async deleteUserById(id: object): Promise<boolean>{
		let keys = Object.keys(id);
		if(!keys.every(key=> isPropertyOf(key, UserInfo))){
			throw new BadRequestError();
		}
		let key = keys[0];
		let value = +id[key];

		if(!isValidId(value)){
			throw new BadRequestError();
		}
		await this.userRepo.deleteById(value);

		return true;
	}
	/**
	 * * checks to see if object passed in parameters is valid, if not throw error
	 * gives data to server to update user info
	 * @param updateUser 
	 */
	async updateUser(updateUser: UserInfo):Promise<boolean>{
		try{
			if(!isValidObject(updateUser)){
				throw new BadRequestError();
			}
			
			let emailAvailable = await this.isEmailAvailable(updateUser.user_email);
	
			let database = await this.getUserById(updateUser.id);
			
			let databaseEmail = await this.getUserByUniqueKey({'user_email':updateUser.user_email});
			
			if(database.user_email == databaseEmail.user_email){
				
				emailAvailable = true;
				
			}
			if(!emailAvailable){
				throw new ResourcePersistenceError();
			}
			return await this.userRepo.update(updateUser);
		}catch(e){
			throw e;
		}
	}
	
	/**
	 * 
	 * checks to see if email address is available in the database
	 * @param email 
	 */
	async isEmailAvailable(email: string): Promise<boolean>{
		try{
			await this.getUserByUniqueKey({'user_email':email});
		}catch(e){
			return true;
		}
		return false;
	}
	/**
	 * removes password from users when user object is passed through
	 * @param user 
	 */
	removePassword(user: UserInfo): UserInfo {
		if(!user || !user.user_pw) return user;
		let usr = {...user};
		delete usr.user_pw;
		return usr;   
	}
}
