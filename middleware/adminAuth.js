const jwt = require("jsonwebtoken")
const secret = "adfsadsadsad"

module.exports = function(req, res, next){
    const authToken = req.headers['authorization'] 
    if(authToken != undefined){
        const bearer =  authToken.split(' ')
        const token = bearer[1]

        try {
            const decoded = jwt.verify(token, secret)
            if (decoded.role == 1){
                console.log(decoded)
                next()
            } else {
                res.send("Você não é um administrador!!!")
            }

        } catch (error) {
            res.status(403)
            res.send("Você não está autenticado.") 
        }

    } else {
        res.status(403)
        res.send("Você não está autenticado.")
    }
}