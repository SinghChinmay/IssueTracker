/* eslint-disable import/prefer-default-export */
export const AutoRouteFolderName = 'auto';
export const DefaultAPIRoute = '/api/v1';
export const serverAddress = () => `${process.env.EXPRESS_URL || '0.0.0.0'}:${process.env.EXPRESS_PORT || 3000}`;
