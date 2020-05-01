import {UserRepository} from '../repo/user-repo';
import{UserService} from '../services/user-services';
import{CardRepository} from '../repo/card-repo';
import{CardService} from '../services/card-service';

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const cardRepo = new CardRepository();
const cardService = new CardService(cardRepo);


export default{
	userService,
	cardService
};

