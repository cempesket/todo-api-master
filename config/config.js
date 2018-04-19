const env = process.env.NODE_ENV || 'development';

const MONGODB_BASE = 'mongodb://ec2-18-219-48-136.us-east-2.compute.amazonaws.com/';

const MONGODB_URI_DEV = MONGODB_BASE + 'TodoApp';
const MONGODB_URI_TEST = MONGODB_BASE + 'TodoTestApp';

console.log(`Working on ${env} environment`);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = MONGODB_URI_DEV
} else if (env === 'test') {
    process.env.PORT = 5000;
    process.env.MONGODB_URI = MONGODB_URI_TEST
}

