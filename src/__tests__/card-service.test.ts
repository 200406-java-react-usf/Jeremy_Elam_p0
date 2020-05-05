import {CardRepository as sut, CardRepository} from '../repo/card-repo';
import {CardService} from '../services/card-service';
import {Cards} from '../models/cards';
import validator from '../util/validator';
import {
	BadRequestError,  
	ResourceNotFoundError, 
	ResourcePersistenceError,
}from '../errors/errors';

jest.mock('../repo/card-repo',()=>{
	return class CardRepository{
		getAll = jest.fn();
		getById = jest.fn();
		getCardByUniqueKey = jest.fn();
		save = jest.fn();
		update = jest.fn();
		deleteById = jest.fn();
	}
});

describe('cardService', ()=>{
	let sut: CardService;
	let mockRepo;

	let mockCards = [ 
		new Cards (1,'Domri something something', 'IDK', 'Mythic', 20.00),
		new Cards (2,'Elspeth something something', 'IDK', 'Mythic', 8.00),
		new Cards (3,'Teferi something something', 'IDK', 'Mythic', 16.88),
		new Cards (4,'Nissa something something', 'IDK', 'Mythic', 8.46),
		new Cards (5,'Vivien something something', 'IDK', 'Mythic', 3.58),
	];

	beforeEach(()=>{
		mockRepo = jest.fn(()=>{
			return{
				getAll: jest.fn(),
				getById: jest.fn(),
				getCardByUniqueKey: jest.fn(),
				save: jest.fn(),
				update: jest.fn(),
				deleteById: jest.fn()
			}
		});
		sut = new CardService(mockRepo);
	});

	test('should resolve to Card[] when getAllCards successfully retrieves cards from the data source', async() =>{
		//Arrange 
		expect.hasAssertions();
		mockRepo.getAll = jest.fn().mockReturnValue(mockCards);
		//Act
		let result = await sut.getAllCards();
		//Asserst
		expect(result).toBeTruthy();
		expect(result.length).toBe(5);
	});

	test('should reject with ResourcesNotFound Error when getAllUsers fails to get any users from the data sources', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getAll = jest.fn().mockReturnValue([]);
		//Act
		try{
			await sut.getAllCards();
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});
	test('should receive card info based off id when given a valid id',async ()=>{
		//Arrange 
		expect.assertions(3);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.getById = jest.fn().mockImplementation((id:number)=>{
			return new Promise<Cards>((resolve)=> resolve(mockCards[id-1]));
		});
		//Act 
		let result = await sut.getCardById(1)
		//Assert
		expect(result).toBeTruthy();
		expect(result.card_rarity).toBe('Mythic');
		expect(result.card_name).toBe('Domri something something');
	});
	test('should throw bad request error when given an invalid id number (negative)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getCardById(-1)
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should throw bad request error when given an invalid id number (double number)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getCardById(3.14)
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should throw bad request error when given an invalid id number (fasly)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getCardById(0)
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should throw badRequestError when given an invalid id number (NaN)', async()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getCardById(NaN)
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should throw ResourceNotFoundError when given a valid id but not an idea inside the database', async ()=>{
		//Arrange
		expect.assertions(1);
		mockRepo.getById = jest.fn().mockReturnValue(true);
		//Act
		try{
			await sut.getCardById(100);
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBe(true);
		}
	});
	test('should return new card information without when a new card object is given', async()=>{
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		mockRepo.cardNameAvailable = jest.fn().mockReturnValue(true);
		mockRepo.save = jest.fn().mockImplementation((newUser:Cards)=>{
			return new Promise<Cards>((resolve) => {
				mockCards.push(newUser);
				resolve(newUser);
			});
		});
		//Act 
		let result = await sut.addNewCard(new Cards(6,'Human something something', 'IDK', 'Mythic', 20.00))
		//Assert 
		expect(result).toBeTruthy();
		expect(mockCards.length).toBe(6);
	});

	test('should return BadRequestError when given a bad Cards object', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewCard(new Cards(6,'Human something something', '', 'Mythic', 8.00))
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBe(true);
		}
	});

	test('should return ResourcePersistenceError when given a Cards with an card name that is already being used', async()=>{
		//Arrange
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		sut.isCardNameAvailable = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.addNewCard(new Cards(6,'Domri something something', 'IDK', 'Mythic', 8.00))
		}catch(e){
			//Assert
			expect(e instanceof ResourcePersistenceError).toBe(true);
		}
	});
	test('should return true if a card with the given id number was successfully deleted', async ()=>{
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(true);
		mockRepo.deleteById = jest.fn().mockReturnValue(true);

		//Act
		let result = await sut.deleteCardById({"id":1});
		//Assert 
		expect(result).toBe(true);
	});
	test('should return BadRequestError when trying to delete an id but given an invalid id', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(true);
		validator.isValidId = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.deleteCardById({"id": -1});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should return BadRequestError when trying to delete an id but given an invalid object', async ()=>{
		//Arrange
		expect.hasAssertions();
		validator.isPropertyOf = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.deleteCardById({"": 1});
		}catch(e){
			expect(e instanceof BadRequestError).toBe(true);
		}
	});
	test('should return true when an card is successfully update given a valid card object', async ()=>{
		expect.hasAssertions();
		validator.isValidObject = jest.fn().mockReturnValue(true);
		sut.isCardNameAvailable = jest.fn().mockReturnValue(true);
		mockRepo.update = jest.fn().mockReturnValue(true);

		//Act
		let result = await sut.updateCard( new Cards(5, 'Human something something', 'IDK', 'Mythic', 8.00));
		
		//Assert
		expect(result).toBe(true);
	});


})