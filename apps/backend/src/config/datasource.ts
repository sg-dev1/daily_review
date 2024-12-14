import 'reflect-metadata';
import { DataSource } from 'typeorm';
import ormConfig = require('./ormconfig');

export const AppDataSource = new DataSource(ormConfig);
