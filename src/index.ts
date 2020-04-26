import { UserRepository } from './repo/user-repo';
import { UserInfo } from './models/user';

let invalidMockUser = new UserInfo(99999, 'update','update','update','update', new Date());
(async () =>{
	let testing = await UserRepository.getInstance().update(invalidMockUser);
	console.log(testing);
	
	console.log(await UserRepository.getInstance().getAll());
	
})();


