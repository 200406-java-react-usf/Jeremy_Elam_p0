import {UserRepository} from '../repo/user-repo';
import{UserService} from '../services/user-services';
import{CardRepository} from '../repo/card-repo';
import{CardService} from '../services/card-service';
import{ProfileRepository} from '../repo/profile-repo';
import{ProfileService} from '../services/profile-service';

const profileRepo = new ProfileRepository();
const profileService = new ProfileService(profileRepo);

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const cardRepo = new CardRepository();
const cardService = new CardService(cardRepo);


export default{
	userService,
	cardService,
	profileService
};

