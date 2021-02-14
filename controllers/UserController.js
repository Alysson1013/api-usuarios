const User = require("../models/User")
const validator = require("validator")
const PasswordToken = require("../models/PasswordToken")
const jwt = require("jsonwebtoken")
const secret = "adfsadsadsad"
const bcrypt = require("bcrypt")

class UserController {
    async index(req, res){
        try {
            let users = await User.findAll()
            res.json(users)
        } catch (error) {
            console.log(error)
        }
    }

    async findUser(req, res){
        let id = req.params.id
        try {
            let user = await User.findById(id)
            if (user == undefined){
                res.send({err: "Usuário não encontrado"})
                return res.status(404)
            } else {
                res.status(200)
                res.json(user)
            }
        } catch (error) {
            console.log(error)
        }
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

    async edit(req, res){
        var {id, name, email, role} = req.body

        var result = await User.update(id, email, name, role)
        if (result != undefined){
            if (result.status){
                res.status(200)
                res.send("Tudo OK")
            }else{
                res.status(406)
                res.send(result.err)
            }
        } else {
            res.status(406)
            res.send("Ocorreu um erro no servidor!")
        }
    }

    async remove(req, res){
        let id = req.params.id
        let result = await User.delete(id)

        if (result.status){
            res.status(200)
            res.send("Deleção feita com sucesso")
        } else {
            res.status(404)
            res.send(result.err)
        }
    }

    async recoverPassword(req, res){
        let email = req.body.email
        let result = await PasswordToken.create(email)

        if(result.status == true){
            res.send("" + result.token)
            res.status(200)
        } else {
            res.send("" + result.err)
            res.status(406)
        }
    }
    
    async changePassword(req, res){
        let token =  req.body.token
        let password = req.body.password

        let isTokenValid = await PasswordToken.validate(token)

        if (isTokenValid.status){
            User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada.")
        }else{
            res.status(406)
            res.send("Token inválido.")
        }
    }

    async login(req, res){
        var {email, password} = req.body

        let user = await User.findByEmail(email)

        if (user != undefined){
            let result = await bcrypt.compare(password, user.password)
            if(result){
                var token = jwt.sign({ email: user.email, role: user.role }, secret);

                res.status(200)
                res.send({
                    token: token
                })
            } else {
                res.status(406)
                res.send("Senha Incorreta")
            }
        }else{
            res.json({status: false})
        }
    }
}

module.exports = new UserController();