/*eslint no-useless-catch: "error"*/
/* eslint-disable no-unused-vars */
import {Cards} from '../models/cards';
import {CardRepository} from '../repo/card-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import { 
	BadRequestError, 
	ResourceNotFoundError, 
	ResourcePersistenceError, 
} from '../errors/errors';


export class CardService{
	constructor(private cardRepo: CardRepository){
		this.cardRepo = cardRepo;
	}
	/**
	 *  *  * once information is received by the database it will print out all the cards and their information.
	 * return ResourceNotFoundError if the database is empty 
	 */
	async getAllCards(): Promise<Cards[]>{
		let cards = await this.cardRepo.getAll();
		if(cards.length === 0){
			throw new ResourceNotFoundError();
		}
		return cards;
	}
	/**
	 * * check to see if the id passed in is valid if not valid, returns ResourceNotFoundError()
	 * @param id 
	 */
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
	/**
	 *  * Checks to see if object passed through is valid
	 * checks to see if the key passed into the function is a property of the object
	 * checks to see if key is an id. If true runs getCardById function 
	 * checks to see if value is a valid string
	 * checks to makes sure some value was return from the database if nothing was return ResourceNotFoundError is thrown
	 * @param queryObj 
	 */
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
	/**
	 *  * checks to see if object passed through is a valid object
	 * check to see if card name is available to be used inside the database if not throws error
	 * @param newCard 
	 */
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
	/**
	 *  * check to see if object is valid if not throw error
	 * check to see if card name is available, if not throw error
	 * sends object to repo to be updated in database
	 * @param updateCard 
	 */
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
	/**
	 *  * check to see if id is valid if not throw error
	 * sends id to repo to be deleted in database
	 * @param id 
	 */
	async deleteCardById(id: object): Promise<boolean>{
		
		let keys = Object.keys(id);
		
		
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
	/**
	 *  * users getCardByUniqueKey to check to see if card name is available if so return true, is not return false
	 * @param cardName 
	 */
	async isCardNameAvailable(cardName: string): Promise<boolean>{
		try{
			await this.getCardByUniqueKey({'card_name':cardName});
		}catch(e){
			return true;
		}
		return false;
	}
}
