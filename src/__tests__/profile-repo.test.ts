import {ProfileRepository} from '../repo/profile-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import {UserProfile} from '../models/profile';

jest.mock('..', ()=>{
	return{
		connectionPool: {
			connect: jest.fn()
		}
	}
});

jest.mock('../util/result-set-mapper', ()=>{
	return {
		mapProfileResultSet: jest.fn()
	}
});

describe('profileRepo', ()=>{
	let sut = new ProfileRepository();
	let mockConnect = mockIndex.connectionPool.connect;
	
	beforeEach(()=>{
		(mockConnect as jest.Mock).mockClear().mockImplementation(()=>{
			return {
				query: jest.fn().mockImplementation(()=>{
					return {
						rows:[
							{
								user_un: 'lazyqt',
								profile_id: 5,
								fav_archetypes: 'esper',
								fav_colors: 'green',
								card_set: 'throne of eldraine',
								card_name: "chandra's spitfire",
								id: 5
							}
						]
					}
				}),
				release:jest.fn()
			}
		});
		(mockMapper.mapProfileResultSet as jest.Mock).mockClear();
	});
	
	test('should resolve to an array of Profiles when getAll retrieves records from data source', async()=>{
	

		//Arrange
		expect.hasAssertions();

		
		let mockProfiles = new UserProfile('un', 1,'bant', 'green', 'set', 'card', 1);
		(mockMapper.mapProfileResultSet as jest.Mock).mockReturnValue(mockProfiles);
		
		//Act
		let result = await sut.getAll();
		
		//Assert
		expect(result).toBeTruthy();
		expect(result instanceof Array).toBe(true);
		expect(result.length).toBe(1);
		expect(mockConnect).toBeCalledTimes(1);
	});
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
	test('should resolve to a User object when getById retrieves a record from data source', async () => {
        // Arrange
        expect.hasAssertions();
        let mockUser = new UserProfile('un', 1,'bant', 'green', 'set', 'card', 1);
        (mockMapper.mapProfileResultSet as jest.Mock).mockReturnValue(mockUser);
        // Act
        let result = await sut.getById(1);
        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof UserProfile).toBe(true);
	});

	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser =  new UserProfile('un', 1,'bant', 'green', 'set', 'card', 1);
        //Act
		let result = await sut.save(mockUser);
		//Assert
		expect(result).toBeTruthy();
	});

	test('should return true when update is successfully executed by the database', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new UserProfile('un', 1,'bant', 'green', 'set', 'card', 1);
        //Act
		let result = await sut.update(mockUser);
		//Assert
		expect(result).toBeTruthy();
	});
	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new UserProfile('un', 1,'bant', 'green', 'set', 'card', 1);
        //Act
		let result = await sut.deleteById(mockUser.id);
		//Assert
		expect(result).toBeTruthy();
	})
	
	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		
		let result = await sut.getProfileByUniqueKey("email", "password");
		//Assert
		expect(result).toBeTruthy();
	})
})
