import { UserInfo } from '../models/user';

let id = 1;

export default[
	new UserInfo(id++, 'Jeremy', 'Elam', 'jeremyelam@gmail.com', 'password', new Date('09/17/1994')),
	new UserInfo(id++, 'Kenan', 'Hilman', 'flameking0127@gmail.com', 'password', new Date('01/27/2000')),
	new UserInfo(id++, 'Jalen', 'Hilman', 'jalenhilman@gmail.com', 'password', new Date('02/14/2005')),
	new UserInfo(id++, 'Ameline', 'Chua', 'amelinechua@gmail.com', 'password', new Date('09/17/1994')),
	new UserInfo(id++, 'Salt', 'Elam', 'saltelam@gmail.com', 'password', new Date('10/15/2018'))
];