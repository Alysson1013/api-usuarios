const knex = require("../database/connection")
const bcrypt = require("bcrypt")

class User {
    async new(name, email, password){
        try {
            let hash = await bcrypt.hash(password, 10)
            await knex.insert({
                name, email, password: hash, role: 0
            }).table("users")
        } catch (error) {
            console.log(error)
        }
        
    }

    async findEmail(email){
        try {
            let result = await knex.select("*").from("users").where({email: email})
            console.log(result)

            if(result > 0) return true
            else return false
        } catch (error) {
            console.log(error)
            return false
        }
      
    }
}

module.exports = new User()