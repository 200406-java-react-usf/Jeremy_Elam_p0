import { UserInfo } from '../models/user';

let id = 1;

export default[
	new UserInfo(id++, 'Jeremy', 'Elam', 'jeremyelam@gmail.com', 'password', 'Admin'),
	new UserInfo(id++, 'Kenan', 'Hilman', 'flameking0127@gmail.com', 'password', 'User'),
	new UserInfo(id++, 'Jalen', 'Hilman', 'jalenhilman@gmail.com', 'password', 'User'),
	new UserInfo(id++, 'Ameline', 'Chua', 'amelinechua@gmail.com', 'password', 'User'),
	new UserInfo(id++, 'Salt', 'Elam', 'saltelam@gmail.com', 'password', 'Cat')
];