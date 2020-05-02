import {UserSchema} from './schemas';
import {UserInfo} from '../models/user';

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