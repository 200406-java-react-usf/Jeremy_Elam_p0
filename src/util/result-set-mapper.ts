import {UserSchema} from './schemas';
import {CardSchema} from './schemas';
import {UserInfo} from '../models/user';
import {Cards} from '../models/cards';
import {ProfileSchema} from './schemas';
import { UserProfile } from '../models/profile';

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

export function mapProfileResultSet(resultSet: ProfileSchema): UserProfile{
	if(!resultSet){
		return {} as UserProfile;
	}
	return new UserProfile(
		resultSet.user_un,
		resultSet.id,
		resultSet.fav_archetypes,
		resultSet.fav_colors,
		resultSet.fav_card,
		resultSet.user_info
	)

	
}