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
	
	baseQuery = `select user_fn , user_ln , user_email ,user_pw, name
	from users_info
	left join user_roles 
	on users_info.role = user_roles.id`;
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
	

	async save(newUser: UserInfo): Promise<UserInfo>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let roleId = (await client.query('select id from user_roles where name = $1', [newUser.role])).rows[0].id;
			console.log(roleId);
			let sql = `insert into users_info(user_fn , user_ln , user_email ,user_pw, role )
					values($1, $2, $3, $4, $5) returning id`;
			let rs = await client.query(sql, [newUser.user_fn, newUser.user_ln, newUser.user_email, newUser.user_pw,roleId]);
			
			newUser.id = rs.rows[0].id; 
			return newUser;
		} catch (e){
			console.log(e);
			throw new InternalServerError();
		}finally {
			client && client.release();
		}
	}

	async getUserByUniqueKey(key: string, val: string):Promise<UserInfo>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where users_info.${key} = $1`;
			
			let rs = await client.query(sql, [val]);
			return mapUserResultSet(rs.rows[0]);
		}catch (e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	async getUserByCredentials(email: string, password: string):Promise<UserInfo>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where users_info.email = $1 and users_info.password = $2;`;
			
			
			let rs = await client.query(sql, [email, password]);
			
			
			return mapUserResultSet(rs.rows[0]);
		}catch(e){
			throw new InternalServerError()
		} finally{
			client && client.release();
		}
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
		if(!user || !user.user_pw) return user;
		let usr = {...user};
		delete usr.user_pw;
		return usr;   
	}
}