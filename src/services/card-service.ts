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
import cardDb from '../data/card-db';

export class CardService{
	constructor(private cardRepo: CardRepository){
		this.cardRepo = cardRepo;
	}
	getAllCards(): Promise<Cards[]>{
		return new Promise<Cards[]>(async(resolve, rejected)=>{
			let cards: Cards[] = [];

			let result = await this.cardRepo.getAll();

			for (let card of result){
				cards.push({...card});
			}

			if(cards.length === 0){
				rejected(new ResourceNotFoundError());
				return;
			}
			resolve(cards);
		});
	}
	getCardById(id:string): Promise<Cards>{
		return new Promise<Cards>(async(resolve, rejects)=>{
			if(!isValidStrings(id)){
				return rejects(new BadRequestError());
			}
			let cards = {...await this.cardRepo.getById(id)};
			if(isEmptyObject(cards)){
				return rejects(new ResourceNotFoundError());
			}
			resolve(cards);
		})
	}
}