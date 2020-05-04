import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import {isEmptyObject} from '../util/validator';
import { ParsedUrlQuery} from 'querystring';
import {adminGuard} from '../middleware/auth-middleware';
import { CardService } from '../services/card-service';
import { CardRouter } from './card-router';

export const ProfileRouter = express.Router();

const ProfileService = AppConfig.profileService;

ProfileRouter.get('', async(req, resp)=>{
	console.log('test');
	try{
		let reqURL = url.parse(req.url, true);
		if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
			let payload = await ProfileService.getProfileByUniqueKey({...reqURL.query});
			resp.status(200).json(payload);
		}else{
			let payload = await ProfileService.getAllProfile();
			resp.status(200).json(payload);}
	}catch(e){
		resp.status(e.statusCode).json(e);
	}
});

ProfileRouter.get('/:id', async(req, resp) =>{
	const id = +req.params.id;
	try{
		let payload = await ProfileService.getProfileById(id);
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
})

ProfileRouter.post('', async(req, resp)=>{
	console.log('POST REQUEST RECEIVED AT /profile');
	console.log(req.body);
	try{
		let payload = await ProfileService.addNewProfile(req.body);
		return resp.status(201).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

ProfileRouter.put('', async(req, resp)=>{
	console.log(req.body);
	try{
		let payload = await ProfileService.updatedProfile(req.body);
		return resp.status(201).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
});

ProfileRouter.delete('', async(req, resp)=>{
	try{
		let payload = await ProfileService.deleteProfileById(req.body);
		return resp.status(202).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}
})

