import {isValidId,
	isValidStrings,
	isValidObject,
	isEmptyObject,
	isPropertyOf} from '../util/validator';
import {UserInfo} from '../models/user';
import {UserProfile} from '../models/profile';
import {Cards} from '../models/cards';

describe('validator', ()=>{
	test('should return tru when isValid is provided a valid id',()=>{
		//Arrange 
		expect.assertions(3);
		//Act 
		let result1 = isValidId(1);
		let result2 = isValidId(2);
		let result3 = isValidId(3);
		//Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(result3).toBe(true);
	});

	test('should return false when isValid is provided falsy id',()=>{
		//Arrange
		expect.assertions(3);
		//Act 
		let result1 = isValidId(NaN);
		let result2 = isValidId(0);
		let result3 = isValidId(Number(null));
		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return false when isValid is provided a negative number', ()=>{
		//Arrange 
		expect.assertions(3);
		//Act
		let result1 = isValidId(-3);
		let result2 = isValidId(-188);
		let result3 = isValidId(Number(-1));
		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return false when isValid is provided a decimal value', ()=>{
		//Arrange 
		expect.assertions(3);
		//Act
		let result1 = isValidId(3.25);
		let result2 = isValidId(100.234);
		let result3 = isValidId(0.01);
		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return true when a isValidString is provided a valid string', ()=>{
		//Arrange
		expect.assertions(3);
		//Act
		let result1 = isValidStrings('This is a valid string');
		let result2 = isValidStrings('this','is','also','a','valid','string');
		let result3 = isValidStrings(String('more'), String('valid'), String('strings'));
		//Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(result3).toBe(true);
	});

	test('should return false when isValidString is given an invalid string', ()=>{
		//Arrange
		expect.assertions(3);
		//Act 
		let result1 = isValidStrings('');
		let result2 = isValidStrings('this is valid', '', 'the middle is not');
		let result3 = isValidStrings(String(''), String('the first string is not valid'));
		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return true when a valid object is passed through isValidObject with no nullable prop(s)', ()=>{
		//Arrange
		expect.assertions(3);
		//Act
		let result1 = isValidObject(new UserInfo(1,'jeremy', 'elam', 'jeremy2975@yahoo.com', 'password','Admin'));
		let result2 = isValidObject(new Cards(1,'Nissa, WOOT WOOT', 'war of the sparks', 'mythic', 8.00));
		let result3 = isValidObject(new UserProfile('lazyspell', 1, 'bant', 'green', 'war of the sparks', 'nissa', 1));
		//Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(result3).toBe(true);
	});
	test('should return true when isValidObject is provided a valid object with nullable prop(s)', ()=>{
		//Arrange
		expect.assertions(3);
		//Act
		let result1 = isValidObject(new UserInfo(0, 'jeremy', 'elam', 'jeremy2975@yahoo.com', 'password', 'User'), 'id');
		let result2 = isValidObject(new Cards(0,'Nissa, WOOT WOOT', 'war of the sparks', 'Mythic', 8.00), 'id');
		let result3 = isValidObject(new UserProfile('lazyspell', 0, 'bant', 'green', 'war of the sparks', 'nissa', 1),'profile_id');
		//Asset
		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(result3).toBe(true);
	});

	test('should return false when an invalid object is passed to isValidObject validator with no nullable prop(s)', ()=>{
		//Arrange
		expect.assertions(3);
		//Act
		let result1 = isValidObject(new UserInfo(1,'jeremy', 'elam', '', 'password','Admin'));
		let result2 = isValidObject(new Cards(1,'Nissa, WOOT WOOT', 'war of the sparks', '', 8.00));
		let result3 = isValidObject(new UserProfile('lazyspell', 0, 'bant', 'green', 'war of the sparks', 'nissa', 1));
		//Asset
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
		
	});

	test('should return false when isValidObject is provided invalid object with some nullable prop(s)', ()=>{
		//Arrange
		expect(3);
		//Act
		let result1 = isValidObject(new UserInfo(1,'jeremy','elam', '', 'password', 'Admin'), 'id');
		let result2 = isValidObject(new Cards(1,'Nissa, WOOT WOOT', '', '', 8.00), 'id');
		let result3 = isValidObject(new UserProfile('lazyspell', 1, '', 'green', 'war of the sparks', 'nissa', 1), 'id');
		//Asset
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return true when isPropertyOf is Provided a known property of a given constructable type', ()=>{
		// Arrange
		expect.assertions(3);

		// Act
		let result1 = isPropertyOf('id', UserInfo);
		let result2 = isPropertyOf('card_name', Cards);
		let result3 = isPropertyOf('fav_colors', UserProfile);

		// Assert
		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(result3).toBe(true);
	});

	test('should return true when isPropertyOf is Provided an unknown property of a given constructable type', ()=>{
		// Arrange
		expect.assertions(3);

		// Act
		let result1 = isPropertyOf('card_name', UserInfo);
		let result2 = isPropertyOf('user_name', Cards);
		let result3 = isPropertyOf('something_random', UserProfile);

		// Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});

	test('should return true when isPropertyOf is Provided a non-constructable type', ()=>{
		// Arrange
		expect.assertions(4);

		// Act
		let result1 = isPropertyOf('this doesn\'t look good', {x: 'not a valid'});
		let result2 = isPropertyOf(':shrug:', 2);
		let result3 = isPropertyOf('false', false);
		let result4 = isPropertyOf('won\'t work', Symbol('huehuehue'));

		// Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
		expect(result4).toBe(false);

	});
	
	test('should return true when isEmptyObject is provided an empty object', ()=>{
		//Arrange 
		expect.assertions(1);
		//Act
		let result = isEmptyObject({});
		//Assert
		expect(result).toBe(true);
	});

	test('should return false when isEmptyObject is provided an non-empty object', ()=>{
		//Arrange 
		expect.assertions(3);
		//Act
		let result1 = isEmptyObject({key:'value'});
		let result2 = isEmptyObject({not:'empty'});
		let result3 = isEmptyObject({has:'stuff'});


		//Assert
		expect(result1).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});



});