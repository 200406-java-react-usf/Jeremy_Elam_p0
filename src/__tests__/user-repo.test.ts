import {UserRepository} from '../repo/user-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import {UserInfo} from '../models/user';


jest.mock('..',()=>{
	return {
		connectionPool: {
			connect: jest.fn()
		}
	}
});

jest.mock('../util/result-set-mapper', ()=>{
	return {
		mapUserResultSet: jest.fn()
	}
});

describe('userRepo', ()=>{
	let sut = new UserRepository();
	let mockConnect = mockIndex.connectionPool.connect;

	beforeEach(()=>{
		(mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                user_fn: 'kevin',
                                user_ln: 'wagenheim',
                                user_email: 'wagenheimk@gmail.com',
                                user_pw: 'secretpassword',
								name: 'Admin'
							}	
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapUserResultSet as jest.Mock).mockClear();
	});

	test('should resolve to an array of User when getAll retrieves records from data source', async ()=>{
		//Arrange 
		expect.hasAssertions();
		let mockUser = new UserInfo(1,'fn','ln','email','pw','Admin');
		(mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);
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
        let mockUser = new UserInfo(1, 'un', 'pw', 'fn', 'ln', 'email');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);
        // Act
        let result = await sut.getById(1);
        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof UserInfo).toBe(true);
	});
	
	test('should return a newUser when save successfully completes', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new UserInfo(1,'salt','elam', 'saltelam@gmail.com','password','User');
		//Act
		let result = await sut.save(mockUser);
		//Assert
		expect(result).toBeTruthy();
	});
	test('should return true when update is successfully executed by the database', async ()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new UserInfo(1,'salt','elam', 'saltelam@gmail.com','password','User');
		//Act
		let result = await sut.update(mockUser);
		//Assert
		expect(result).toBeTruthy();
	});
	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new UserInfo(1,'salt','elam', 'saltelam@gmail.com','password','User');
		//Act
		let result = await sut.deleteById(mockUser.id);
		//Assert
		expect(result).toBeTruthy();
	})
	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		let mockUser = new UserInfo(1,'salt','elam', 'saltelam@gmail.com','password','User');
		//Act
		let result = await sut.getUserByUniqueKey("user_fn", 'kevin');
		//Assert
		expect(result).toBeTruthy();
	})

	test('should return true when a users is successfully deleted by the user', async()=>{
		//Arrange
		expect.hasAssertions();
		// let mockUser = new UserInfo(1,'salt','elam', 'saltelam@gmail.com','password','User');
		//Act
		let result = await sut.getUserByCredentials("email", "password");
		//Assert
		expect(result).toBeTruthy();
	})
	
});