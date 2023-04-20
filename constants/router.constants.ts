/* eslint-disable import/prefer-default-export */
export const AutoRouteFolderName = 'auto';
export const MongoAPIRoute = '/api/v1/mongo';
export const PostgresAPIRoute = '/api/v1/postgres';
export const serverAddress = () => `${process.env.EXPRESS_URL || '0.0.0.0'}:${process.env.EXPRESS_PORT || 3000}`;
