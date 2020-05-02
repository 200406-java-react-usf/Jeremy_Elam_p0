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
		
		let reqURL =url.parse(req.url,true);
		if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
			let payload = await UserService.getUserByUniqueKey({...reqURL.query});
			resp.status(200).json(payload);
		} else{
			let payload = await UserService.getAllUsers();
			resp.status(200).json(payload);
		}
	}catch(e){
		resp.status(e.statusCode).json(e);
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

