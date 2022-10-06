const conn = require('./db');
conn();

const express = require('express')
const app = express()
const PORT = 3001

//app configuration 
app.use(express.json());

app.get('/', (req, res) => {
    res.send('welcome')
})

app.use('/api/auth', require('./Routes/auth'))
app.use('/api/note', require('./Routes/note'))

app.listen(PORT, () => {
    console.log(`server connect at http://localhost:${PORT}`);
})