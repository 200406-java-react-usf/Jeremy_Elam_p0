import {CardRepository} from '../repo/card-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import {Cards} from '../models/cards';
import { UserProfile } from '../models/profile';

jest.mock('..',()=>{
	return {
		connectionPool:{
			connect: jest.fn()
		}
	}
});

jest.mock('../util/result-set-mapper', ()=>{
	return {
		mapCardResultSet: jest.fn()
	}
});

describe('cardRepo',()=>{
	let sut = new CardRepository();
	let mockConnect = mockIndex.connectionPool.connect;

	beforeEach(()=>{
		(mockConnect as jest.Mock).mockClear().mockImplementation(()=>{
			return{
				query: jest.fn().mockImplementation(()=>{
					return{
						rows:[
							{
								id: 1,
								card_name: 'nissa, who shakes the world',
								card_set: 'war of the spark',
								card_rarity: 'Mythic',
								card_price: 8.96
							}
						]
					}
				}),
				release: jest.fn()
			}
		});
		(mockMapper.mapCardResultSet as jest.Mock).mockClear();
	});

	test('should resolve to an array of Card when getAll retrieves records from the data source', async()=>{
		//Arrange
		expect.hasAssertions();
		let mockCard = new Cards(2,'test','test','test',8.00);
		(mockMapper.mapCardResultSet as jest.Mock).mockReturnValue(mockCard);
		//Act
		let result = await sut.getAll();
		//Assert
		expect(result).toBeTruthy();
		expect(result instanceof Array).toBe(true);
		expect(result.length).toBe(1);
		expect(mockConnect).toBeCalledTimes(1);
	})
	test('should resolve to an empty array when getAll retrieves no records from data source', async () =>{
		// Arrange
		expect.hasAssertions();
		(mockConnect as jest.Mock).mockImplementation(() => {
			return {
				query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
				release: jest.fn()
			}
		});
		// Act
		let result = await sut.getAll();
		// Assert
		expect(result).toBeTruthy();
		expect(result instanceof Array).toBe(true);
		expect(result.length).toBe(0);
		expect(mockConnect).toBeCalledTimes(1);
	});
	test('should resolve to a Card object when getById retrieves a record from data source', async () => {
        // Arrange
        expect.hasAssertions();
        let mockUser =  new Cards(2,'test','test','test',8.00);
        (mockMapper.mapCardResultSet as jest.Mock).mockReturnValue(mockUser);
        // Act
        let result = await sut.getById(1);
        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Cards).toBe(true);
	});
	test('should return a newCard when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new Cards(2,'test','test','test',8.00);
		//Act
		let result = await sut.save(mockUser);
		//Assert
		expect(result).toBeTruthy();
	});

	test('should return true when update is successfully executed by the database', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new Cards(2,'test','test','test',8.00);
		//Act
		let result = await sut.update(mockUser);
		//Assert
		expect(result).toBeTruthy();
	});

	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new Cards(2,'test','test','test',8.00);
		//Act
		let result = await sut.deleteById(mockUser.id);
		//Assert
		expect(result).toBeTruthy();
	});
	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		//Act
		let result = await sut.getCardByUniqueKey("user_fn", 'kevin');
		//Assert
		expect(result).toBeTruthy();
	});

})