const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0didzl2eXhpT3Y5T1NlbnRsSlUxSUxGenpMb2paaGtUMFRBUHBDZ2pGQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS2MwUDBLaCtqSDVKTDk2OGNOWTdzVXQwSFY2ZTFXQ0ZDVmRWWVRac0NVVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXQWpCN0I1bXhKUHNKZ0laTnlmSmtEQW9BbHk1TG83ZnBjRVVBZHBuR21FPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjQzBWb21od0lOQk1lYWhuczNUQjhXQnpBajYyS2k2NzZHT3V1ZWRYN3c0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldISHBKU0ZjVkMrUm1Xa09qT0ZpSXFPNDZ2bzFrMSt4SzN3U2hkajloM0E9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZ2ak5uWE43VytKbmE3endOOWFFU2FxaXhTUmhyUU9ubDROcjhVOWtuRjg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTURwVzdMa3lRajZaMUVlSEdNNHVzRGs4R2l5blg2QVYxNGZVNGhJNW9Vbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUG1BbUI0aUswdGYzNjNaVnpLTERDYk80YW1FT1NoMUYyL1M5L1daSFIxdz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlJwaTR4Q2sydk1VS3NFK1dRbjlFdFZqRnAvUm9HcEtaMC8wZmdxOWowNGQzRkUycGQwbzdyMVRnWmlyc2p0UXFBTFpzM1lhWFBWNFZYZ2hidDZ4SmlRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjAyLCJhZHZTZWNyZXRLZXkiOiJ3ZWxrS3JJUlcxK0JubzJ3eEw0SXk0ckkxeThwWlRHekJSNXlQZmo2cDFZPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJidGVISHlGWlMzeWRzRDJpdEpNN2dBIiwicGhvbmVJZCI6ImU4YTdiZmMyLWM4YTQtNGJhMy05NDZiLTM3MmY0NTI1OGNjMyIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJZVEVFUUNtNGM4T2cwemRSSm1WM21nUmZzTUk9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiajhDS0dVUjd1TUo4WFI3WE11YUlRckpvWUtRPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkZRUFE0Rlg3IiwibWUiOnsiaWQiOiIxNDE2ODQ4Mzg1Njo3M0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUGErelBFUEVMekcvYmNHR0JrZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoieGl0Tm56S0M1SGxIK3ZmaDNUZVhRWlUrOTRuSjY2Vm81NEo0MWJhbEFDbz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiT3h0NHRpQkZZN3YzQkdDejEyVGJtazNyUndqMmRwL2g4dHlMNlpkNVZzQVpoVGU3SWtTQU9LVFpkYjlId0x4SWZQT0MxNDZKVTI5aUh3d2dZM2pVaFE9PSIsImRldmljZVNpZ25hdHVyZSI6IlVtS1ppZElvMmsxeW1sbEJ6Y2Evd2duMjN3QWYxaFF5ZTJ6T0MvODdXRVlGdVZQdmNHR05kaG03bVhlVzBlVlhtSWh5Zkp2SENxeVRqMEtaY2t2MGhRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMTQxNjg0ODM4NTY6NzNAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCY1lyVFo4eWd1UjVSL3IzNGQwM2wwR1ZQdmVKeWV1bGFPZUNlTlcycFFBcSJ9fV0sInBsYXRmb3JtIjoiaXBob25lIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzI4MDEzMTI4LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUJ3OCJ9',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "France King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254105915061",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
