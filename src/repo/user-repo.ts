import data from '../data/user-db';
import { UserInfo } from '../models/user';
import { CrudRepository } from './crud-repo';
import {  
	ResourceNotFoundError,
	ResourcePersistenceError,
	BadRequestError,
	NotImplementedError,
	InternalServerError
} from '../errors/errors';
import validator from '../util/validator';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapUserResultSet} from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<UserInfo> {
	
	baseQuery = `select users_info.id,first_name , last_name, email, users_info.user_pw, name
	from users_info
	left join user_roles 
	on users_info.role_id = user_roles.id`;
	async getAll(): Promise<UserInfo[]> {
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery}`;
			let rs = await client.query(sql);
			return rs.rows.map(mapUserResultSet);
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
		
	}
	async getById(id:number): Promise<UserInfo>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where users_info.id = ${id};`;
			let rs = await client.query(sql);
			return mapUserResultSet(rs.rows[0]);
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	};
	

	save(newUser: UserInfo): Promise<UserInfo>{
		return new Promise<UserInfo>((resolve, reject) =>{
			setTimeout(()=>{
				newUser.id = (data.length)+1;
				data.push(newUser);
				resolve(newUser);
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
	getUserByCredentials(email: string, password: string):Promise<UserInfo>{
		return new Promise<UserInfo>((resolve, reject)=>{
			setTimeout(()=>{
				const user = {...data.find(user => user.user_email === email && user.user_pw === password)};
				resolve(user);
			},250);
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
		if(!user || !user.user_pw) return user;
		let usr = {...user};
		delete usr.user_pw;
		return usr;   
	}
}