const notesRepository = require('./notes_repository');
const usersService = require('../users/users_service');
const usersRepository = require('../users/users_repository');

class NotesService{
    async create({
        user_id,
        title,
        content,
        date_reference
    }){

        if(title === null){
            title = `Note - user_id :${foundUser.id}`
        }

        if(date_reference === null){
            let actualDate = new Date();
            date_reference = actualDate.toISOString().split('T')
        }

        if(date_reference !== null){
            date_reference = new Date(date_reference).toISOString().split('T')
        }

        const note = await notesRepository.create({
            user_id : user_id,
            title : title,
            content : content,
            date_reference : date_reference
        })

        if(!note){
            throw new Error('Failed to create note');
        }

        return note

    }

    async update({
        id,
        requesterId,
        noteData
    }){
        let foundNote = await notesRepository.find({
            id : id
        });

        if(foundNote.length === 0){
            throw new Error('Note not found');
        }

        foundNote = foundNote[0];

        if(requesterId !== foundNote.user_id){
            throw new Error('Unauthorized access');
        }

        if(noteData.title !== null){
            foundNote.title = noteData.title;
        }

        if(noteData.content !== null){
            foundNote.content = noteData.content;
        }

        if(noteData.date_reference !== null){
            foundNote.date_reference = noteData.date_reference.toISOString().split('T');
        }

        const updatedNote = await notesRepository.update({
            id : id,
            data : {
                title : foundNote.title,
                content : foundNote.content,
                date_reference : foundNote.date_reference,
                user_id : foundNote.user_id
            }
        })

        if(!updatedNote){
            throw new Error('Failed to update note')
        }

        return updatedNote;
    }

    async findFromUser({
        user_id,
        id,
        title,
        date_reference_start,
        date_reference_end,
        includedDeleted
    }){
        const notes = await notesRepository.find({
            user_id,
            id,
            title,
            date_reference_start,
            date_reference_end,
            includedDeleted
        })

        return notes;
    }

    async deactivate({
        id,
        requesterId
    }){
        const foundNote = await notesRepository.find({
            id : id
        });

        if(foundNote.length === 0){
            throw new Error('Note not found');
        }

        if(foundNote[0].user_id !== requesterId){
            throw new Error('Unauthorized access');
        }

        const deactivatedNote = await notesRepository.deactivate(id);

        if(!deactivatedNote){
            throw new Error('Failed to deactivate note');
        }

        return deactivatedNote
    }

    async activate({
        id,
        requesterId
    }){
        const foundNote = await notesRepository.find({
            id : id
        });

        if(foundNote.length === 0){
            throw new Error('Note not found');
        }

        if(foundNote[0].user_id !== requesterId){
            throw new Error('Unauthorized access');
        }

        const activatedNote = await notesRepository.activate(id);

        if(!activatedNote){
            throw new Error('Failed to activate note');
        }

        return activatedNote
    }
}

module.exports = new NotesService();