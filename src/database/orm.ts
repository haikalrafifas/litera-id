/**
 * Initiate Object Relational Mapping
 */
import { Model } from 'objection';
import queryBuilder from './query-builder';

Model.knex(queryBuilder);

export default Model;
