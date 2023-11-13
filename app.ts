var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


import * as dotenv from 'dotenv';
import handleRouterErr from './middlewares/handleRouterErr';
import notFound from './middlewares/notFound';
import { Request, Response } from 'express';
dotenv.config();

declare global {
    var __basedir: string;
}

global.__basedir = __dirname;

import authRouter from './routes/auth';
import customersRouter from './routes/customers';
import transactionPeersRouter from './routes/transactionPeers';
import transactionsRouter from './routes/transactions';

var app = express();

require('./db/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRouter);
app.use('/api', customersRouter);
app.use('/api', transactionPeersRouter);
app.use('/api', transactionsRouter);

app.get('*', (req: Request, res: Response) => res.sendFile(path.join(__dirname + '/public/index.html')));

app.use(notFound);
app.use(handleRouterErr);

module.exports = app;
