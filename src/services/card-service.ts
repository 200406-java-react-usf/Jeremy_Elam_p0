import {Cards} from '../models/cards';
import {CardRepository} from '../repo/card-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import { 
	BadRequestError, 
	ResourceNotFoundError, 
	NotImplementedError, 
	ResourcePersistenceError, 
	AuthenticationError 
} from '../errors/errors';


export class CardService{
	constructor(private cardRepo: CardRepository){
		this.cardRepo = cardRepo;
	}
	async getAllCards(): Promise<Cards[]>{
		let cards = await this.cardRepo.getAll();
		if(cards.length === 0){
			throw new ResourceNotFoundError();
		}
		return cards;
	}
	async getCardById(id:number): Promise<Cards>{
		if(!isValidId(id)){
			throw new BadRequestError();
		}
		let cards = {...await this.cardRepo.getById(id)};
		if(isEmptyObject(cards)){
			throw new ResourceNotFoundError();
		}
		return cards;
	}
	async getCardByUniqueKey(queryObj: any): Promise<Cards>{
		try{
			let queryKeys = Object.keys(queryObj);
			
			if(!queryKeys.every(key => isPropertyOf(key, Cards))){
				throw new BadRequestError();
			}
			
			let key = queryKeys[0];
			let val = queryObj[key];
			if(key === 'id'){
				return await this.getCardById(+val);
			}
			
			if(!isValidStrings(val)){
				throw new BadRequestError();
			}
			let card = await this.cardRepo.getCardByUniqueKey(key, val);
			if(isEmptyObject(card)){
				throw new ResourceNotFoundError();
			}
			return card;
		}catch (e){
			throw e;
		}
	}
	async addNewCard(newCard: Cards): Promise<Cards>{
		try{
			if(!isValidObject(newCard, 'id')){
				throw new BadRequestError('Invalid property values found in provided user.');
			}
			let cardNameAvailable = await this.isCardNameAvailable(newCard.card_name);
			
			if(!cardNameAvailable){
				throw new ResourcePersistenceError('The provided card name is already in use.');
			}
			
			const persistedCard = await this.cardRepo.save(newCard);
			

			return persistedCard;
		}catch(e){
			throw e;
		}
	}

	async updateCard(updateCard: Cards): Promise<boolean>{
		try{
			if(!isValidObject(updateCard)){
				throw new BadRequestError();
			}
			let cardNameAvailable = await this.isCardNameAvailable(updateCard.card_name);
			if(!cardNameAvailable){
				throw new ResourcePersistenceError();
			}
			return await this.cardRepo.update(updateCard);
		}catch(e){
			throw e;
		}
	}
	async deleteCardById(id: object): Promise<boolean>{
		
		let keys = Object.keys(id);
		console.log(keys);
		
		if(!keys.every(key => isPropertyOf(key,Cards))){
			throw new BadRequestError();
		}
		let key = keys[0];
		let value = +id[key];
		if(!isValidId(value)){
			throw new BadRequestError();
		}
		await this.cardRepo.deleteById(value);
		return true;
	}
	
	async isCardNameAvailable(cardName: string): Promise<boolean>{
		try{
			await this.getCardByUniqueKey({'card_name':cardName});
		}catch(e){
			console.log('card name is available');
			return true;
		}
		console.log('card name not available ');
		return false;
	}
}
