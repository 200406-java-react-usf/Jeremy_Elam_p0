import data from '../data/card-db';
import { Cards } from '../models/cards';
import {CrudRepository} from './crud-repo';
import validator from '../util/validator';
import {  
	BadRequestError, 
	AuthenticationError, 
	ResourceNotFoundError, 
	ResourcePersistenceError,
	NotImplementedError, 
	InternalServerError
} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';
import {mapCardResultSet, mapUserResultSet} from '../util/result-set-mapper';

export class CardRepository implements CrudRepository<Cards>{
	
	baseQuery = `select * from full_card_info`
	async getAll(): Promise<Cards[]>{
		let client: PoolClient;
		try{
			client = await connectionPool.connect();
			let sql = `${this.baseQuery}`;
			let rs =await client.query(sql);
			console.log(rs);
			
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
			return mapCardResultSet(rs.rows[0])
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
			console.log(val);
			console.log(key);
			
			let rs = await client.query(sql, [val]);
			console.log(rs);
			
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
			console.log("______________________________________________________");
			
			let rarityID = (await client.query('select id from card_rarities where card_rarity = $1', [newCard.card_rarity])).rows[0].id;
			console.log("______________________________________________________");
			
			console.log(rarityID);
			console.log("______________________________________________________");
			
			let setID = (await client.query('select id from card_sets where card_set = $1', [newCard.card_set])).rows[0].id;
			console.log(setID);
			console.log("______________________________________________________");

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
	update(updateCard: Cards): Promise<boolean>{
		return new Promise<boolean>((resolve, reject)=>{
			if(!validator.isCardValidObject(updateCard)){
				reject(new BadRequestError('Invalid card provided (invalid values found).'));
				return;
			}
			setTimeout(()=>{
				let persistedCard = data.find(card => card.card_name === updateCard.card_name);
				if(!persistedCard){
					reject(new ResourceNotFoundError('No user found with provided id.'));
					return;
				}
				persistedCard = updateCard;
				resolve(true);
			});
		});
	}
	deleteById(name:string): Promise<boolean>{
		return new Promise<boolean>((resolve, rejects)=>{
			if(!validator.isValidId){
				rejects(new BadRequestError('Invalid Card Name was provided'));
			}
			rejects(new NotImplementedError());
		});
	}
}
	


