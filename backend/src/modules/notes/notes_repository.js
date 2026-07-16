const knex = require('../../database/knex');

class NotesRepository{
    async create({
        user_id,
        title,
        content,
        date_reference,
    }){
        const note = await knex('notes')
            .insert({
                user_id,
                title,
                content,
                date_reference,
                deleted_at : null,
                created_at : knex.fn.now()
            }).returning('*')

        return note
    }

    async update({
        id,
        data
    }){
        const note = await knex('notes').where('id',id).update({
            ...data,
            updated_at : knex.fn.now()
        }).returning("*");

        return note
    }

    async find({
        includedDeleted,
        id,
        user_id,
        title,
        date_reference_start,
        date_reference_end,
    }){
        const query = knex('notes');

        if(includedDeleted === false){
            query.whereNull('deleted_at');
        }

        if(includedDeleted === true){
            query.whereNotNull('deleted_at')
        }

        if(id !== null){
            query.where('id',id)
        }

        if(user_id !== null){
            query.where('user_id',user_id)
        }

        if(title !== null){
            query.where('title', title)
        }

        if(date_reference_start !== null && date_reference_end === null){
            query.where('date_reference', '>=', date_reference_start)
        }

        if(date_reference_start === null && date_reference_end !== null){
            query.where('date_reference', '<=', date_reference_end)
        }

        if(date_reference_start !== null && date_reference_end !== null){
            query.whereBetween('date_reference', [date_reference_start, date_reference_end])
        }

        return query.orderBy('date_reference', 'asc');
    }

    async deactivate(id){
        const note = await knex('notes')
            .where('id',id)
            .update({
                deleted_at : knex.fn.now(),
                updated_at : knex.fn.now()
            }).returning('*');

        return note
    }

    async activate(id){
        const note = await knex('notes')
            .where('id',id)
            .update({
                deleted_at : null,
                updated_at : knex.fn.now()
            })
        
        return note
    }
}

module.exports = new NotesRepository();