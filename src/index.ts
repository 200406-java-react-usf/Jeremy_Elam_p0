import { UserRepository } from './repo/user-repo';
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


