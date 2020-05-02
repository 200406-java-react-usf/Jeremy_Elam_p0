import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';

import {UserRouter} from './routers/user-router';
import {CardRouter} from './routers/card-router';
import { Pool } from 'pg';

//environment configuration 
dotenv.config();

//database configuration
export const connectionPool: Pool = new Pool({
	host: process.env['DB_HOST'],
	port: +process.env['BD_PORT'],
	database: process.env['DB_NAME'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    max: 5
});

const app = express();

fs.mkdir(`${__dirname}/logs`, () => {});
const logStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

app.use('/', express.json());

app.use('/users', UserRouter);
app.use('/cards', CardRouter);

app.listen(8080, ()=>{
	console.log(`Application running and listening at: http://localhost:8080`);
})