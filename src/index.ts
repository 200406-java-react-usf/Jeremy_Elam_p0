import { UserRepository } from './repo/user-repo';
import {CardRepository} from './repo/card-repo';
import { UserInfo } from './models/user';


let invalidMockUser = new UserInfo(99999, 'update','update','update','update', new Date());
(async () =>{
	try{
		let testing = await UserRepository.getInstance().update(invalidMockUser);
	console.log(testing);
	}catch(e){
		console.log(e);
		
	}
	
	
	console.log(await UserRepository.getInstance().getAll());
	
})();

(async()=>{
	try{
		let testing = await CardRepository.getInstance().getById('Domri something something')
		console.log(testing);
	}catch(e){
		console.log(e);
	}
})();

