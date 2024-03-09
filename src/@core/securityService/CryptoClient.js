import crypto from 'crypto';
import logger from '../services/LoggingService';

const algorithm = 'aes-128-ccm';
const iv = Buffer.from(process.env.ENCRYPT_IV, 'hex');
const key = Buffer.from(process.env.ENCRYPT_KEY, 'hex');

export function hash(plainText) {
    try {
        return crypto.createHash('md5').update(plainText).digest('hex');
    } catch (error) {
        logger.consoleErrorLog('core SECURITY', 'Error in hash', error);
        return null;
    }
}


export function encrypt(plainText) {
    try {
        const crypt = crypto.createCipheriv(algorithm, key, iv).update(plainText);
        return Buffer.concat([crypt]).toString('hex');
    } catch (error) {
        logger.consoleErrorLog('core SECURITY', 'Error in hash', error);
        return null;
    }
}

export function decrypt(cipherText) {
    try {
        const encryptedText = Buffer.from(cipherText, 'hex');
        const decrypt = crypto.createDecipheriv(algorithm, key, iv).update(encryptedText);
        return Buffer.concat([decrypt]).toString();
    } catch (error) {
        logger.consoleErrorLog('core SECURITY', 'Error in hash', error);
        return null;
    }
}

