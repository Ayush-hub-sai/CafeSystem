require('dotenv').config()
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    console.log(token +"bishnu");
    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, result) => {
        console.log(error);
        console.log(result);
        if (error)
            return res.sendStatus(403)

        res.locals = result
        next()
    })

}
module.exports = {
    authenticateToken: authenticateToken
}