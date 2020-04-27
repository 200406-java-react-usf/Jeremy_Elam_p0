import data from '../data/user-db';
import { UserInfo } from '../models/user';
import { CrudRepository } from './crud-repo';
import {  
	ResourceNotFoundError,
	ResourcePersistenceError,
	BadRequestError,
	AuthenticationError,
	NotImplementedError
} from '../errors/errors';
import validator from '../util/validator';

export class UserRepository implements CrudRepository<UserInfo> {
	private static instance: UserRepository;

	private constructor(){}
	static getInstance(){
		return !UserRepository.instance ? UserRepository.instance = new UserRepository() : UserRepository.instance;
	}
	getAll(): Promise<UserInfo[]> {
		return new Promise<UserInfo[]>((resolve, reject) =>{
			setTimeout(() =>{
				let users = [];
				for(let user of data){
					users.push({...user});
				}
				if(users.length == 0){
					reject(new ResourceNotFoundError());
					return;
				}
				resolve(users.map(this.removePassword));
			});
		});
	}
	getById(id:number): Promise<UserInfo>{
		return new Promise<UserInfo>((resolve,reject) =>{
			if(!validator.isValidId(id)){
				reject(new BadRequestError());
			}
			setTimeout(() =>{
				const user = {...data.find(user => user.id === id)};
				if(Object.keys(user).length === 0){
					reject(new ResourceNotFoundError());
					return;
				}
				resolve(this.removePassword(user));
			}, 1000);
		});
	}

	save(newUser: UserInfo): Promise<UserInfo>{
		return new Promise<UserInfo>((resolve, reject) =>{
			if(!validator.isValidObject(newUser, 'id')){
				reject(new BadRequestError('Invalid property values found in provided user.'));
				return;
			}
			setTimeout(()=>{
				let conflict = data.filter( user => user.user_email == newUser.user_email).pop();
				if(conflict){
					reject(new ResourcePersistenceError('The provided email address is already taken'));
					return;
				}
				newUser.id = (data.length)+1;
				data.push(newUser);
				resolve(this.removePassword(newUser));
			});
		});


	}

	update(updatedUser: UserInfo): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			if (!validator.isValidObject(updatedUser)) {
				reject(new BadRequestError('Invalid user provided (invalid values found).'));
				return;
			}
			setTimeout(() => {
				let persistedUser = data.find(user => user.id === updatedUser.id);
				if (!persistedUser) {
					reject(new ResourceNotFoundError('No user found with provided id.'));
					return;
				}
				const conflict = data.filter(user => {
					if (user.id == updatedUser.id) return false;
					return user.user_email == updatedUser.user_email; 
				}).pop();
				if (conflict) {
					reject(new ResourcePersistenceError('Provided email is taken by another user.'));
					return;
				}
				persistedUser = updatedUser;
				resolve(true);
			});
		});
    
	}
	deleteById(id:number): Promise<boolean>{
		return new Promise<boolean>((resolve, rejects)=>{
			if(!validator.isValidId){
				rejects(new BadRequestError('Invalid id number was provided'));
			}
			rejects(new NotImplementedError());
		});
	}
	private removePassword(user: UserInfo): UserInfo {
		let usr = {...user};
		delete usr.user_pw;
		return usr;   
	}


}