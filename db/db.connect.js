const mongoose = require('mongoose');

async function initializeDBConnection(){

	try{
        const mySecret = process.env.COMPASS_PASSWORD;
		const uri = `mongodb+srv://db${mySecret}@cluster0.iha7u.mongodb.net/video-library?retryWrites=true&w=majority`;

		await mongoose.connect(uri, { 
			useUnifiedTopology: true ,
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
  	});

		console.log("Connection Completed");
	}catch(err){
		console.error("Failed to connect", err);
	}
	
}

module.exports = { initializeDBConnection }