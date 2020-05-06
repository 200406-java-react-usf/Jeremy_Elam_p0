/* eslint-disable no-unused-vars */
import { UserProfile} from '../models/profile';
import {CrudRepository} from './crud-repo';
import { InternalServerError} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapProfileResultSet} from '../util/result-set-mapper';

export class ProfileRepository implements CrudRepository<UserProfile>{

	/**
	 * base query to obtain specific information from database
	 */
	baseQuery = `select 
	profile.user_un, 
	profile.profile_id, 
	profile.fav_archetypes , 
	profile.fav_color , 
	card_sets.card_set , 
	card_info.card_name, 
	users_info.id from profile join users_info on users_info.id =  profile.id join card_sets on card_sets.id = profile.fav_set join card_info on card_info.id = profile.fav_card`
	/**
	 * send requests to get all uses from database
	 */
	async getAll(): Promise<UserProfile[]>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery}`;
			let rs = await client.query(sql);
			return rs.rows.map(mapProfileResultSet);
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	/**
	 * * Retrieve all profiles from the database. 
	 * returns internal server error is query doesn't work
	 * @param id 
	 */
	async getById(id:number): Promise<UserProfile>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where profile_id = ${id};`;
			let rs = await client.query(sql);
			return mapProfileResultSet(rs.rows[0]);
		}catch(e){
			throw new InternalServerError(e.message);
		}finally{
			client && client.release();
		}
	}
	/**
	 *  * Saves new profile object into database
	 * setid gets the needed id from card_set table and inserts that id into one of the values in the last query
	 * cardId gets the needed id from card_set table and inserts that id into one of the values in the last query  
	 * returns internal server error is query doesn't work
	 * @param newProfile 
	 */
	async save(newProfile: UserProfile): Promise<UserProfile>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let setId = (await client.query('select id from card_sets where card_set = $1',[newProfile.card_set])).rows[0].id;
			let cardId = (await client.query('select id from card_info where card_name = $1',[newProfile.card_name])).rows[0].id;

			let sql = 'insert into profile(user_un, fav_archetypes, fav_color, fav_set, fav_card, id) values($1,$2,$3,$4,$5,$6) returning id;';
			let rs = await client.query(sql, [newProfile.user_un, newProfile.fav_archetypes, newProfile.fav_colors,setId, cardId,newProfile.id]);
			return newProfile;
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	/**
	 * Retrieves all profile image from base query and turns the result
	 * @param key 
	 * @param val 
	 */
	async getProfileByUniqueKey(key: string, val:string): Promise<UserProfile>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where profile.${key} = $1`;
			let rs = await client.query(sql,[val]);
			return mapProfileResultSet(rs.rows[0]);
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	/**
	 * 	 * update user information inside database.
		 * setId gets the id needed to update table
		 * cardId get the id needed to update table
	* @param updateProfile 
	*/
	async update(updateProfile: UserProfile): Promise<boolean>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let setId = (await client.query('select id from card_sets where card_set = $1',[updateProfile.card_set])).rows[0].id;
			let cardId = (await client.query('select id from card_info where card_name = $1',[updateProfile.card_name])).rows[0].id;

			let sql = 'update profile set user_un = $2, fav_archetypes = $3, fav_color = $4, fav_set = $5, fav_card = $6 where id =$1;';
			await client.query(sql, [updateProfile.profile_id, updateProfile.user_un, updateProfile.fav_archetypes, updateProfile.fav_colors, setId,cardId]);
			return true;
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	/**
	 * delete user when given an id number
	 * @param id 
	 */
	async deleteById(id: number): Promise<boolean>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = 'delete from profile where id = $1';
			let rs = await client.query(sql, [id]);
			return rs.rows[0];
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}



}