const mongoose = require('mongoose');
require('dotenv').config()
require('./models/Registration');
require('./models/User');
require('./models/Post');
const app = require('./app');

mongoose.connect(process.env.DATABASE, {
	useCreateIndex: true,
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
	console.log(`Mongoose connection open on ${process.env.DATABASE}`);
}).on('error', (err) => {
	console.log(`Connection error: ${err.message}`);
})

const server = app.listen(80, () => {
	console.log(`Express is running on port ${server.address().port}`);
})
