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

	getUserById(id: number):Promise<UserInfo>{
		return new Promise<UserInfo>(async(resolve, rejects)=>{
			if(!isValidId(id)){
				return rejects(new BadRequestError());
			}
			let user = {...await this.userRepo.getById(id)};
			if(isEmptyObject(user)){
				return rejects(new ResourceNotFoundError());
			}
			resolve(this.removePassword(user));
		});
	}

	authenticateUser(email: string, password:string): Promise<UserInfo>{
		return new Promise<UserInfo>(async(resolve, reject)=>{
			if(!isValidStrings(email, password)){
				reject(new BadRequestError());
				return;
			}
			let authUser: UserInfo;
			try{
				authUser = await this.userRepo.getUserByCredentials(email, password);
			}catch(e){
				reject(e);
			}
			if(isEmptyObject(authUser)){
				reject(new AuthenticationError('Bad credentials provided'));
				return;
			}
			resolve(this.removePassword(authUser));
		});
	}
	
	addNewUser(newUser:UserInfo): Promise<UserInfo>{
		return new Promise<UserInfo>(async(resolve,reject)=>{
			if(!isValidObject(newUser,'id')){
				reject(new BadRequestError());
			}
		});
	}
	updateUser(updateUser: UserInfo):Promise<boolean>{
		return new Promise<boolean>(async(resolve, reject)=>{
			if(!isValidObject(this.addNewUser)){
				reject(new BadRequestError('Invalid user provided (invalid values found'));
				return;
			}
			try{
				resolve(await this.userRepo.update(updateUser));
			}catch(e){
				reject(e);
			}
		});
	}
	private removePassword(user: UserInfo): UserInfo {
		if(!user || !user.user_pw) return user;
		let usr = {...user};
		delete usr.user_pw;
		return usr;   
	}
}
