const User = require("../models/User")
const validator = require("validator")


class UserController {
    async index(req, res){

    }

    async create(req, res){
        var {email, name, password} = req.body

        if(email == undefined || !validator.isEmail(email)){
            res.status(400);
            return res.json({err: "O email é inválido!!!"})
        } 
        if(password == undefined){
            res.status(400);
            return res.json({err: "Senha inválida!!!"})    
        }


        let emailexists = await User.findEmail(email)

        if(emailexists){
            res.status(406)
            return res.json({err: "Email já cadastrado."})
        }

        await User.new(name, email, password)

        res.send("Tudo OK!")
        res.status(200)
    }
}

module.exports = new UserController();