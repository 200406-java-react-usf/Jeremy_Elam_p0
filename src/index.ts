import { UserRepository } from './repo/user-repo';
import {CardRepository} from './repo/card-repo';
import { UserInfo } from './models/user';
import { Cards } from './models/cards'


let invalidMockUser = new UserInfo(99999, 'update','update','update','update', new Date());
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

(async()=>{
	let invalidMockUser = new Cards("Elspeth", "update", "Primordial",400.00);

	try{
		let testing = await CardRepository.getInstance().update(invalidMockUser);
		console.log(testing);
	}catch(e){
		console.log(e);
	}
})()

