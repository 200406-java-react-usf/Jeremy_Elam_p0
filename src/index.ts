import { UserRepository } from './repo/user-repo';
import {CardRepository} from './repo/card-repo';
import { UserInfo } from './models/user';
import { Cards } from './models/cards'
import AppConfig  from './config/app'


// let invalidMockUser = new UserInfo(99999, 'update','update','update','update', new Date());
// (async () =>{
// 	try{
// 		let testing = await UserRepository.getInstance().update(invalidMockUser);
// 	console.log(testing);
// 	}catch(e){
// 		console.log(e);
		
// 	}
// 	console.log(await UserRepository.getInstance().getAll());
// })();

// (async()=>{
// 	let invalidMockUser = new Cards("Elspeth something something", "IDK", "Primordial",400.00);

// 	try{
// 		let testing = await CardRepository.getInstance().save(invalidMockUser)
// 		console.log(testing);
// 	}catch(e){
// 		console.log(e);
// 	}
// })();

// (async function(){

//     let deckRepo = DeckRepository.getInstance();

//     console.log(await deckRepo.getById(2));

// })();
const userService = AppConfig.userService;

(async ()=>{

	// let validMockUser = new UserInfo(5, 'Pepper','Elam','pepperElam@gmail.com','password', "Admin");
	try{
	console.log(await userService.authenticateUser('jeremyelam@gmail.com','password'))
	} catch(e){
		console.log(e);
	}
})()

