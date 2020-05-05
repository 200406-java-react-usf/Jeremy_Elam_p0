import {UserProfile} from '../models/profile';
import {ProfileRepository} from '../repo/profile-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import { 
	BadRequestError, 
	ResourceNotFoundError, 
	ResourcePersistenceError, 
} from '../errors/errors';
import { Cards } from '../models/cards';
import cardDb from '../data/card-db';


export class ProfileService{

	constructor(private profileRepo: ProfileRepository){
		this.profileRepo = profileRepo;
	}
	async getAllProfile(): Promise<UserProfile[]>{
		let profile = await this.profileRepo.getAll();
		if(profile.length === 0){
			throw new ResourceNotFoundError();
		}
		return profile;
	}

	async getProfileById(id: number): Promise<UserProfile>{
		if(!isValidId(id)){
			throw new BadRequestError();
		}
		let profiles = {...await this.profileRepo.getById(id)};
		if(isEmptyObject(profiles)){
			throw new ResourceNotFoundError();
		}
		return profiles;
	}

	async getProfileByUniqueKey(queryObj: any): Promise<UserProfile>{
		try{
			let queryKeys = Object.keys(queryObj);
			if(!queryKeys.every(key => isPropertyOf(key, UserProfile))){
				throw new BadRequestError();
			}
			let key = queryKeys[0];
			let val = queryObj[key];
			if(key === 'id'){
				return await this.getProfileById(+val);
			}
			if(!isValidStrings(val)){
				throw new BadRequestError();
			}
			let profile = await this.profileRepo.getProfileByUniqueKey(key,val);
			if(isEmptyObject(profile)){
				throw new ResourceNotFoundError();
			}
			return profile;
		}catch(e){
			throw e;
		}
	}
	async addNewProfile(newProfile:UserProfile): Promise<UserProfile>{
		try{
			if(!isValidObject(newProfile,'id')){
				throw new BadRequestError('Invalid property values found in provided user.');
			}
			let userInfoAvailable = await this.isUserInfoAvailable(newProfile.id);
			if(!userInfoAvailable){
				throw new ResourcePersistenceError('The provided user info is already connected to another profile');
			}
			const persistedProfile = await this.profileRepo.save(newProfile);
			return persistedProfile;
		}catch(e){
			throw e;
		}
	}
	async updatedProfile(updatedProfile: UserProfile): Promise<boolean>{
		try{
			if(!isValidObject(updatedProfile)){
				throw new BadRequestError();
			}
			return await this.profileRepo.update(updatedProfile);
		}catch(e){
			throw e;
		}
	}

	async deleteProfileById(id: object): Promise<boolean>{
		
		let keys = Object.keys(id);
		
		if(!keys.every(key => isPropertyOf(key,UserProfile))){
			throw new BadRequestError();
		}
		let key = keys[0];
		let value = +id[key];

		if(!isValidId(value)){
			throw new BadRequestError();
		}
		await this.profileRepo.deleteById(value);
		return true;
	}



	async isUserInfoAvailable(userInfo: number): Promise<boolean>{	
		try{
			await this.getProfileByUniqueKey({'id':userInfo});
		}catch(e){
			return true;
		}
		return false;
	}
}