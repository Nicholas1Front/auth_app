const knex = require('../../database/knex');

class AuthRepository{
    async findByEmail(email){
        const user = await knex('users').where('email', email).first();

        return user;
    }

    async findById(id){
        const user = await knex('users').where('id', id).first();

        return user;
    }
}

module.exports = new AuthRepository();