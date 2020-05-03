import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import {isEmptyObject} from '../util/validator';
import {ParsedUrlQuery} from 'querystring';
import {adminGuard} from '../middleware/auth-middleware';

export const CardRouter = express.Router();

const CardService = AppConfig.cardService;

CardRouter.get('', async(req,resp)=>{
	try{
		let reqURL = url.parse(req.url,true);
		if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)){
			let payload = await CardService.getCardByUniqueKey({...reqURL.query});
			resp.status(200).json(payload);
		}else{
			let payload = await CardService.getAllCards();	
			resp.status(200).json(payload);
		}
	}catch(e){
		return resp.status(404).json(e);
	}
});

CardRouter.get('/:id', async(req, resp) =>{
	const id = +req.params.id;
	try{
		let payload = await CardService.getCardById(id);
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(404).json(e);
	}
});

CardRouter.post('', async(req, resp) =>{
	console.log('POST REQUEST RECEIVED AT /cards');
	console.log(req.body);
	try{
		let payload = await CardService.addNewCard(req.body);
		return resp.status(201).json(payload);
	}catch(e){
		return resp.status(e.statusCode).json(e);
	}	
});