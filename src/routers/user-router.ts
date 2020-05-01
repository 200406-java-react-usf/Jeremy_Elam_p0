import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import {isEmptyObject} from '../util/validator';
import { ParsedUrlQuery} from 'querystring';
import {adminGuard} from '../middleware/auth-middleware';

export const UserRouter = express.Router();

const UserService = AppConfig.userService;

UserRouter.get('', async (req, resp)=>{
	try{
		//read 
		// let reqURL =url.parse(req.url,true);
		let payload = await UserService.getAllUsers();
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(404).json(e);
	}
});

UserRouter.get('/:id', async(req, resp) =>{
	const id = +req.params.id;
	try{
		let payload = await UserService.getUserById(id);
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(404).json(e);
	}
});

