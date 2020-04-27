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
import userDb from '../data/user-db';

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
	getById(name: string): Promise<Cards>{
		return new Promise<Cards>((resolve,reject)=>{
			if(!validator.isValidStrings(name)){
				reject(new BadRequestError());
			}
			setTimeout(()=>{
				const card = {...data.find(card => card.card_name === name)};
				if(Object.keys(card).length === 0){
					reject(new ResourceNotFoundError());
					return;
				}
				resolve(card);
			});
		});
	}
	save(newCard: Cards): Promise<Cards>{
		return new Promise<Cards>((resolve, reject) =>{
			if(!validator.isCardValidObject(newCard, 'card_name')){
				reject(new BadRequestError('Invalid property values found in provided card.'));
				return;
			}
			setTimeout(()=>{
				let conflict = data.filter(card => card.card_name == newCard.card_name).pop();
				if(conflict){
					reject(new ResourcePersistenceError('The provided card name is already being used'));
					return;
				}

				data.push(newCard);
				resolve(newCard);
			});
		});
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
	


