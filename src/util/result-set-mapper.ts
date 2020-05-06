/* eslint-disable no-unused-vars */
import {UserSchema} from './schemas';
import {CardSchema} from './schemas';
import {UserInfo} from '../models/user';
import {Cards} from '../models/cards';
import {ProfileSchema} from './schemas';
import { UserProfile } from '../models/profile';
/**
	 * when data is received by the database it is then map to these values.
	 * Mapped to id, user_fn, user_ln, user_email, user_pw, name
 * @param resultSet 
 */
export function mapUserResultSet(resultSet: UserSchema): UserInfo{
	if(!resultSet){
		return {} as UserInfo;
	}
	return new UserInfo(
		resultSet.id,
		resultSet.user_fn,
		resultSet.user_ln,
		resultSet.user_email,
		resultSet.user_pw,
		resultSet.name
	);
}
/**
 *  when data is received by the database it is then map to these values
 * 	mapped to id, card_name, card_set, car_rarity, card_price
 * @param resultSet 
 */
export function mapCardResultSet(resultSet: CardSchema): Cards{
	if(!resultSet){
		return{} as Cards;
	}
	return new Cards(
		resultSet.id,
		resultSet.card_name,
		resultSet.card_set,
		resultSet.card_rarity,
		resultSet.card_price
	);
}

/**
 *  when data is received by the database it is then map to these values
 * values mapped to: user_un, profile_id, fav_archetypes, fav_color, card_set, card_name, id
 * @param resultSet 
 */
export function mapProfileResultSet(resultSet: ProfileSchema): UserProfile{
	if(!resultSet){
		return {} as UserProfile;
	}
	return new UserProfile(
		resultSet.user_un,
		resultSet.profile_id,
		resultSet.fav_archetypes,
		resultSet.fav_color,
		resultSet.card_set,
		resultSet.card_name,
		resultSet.id
	);
}