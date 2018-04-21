// configure in package.json
// Set to production by default from heroku
const env = process.env.NODE_ENV || 'development';
console.log('env ********** ', env);

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];

    for (key in envConfig) {
        process.env[key] = envConfig[key];
    }
}
// ---> Same as:
// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }