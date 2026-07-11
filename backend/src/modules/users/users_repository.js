const knex = require('../../database/knex');

class UsersRepository{
    async register({
        name,
        email,
        address,
        passwordHash
    }){
        const user = await knex('users').insert({
            name : name,
            email : email,
            address : address,
            password_hash : passwordHash,
            created_at : knex.fn.now(),
            updated_at : knex.fn.now()
        }).returning('*');
        
        return user[0]
    };

    async find({
        id,
        email,
        name
    }){
        const query = await knex('users');

        if(id !== null){
            query.where('id', id);
        }

        if(email !== null){
            query.where('email', email);
        }

        if(name !== null){
            query.where('name', name);
        }

        return query.orderBy('id', 'asc');
    }

    async updateById({
        id,
        userData
    }){
        const user = await knex('users').where('id',id).update({
            ...userData,
            updated_at : knex.fn.now()
        }).returning('*');

        return user[0];
    }

    async deleteById(id){
        await knex('users').where('id',id).delete();

        return true;
    }
}

module.exports = new UsersRepository();