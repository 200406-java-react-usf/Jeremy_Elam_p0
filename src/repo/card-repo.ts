import data from '../data/card-db';
import { Cards } from '../models/cards';
import {CrudRepository} from './crud-repo';
import validator from '../util/validator';
import {  
	BadRequestError, 
	AuthenticationError, 
	ResourceNotFoundError, 
	ResourcePersistenceError,
	NotImplementedError 
} from '../errors/errors';
import { UserRepository } from './user-repo';

export class CardRepository implements CrudRepository<Cards>{
	private static instance: CardRepository;
	private constructor(){}
	static getInstance(){
		return !CardRepository.instance ? CardRepository.instance = new CardRepository() : CardRepository.instance;
	}
	getAll(): Promise<Cards[]>{
		return new Promise<Cards[]>((resolve,reject)=>{
			setTimeout(()=> {
				let cards = [];
				for(let card of data){
					cards.push({...card});
				}
				if(cards.length == 0){
					reject(new ResourceNotFoundError());
					return;
				}
				resolve(cards);
			});
		});
	}
	getById(): Promise<Cards>{
		return new Promise<Cards>((resolve,reject)=>{
			reject(new ResourceNotFoundError());
		});
	}
	save(newCard: Cards): Promise<Cards>{
		return new Promise<Cards>((resolve, reject) =>{
			reject(new ResourceNotFoundError());
		});
	}
	update(updateCard: Cards): Promise<boolean>{
		return new Promise<boolean>((resolve, reject)=>{
			reject(new ResourceNotFoundError());
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
	


