import data from '../data/user-db';
import { UserInfo } from '../models/user';
import { CrudRepository } from './crud-repo';
import {  
	DataNotFoundError,
	DataNotStoredError,
	AuthenticationError,
	InvalidRequestError
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
					reject(new InvalidRequestError());
					return;
				}

				resolve(users.map(this.removePassword));
			});
		});
	}
	getById(id:number): Promise<UserInfo>{
		return new Promise<UserInfo>((resolve,reject) =>{
			if(!validator.isValidId(id)){
				reject(new InvalidRequestError());
			}

			setTimeout(() =>{
				const user = {...data.find(user => user.user_id === id)};

				if(Object.keys(user).length === 0){
					reject(new DataNotFoundError());
					return;
				}
				resolve(this.removePassword(user));
			}, 1000);
		});
	}

	save(newUser: UserInfo): Promise<UserInfo>{
		return new Promise<UserInfo>((resolve, reject) =>{
			if(!validator.isValidObject(newUser, 'id')){
				reject(new InvalidRequestError('Invalid property values found in provided user.'));
				return;
			}
			setTimeout(()=>{
				let conflict = data.filter( user => user.user_email == newUser.user_email).pop();

				if(conflict){
					reject(new InvalidRequestError('The provided email address is already taken'));
					return;
				}
				newUser.user_id = (data.length)+1;
				data.push(newUser);
				resolve(this.removePassword(newUser));
			});
		});


	}
	update(updatedUser: UserInfo): Promise<boolean>{
		return new Promise<boolean>((resolve, reject)=>{
			if(!validator.isValidObject(updatedUser) || !validator.isValidId(updatedUser.user_id)){
				reject(new InvalidRequestError('Invalid user provided (invalid values found).'));
				return;
			}
			setTimeout(() =>{
				let persistedUser = data.find(user => user.user_id === updatedUser.user_id);
				if(!persistedUser){
					reject(new InvalidRequestError('No user found with id'));
				}

				const conflict = data.filter(user =>{
					if(user.user_id== updatedUser.user_id) return false;
					return user.user_email == updatedUser.user_email;
				});

				if(conflict){
					reject(new InvalidRequestError('Provided email is taken by another user.'));
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
				rejects(new InvalidRequestError('Invalid id number was provided'));
			}
			rejects(new DataNotStoredError());
		});
	}


	private removePassword(user: UserInfo): UserInfo {
		let usr = {...user};
		delete usr.user_pw;
		return usr;   
	}


}