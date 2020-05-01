import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';

import {UserRouter} from './routers/user-router';
import {CardRouter} from './routers/card-router';


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