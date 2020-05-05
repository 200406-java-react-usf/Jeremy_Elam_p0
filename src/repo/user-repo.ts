import { UserInfo } from '../models/user';
import { CrudRepository } from './crud-repo';
import {
	InternalServerError
} from '../errors/errors';
import validator from '../util/validator';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapUserResultSet} from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<UserInfo> {
	
	baseQuery = `select users_info.id, user_fn , user_ln , user_email ,user_pw, name
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
	}
	

	async save(newUser: UserInfo): Promise<UserInfo>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let roleId = (await client.query('select id from user_roles where name = $1', [newUser.role])).rows[0].id;
			let sql = `insert into users_info(user_fn , user_ln , user_email ,user_pw, role )
					values($1, $2, $3, $4, $5) returning id`;
			let rs = await client.query(sql, [newUser.user_fn, newUser.user_ln, newUser.user_email, newUser.user_pw,roleId]);
			
			newUser.id = rs.rows[0].id; 
			return newUser;
		} catch (e){
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
			throw new InternalServerError();
		} finally{
			client && client.release();
		}
	}

	async update(updatedUser: UserInfo): Promise<boolean> {
	
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let userId = (await client.query('select id from users_info where id = $1', [updatedUser.id])).rows[0].id;
			let userRole = (await client.query('select id from user_roles where name = $1', [updatedUser.role])).rows[0].id;
			let sql = 'update users_info set user_fn = $2, user_ln = $3, user_email = $4, user_pw = $5, role = $6 where id = $1';
			await client.query(sql, [userId, updatedUser.user_fn, updatedUser.user_ln, updatedUser.user_email, updatedUser.user_pw ,userRole]);
			return true;
		} catch(e){
			throw new InternalServerError();
		} finally {
			client && client.release();
		}
	}
	
	async deleteById(id:number): Promise<boolean>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = 'delete from users_info where id = $1';
			let rs = await client.query(sql, [id]);
			return rs.rows[0];
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
}