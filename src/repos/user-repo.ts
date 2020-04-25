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
					reject(new DataNotFoundError());
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
			reject(new InvalidRequestError());
			return;
		});
	}
	update(updatedUser: UserInfo): Promise<boolean>{
		return new Promise<boolean>((resolve, reject)=>{
			reject(new InvalidRequestError());
			return;
		});
	}

	deleteById(id:number): Promise<boolean>{
		return new Promise<boolean>((resolve, rejects)=>{
			rejects(new InvalidRequestError());
		});
	}


	private removePassword(user: UserInfo): UserInfo {
		let usr = {...user};
		delete usr.user_pw;
		return usr;   
	}


}