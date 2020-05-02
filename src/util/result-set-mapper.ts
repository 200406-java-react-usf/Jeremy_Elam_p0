import {UserSchema} from './schemas';
import {UserInfo} from '../models/user';

export function mapUserResultSet(resultSet: UserSchema): UserInfo{
	if(!resultSet){
		return {} as UserInfo;
	}
	return new UserInfo(
		resultSet.id,
		resultSet.first_name,
		resultSet.last_name,
		resultSet.email,
		resultSet.user_pw,
		resultSet.name
	);
}