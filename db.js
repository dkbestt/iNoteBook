const mongoose = require('mongoose')

const connection = () => {
    mongoose.connect('mongodb://localhost:27017/inotebook', {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connection Successfull...');
    }).catch((err) => {
        console.log("Not Connection done......");
    })
}

module.exports = connection