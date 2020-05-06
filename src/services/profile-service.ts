/* eslint-disable no-unused-vars */
import {UserProfile} from '../models/profile';
import {ProfileRepository} from '../repo/profile-repo';
import {isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import { 
	BadRequestError, 
	ResourceNotFoundError, 
	ResourcePersistenceError, 
} from '../errors/errors';



export class ProfileService{

	constructor(private profileRepo: ProfileRepository){
		this.profileRepo = profileRepo;
	}
	/**
	 * sends request to server to get all profiles if database is empty throws error
	 */
	async getAllProfile(): Promise<UserProfile[]>{
		let profile = await this.profileRepo.getAll();
		if(profile.length === 0){
			throw new ResourceNotFoundError();
		}
		return profile;
	}
	
	/**
	 * * checks to see if id is valid
	 * sends request to server and waits for response
	 * if response is empty throw error 
	 * return profile based on id
	 * @param id 
	 */
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

	/**
	 * * check to see if key names in object is the same as property
	 * checks to see if value is string. if string check to see if valid string, if not valid throw error
	 * waits for server response check to see if response is empty, if empty throw error
	 * @param queryObj 
	 */
	async getProfileByUniqueKey(queryObj: any): Promise<UserProfile>{
		
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
	
	}
	
	/**
	 * check to see if parameter object is valid object, if not valid throw error
	 * check to see if user already has a profile, if user already has profile throw error
	 * if all conditions pass give data to database to update in database
	 * @param newProfile 
	 */
	async addNewProfile(newProfile:UserProfile): Promise<UserProfile>{
	
		if(!isValidObject(newProfile,'id')){
			throw new BadRequestError('Invalid property values found in provided user.');
		}
		let userInfoAvailable = await this.isUserInfoAvailable(newProfile.id);
		if(!userInfoAvailable){
			throw new ResourcePersistenceError('The provided user info is already connected to another profile');
		}
		const persistedProfile = await this.profileRepo.save(newProfile);
		return persistedProfile;
		
	}
	
	/**
	 * checks to see if object passed in parameters is valid, if not throw error
	 * gives data to server to update profile
	 * @param updatedProfile 
	 */
	async updatedProfile(updatedProfile: UserProfile): Promise<boolean>{
		
		if(!isValidObject(updatedProfile)){
			throw new BadRequestError();
		}
		return await this.profileRepo.update(updatedProfile);
	
	}

	/**
	 * * takes in an object 
	 * checks to see if object passed in parameter is valid, if not throw error
	 * checks to see if id is valid id, if not throw error
	 * delete sends request to delete user by database
	 * @param id 
	 */
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


	/**
	 * checks to see if user information is available in database
	 * @param userInfo 
	 */
	async isUserInfoAvailable(userInfo: number): Promise<boolean>{	
		try{
			await this.getProfileByUniqueKey({'id':userInfo});
		}catch(e){
			return true;
		}
		return false;
	}
}