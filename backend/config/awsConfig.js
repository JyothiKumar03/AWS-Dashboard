// awsconfig.js

import AWS from 'aws-sdk';
import 'dotenv/config';

const configureAWS = () => {
    try {
        AWS.config.update({
            accessKeyId: process.env.AccessID,
            secretAccessKey: process.env.AccessKey,
            region: process.env.region,
        });
        console.log('AWS configured successfully!');
    } catch (error) {
        console.log('AWS auth failed connecting - ', error.message);
    }
};

export default configureAWS;
