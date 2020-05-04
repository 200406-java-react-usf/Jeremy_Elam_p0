import { UserProfile} from '../models/profile';
import {CrudRepository} from './crud-repo';
import { InternalServerError} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapProfileResultSet} from '../util/result-set-mapper';

export class ProfileRepository implements CrudRepository<UserProfile>{

	baseQuery = 'select * from full_profile_info'

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
	async getById(id:number): Promise<UserProfile>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where profile_id = ${id};`;
			let rs = await client.query(sql);
			return mapProfileResultSet(rs.rows[0]);
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	async save(newProfile: UserProfile): Promise<UserProfile>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let setId = (await client.query('select id from card_sets where card_set = $1',[newProfile.card_set])).rows[0].id;
			let cardId = (await client.query('select id from card_info where card_name = $1',[newProfile.card_name])).rows[0].id;

			let sql = 'insert into profile(user_un, fav_archetypes, fav_color, fav_set, fav_card, user_info) values($1,$2,$3,$4,$5,$6) returning id;';
			let rs = await client.query(sql, [newProfile.user_un, newProfile.fav_archetypes, newProfile.fav_colors,setId, cardId,newProfile.user_info]);
			return newProfile;
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
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