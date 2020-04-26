import data from '../data/card-db';
import { Cards } from '../models/cards';
import {CrudRepository} from './crud-repo';
import validator from '../util/validator';
import {  
	DataNotFoundError,
	DataNotStoredError,
	AuthenticationError,
	InvalidRequestError
} from '../errors/errors';

// export class CardRepository implements CrudRepository<Cards>{
// 	private static instance: CardRepository;
// 	private constructor(){}
// }


