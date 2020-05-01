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
		let payload = await CardService.getAllCards();
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(404).json(e);
	}
});

CardRouter.get('/:id', async(req, resp) =>{
	const id = req.params.id;
	try{
		let payload = await CardService.getCardById(id);
		return resp.status(200).json(payload);
	}catch(e){
		return resp.status(404).json(e);
	}
});