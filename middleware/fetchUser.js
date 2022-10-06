const jwt = require('jsonwebtoken');
const SECRET_KEY = "inotebookproject"


const fetchUser = (req, res, next) => {
    // get user form the jwt token and add id to req object
    const tokenName = req.header('Authorization');
    if (!tokenName) {
        res.status(401).send({ error: "Please authenticate using a valid token." })
    }
    try {
        const data = jwt.verify(tokenName, SECRET_KEY)
        // console.log(data.id, 'from fetch user');
        req.id = data.id
        next()
    } catch (error) {
        res.status(401).send({ error: error })
    }
}



module.exports = fetchUser