import data from '../data/card-db';
import { Cards } from '../models/cards';
import {CrudRepository} from './crud-repo';
import validator from '../util/validator';
import {  
	InternalServerError
} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapCardResultSet, mapUserResultSet} from '../util/result-set-mapper';

export class CardRepository implements CrudRepository<Cards>{
	
	baseQuery = 'select * from full_card_info'
	async getAll(): Promise<Cards[]>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery}`;
			let rs =await client.query(sql);
			return rs.rows.map(mapCardResultSet);
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	async getById(id: number): Promise<Cards>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where id = ${id}`;
			let rs = await client.query(sql);
			return mapCardResultSet(rs.rows[0]);
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}

	async getCardByUniqueKey(key: string, val: string):Promise<Cards>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery} where ${key} = $1`;
			let rs = await client.query(sql, [val]);
			return mapCardResultSet(rs.rows[0]);
		}catch (e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	async save(newCard: Cards): Promise<Cards>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
		
			let rarityID = (await client.query('select id from card_rarities where card_rarity = $1', [newCard.card_rarity])).rows[0].id;
			console.log(rarityID);
			let setID = (await client.query('select id from card_sets where card_set = $1', [newCard.card_set])).rows[0].id;
			let sql = 'insert into card_info(card_name, card_set, card_rarity, card_price) values($1,$2,$3,$4) returning id';
			let rs = await client.query(sql, [newCard.card_name, setID, rarityID, newCard.card_price]);
			newCard.id = rs.rows[0].id;
			return newCard;
		}catch(e){
			// console.log(e);
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	async update(updateCard: Cards): Promise<boolean>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			
			let cardRarity = (await client.query('select id from card_rarities where card_rarity = $1',[updateCard.card_rarity])).rows[0].id;
			console.log(cardRarity);
			
			let cardSet = (await client.query('select id from card_sets where card_set = $1',[updateCard.card_set])).rows[0].id;
			console.log(cardSet);
			
			let sql = 'update card_info set card_set = $2, card_rarity = $3, card_price = $4 where id =$1';
			await client.query(sql, [updateCard.id, cardSet, cardRarity, updateCard.card_price]);
			return true;
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
	async deleteById(id: number): Promise<boolean>{
		console.log('3');
		
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = 'delete from card_info where id = $1';
			let rs = await client.query(sql, [id]);
			return rs.rows[0];
		}catch(e){
			throw new InternalServerError();
		}finally{
			client && client.release();
		}
	}
}
	


