const {
    createNoteSchema,
    updateNoteSchema,
    findUserNotesSchema
} = require('./notes_schema');

const notesService = require('./notes_service');

class NotesController{
    async create(req,res){
        try{
            let data = createNoteSchema.parse(req.body);

            const note = await notesService.create({
                user_id : req.user.id,
                title : data.title,
                content : data.content,
                date_reference : data.date_reference
            });

            return res.status(200).json({
                message : 'Note created successfully',
                data : note
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to create note",
                error : err.message
            })
        }
    }

    async update(req,res){
        try{
            let data = updateNoteSchema.parse(req.body);

            const note = await notesService.update({
                id : Number(req.params.id),
                requesterId : req.user.id,
                noteData : data
            });

            return res.status(200).json({
                message : "Note updated successfully",
                data : note
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to update note",
                error : err.message
            })
        }
    }

    async findUserNotes(req,res){
        try{
            let data = findUserNotesSchema.parse(req.query);

            const notes = await notesService.findFromUser({
                user_id : req.user.id,
                title : data.title,
                date_reference_start : data.date_reference_start,
                date_reference_end : data.date_reference_end,
                includedDeleted : data.includedDeleted
            });

            return res.status(200).json({
                message : 'Notes found successfully',
                data : notes
            })
        }
        catch(err){
            return res.status(400).json({
                message : "Failed to find notes",
                error : err.message
            })
        }
    }

    async deactivate(req,res){
        try{
            const note = await notesService.deactivate({
                id : Number(req.params.id),
                requesterId : req.user.id
            });
            
            return res.status(200).json({
                message : "Note deactivated successfully",
                data : note
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to deactivate note",
                error : err.message
            })
        }
    }
    
    async activate(req,res){
        try{
            const note = await notesService.activate({
                id : Number(req.params.id),
                requesterId : req.user.id
            });
            
            return res.status(200).json({
                message : "Note activated successfully",
                data : note
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to activate note",
                error : err.message
            })
        }
    }
}

module.exports = new NotesController();