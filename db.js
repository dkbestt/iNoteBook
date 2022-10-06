const mongoose = require('mongoose')

const connection = () => {
    // mongoose.connect('mongodb://localhost:27017/inotebook', {
    mongoose.connect('mongodb+srv://dkbestt:jAn3htqGXyr0axUA@cluster0.7a5st3u.mongodb.net/inotebook?retryWrites=true&w=majority', {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    }).then(() => {
        console.log('Connection Successfull...');
    }).catch((err) => {
        console.log("Not Connection done......");
    })
}

module.exports = connection

// jAn3htqGXyr0axUA
// inotebook