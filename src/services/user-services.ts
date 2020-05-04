import {UserInfo} from '../models/user';
import {UserRepository} from '../repo/user-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import { 
	BadRequestError, 
	ResourceNotFoundError, 
	NotImplementedError, 
	ResourcePersistenceError, 
	AuthenticationError 
} from '../errors/errors';




export class UserService{
	constructor(private userRepo: UserRepository){
		this.userRepo = userRepo;
	}

	async getAllUsers(): Promise<UserInfo[]>{
		let users = await this.userRepo.getAll();
		if(users.length === 0){
			throw new ResourceNotFoundError();
		}
		return users.map(this.removePassword);
	}

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

	async getUserByUniqueKey(queryObj: any): Promise<UserInfo>{
		try {
			let queryKeys = Object.keys(queryObj);
			console.log(queryObj);
			
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
		}catch (e){
			throw e;
		}
	}

	// authenticateUser(email: string, password:string): Promise<UserInfo>{
	// 	return new Promise<UserInfo>(async(resolve, reject)=>{
	// 		if(!isValidStrings(email, password)){
	// 			reject(new BadRequestError());
	// 			return;
	// 		}
	// 		let authUser: UserInfo;
	// 		try{
	// 			authUser = await this.userRepo.getUserByCredentials(email, password);
	// 			if(isEmptyObject(authUser)){
	// 				throw new AuthenticationError('Bad credentials provided');
	// 			}
	// 			return this.removePassword(authUser);
	// 		}catch(e){
	// 			reject(e);
	// 		}
	// 		if(isEmptyObject(authUser)){
	// 			reject(new AuthenticationError('Bad credentials provided'));
	// 			return;
	// 		}
	// 		resolve(this.removePassword(authUser));
	// 	});
	// }
	
	async addNewUser(newUser:UserInfo): Promise<UserInfo>{
		try {
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
		}catch (e) {
			throw e;
		}
	}
	async deleteUserById(id: number): Promise<boolean>{
		let keys = Object.keys(id);
		console.log(keys);
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
	

	private async isEmailAvailable(email: string): Promise<boolean>{
		try{
			await this.getUserByUniqueKey({'user_email':email});
		}catch(e){
			console.log('email is available');
			return true;
		}
		console.log('email is unavailable');
		return false;
	}
	removePassword(user: UserInfo): UserInfo {
		if(!user || !user.user_pw) return user;
		let usr = {...user};
		delete usr.user_pw;
		return usr;   
	}
}
