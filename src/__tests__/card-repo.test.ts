import { CardRepository as sut } from '../repo/card-repo';
import { Cards } from '../models/cards';
import validator from '../util/validator';
import {  
	BadRequestError, 
	AuthenticationError, 
	ResourceNotFoundError, 
	ResourcePersistenceError,
	NotImplementedError
} from '../errors/errors';

describe('cardRepo', ()=>{
	beforeEach(() =>{
		validator.isValidId = jest.fn().mockImplementation(()=>{
			throw new Error('Failed to mock external method: isValidId!');
		});
		validator.isCardValidObject = jest.fn().mockImplementation(() =>{
			throw new Error('Failed to mock external method: isCardValidObject!');
		});
		validator.isValidStrings = jest.fn().mockImplementation(()=>{
			throw new Error('Failed to mock external method: isValidStrings!');
		});
	});

	test('should be a singleton',()=>{
		//Arrange
		expect.assertions(1);
		// Act
		let reference1 = sut.getInstance();
		let reference2 = sut.getInstance();
		// Assert
		expect(reference1).toEqual(reference2);
	});

	test('should give all the cards when function is invoked.',async ()=>{
		//Arrange 
		expect.assertions(2);
		//Act 
		let result = await sut.getInstance().getAll();
		//Assert
		expect(result).toBeTruthy();
		expect(result[0].card_name).toBe('Domri something something');
	});
	
	test('should give card information when valid card name is given', async ()=>{
		//Arrange
		expect.assertions(3);
		validator.isValidStrings = jest.fn().mockReturnValue(true);
		//Act
		let result = await sut.getInstance().getById('Domri something something');
		//Assert
		expect(result).toBeTruthy();
		expect(result.card_name).toBe('Domri something something');
		expect(result.card_rarity).toBe('Mythic');
	});

	test('will invoke BadRequestError when an invalid card name is given', async() =>{
		//Arrange
		expect.assertions(1);
		validator.isValidStrings = jest.fn().mockReturnValue(false);
		//Act
		try{
			await sut.getInstance().getById('6');
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will invoke ResourceNotFoundError when given a name but not in database', async() =>{
		//Arrange
		expect.assertions(1);
		validator.isValidStrings = jest.fn().mockReturnValue(true);
		//Act
		try{
			await sut.getInstance().getById('Blue Eye\'s White Dragon');
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBeTruthy();
		}
	});

	test('will insert new card into database when given valid card object', async()=>{
		//Arrange
		expect.assertions(3);
		validator.isCardValidObject = jest.fn().mockReturnValue(true);
		//Act
		let validMockUser = new Cards('Pepper the Great', 'IDK', 'Primordial',400.00);
		let result = await sut.getInstance().save(validMockUser);
		//Assert
		expect(result).toBeTruthy();
		expect(result.card_name).toBe('Pepper the Great');
		expect(result.card_rarity).toBe('Primordial');
	});

	test('will invoke BadRequestError when object contains invalid card name', async()=>{
		//Arrange
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(false);
		let invalidMockUser = new Cards('', 'IDK', 'Primordial',400.00);

		//Act
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will invoke BadRequestError when object contains invalid set name', async()=>{
		//Arrange
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(false);
		let invalidMockUser = new Cards('Pepper the Great', '', 'Primordial',400.00);

		//Act
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will invoke BadRequestError when object contains invalid rarity', async()=>{
		//Arrange
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(false);
		let invalidMockUser = new Cards('Pepper the Great', 'IDK', '',400.85);

		//Act
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('will invoke BadRequestError when object contains invalid price', async()=>{
		//Arrange
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(false);
		let invalidMockUser = new Cards('Pepper the Great', 'IDK', '',NaN);

		//Act
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('Will throw BadRequestError when Card object returns a negative price', async ()=>{
		//Arrange 
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(false);
	
		//Act
		let invalidMockUser = new Cards('Pepper the Great', 'IDK', 'Primordial',-400.00);
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
	test('Will throw ResourcePersistenceError when Card contains a card name already in use', async ()=>{
		//Arrange 
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(true);
		//Act
		let invalidMockUser = new Cards('Elspeth something something', 'IDK', 'Primordial',400.00);
		try{
			await sut.getInstance().save(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof ResourcePersistenceError).toBeTruthy();
		}
	});

	test('will return true when successful update of card by card_name', async ()=>{
		//Arrange
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(true);
		//Act
		let validMockUser = new Cards ('Teferi something something', 'update', 'update', 88.44);
		let result = sut.getInstance().update(validMockUser);
		//Assert
		expect(result).toBeTruthy();
	});

	test('will invoke BadRequestError when user provides card object with missing info', async() =>{
		//Arrange
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(false);
		let invalidMockUser = new Cards("Elspeth something something", "", "Primordial",400.00);
		//Act
		try{
			await sut.getInstance().update(invalidMockUser);
		}catch(e){
			expect(e instanceof BadRequestError).toBeTruthy()
		}
	});
	test('will invoke ResourceNotFoundError when user provides card object with invalid card name', async ()=>{
		//Arrange
		expect.assertions(1);
		validator.isCardValidObject = jest.fn().mockReturnValue(true);
		let invalidMockUser = new Cards("Elspeth", "update", "Primordial",400.00);
		try{
			await sut.getInstance().update(invalidMockUser);
		}catch(e){
			//Assert
			expect(e instanceof ResourceNotFoundError).toBeTruthy();
		}
	})
});