const notesController = require('../notes_controller');
const notesService = require('../notes_service');

jest.mock('../notes_service');

const now = new Date();

describe('notesController create', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks()
    })

    it('should create a note successfully', async()=>{
        const req = {
            body : {
                title : "Notes",
                content : "Some content",
                date_reference : now
            },
            user : {
                id : 1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        notesService.create.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : "Notes",
            content : "Some content",
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        })

        await notesController.create(req,res);

        expect(notesService.create).toHaveBeenCalledWith({
            title : "Notes",
            content : "Some content",
            date_reference : now,
            user_id : 1
        })

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Note created successfully',
            data : {
                id : 1,
                user_id : 1,
                title : "Notes",
                content : "Some content",
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        })
    })

    it('should return an error if note creation fails', async()=>{
        const req = {
            body : {
                title : "Notes",
                content : "Some content",
                date_reference : now
            },
            user : {
                id : 1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        notesService.create.mockRejectedValue(new Error('Failed to create note'));

        await notesController.create(req,res);

        await expect(notesService.create).toHaveBeenCalledWith({
            title : "Notes",
            content : "Some content",
            date_reference : now,
            user_id : 1
        })

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message : "Failed to create note",
            error : expect.any(String)
        })
    })

    it('should not create a note if some data of request is invalid', async()=>{
        const req = {
            body : {
                title : 123,
                content : "Some content",
                date_reference : 12
            },
            user : {
                id : 1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        await notesController.create(req,res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message : "Failed to create note",
            error : expect.any(String)
        })
    })
})

describe('notesController update', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks()
    });

    it('should a update a note successfully', async()=>{
        const req = {
            body : {
                title : 'Notes from user updated',
                content : 'Some content updated',
                date_reference : now
            },
            params : {
                id : 1
            },
            user : {
                id :1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        notesService.update.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : 'Notes from user updated',
            content : 'Some content updated',
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        })

        await notesController.update(req,res);

        expect(notesService.update).toHaveBeenCalledWith({
            id : 1,
            requesterId : 1,
            noteData : {
                title : 'Notes from user updated',
                content : 'Some content updated',
                date_reference : now
            }
        })

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Note updated successfully',
            data : {
                id : 1,
                user_id : 1,
                title : 'Notes from user updated',
                content : 'Some content updated',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        })
    
    })

    it('should not update a note if some data of request is invalid', async()=>{
        const req = {
            body : {
                title : 123,
                content : "Some content",
                date_reference : 12
            },
            params : {
                id : 1
            },
            user : {
                id :1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        await notesController.update(req,res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message : "Failed to update note",
            error : expect.any(String)
        })
    })

    it('should return an error if note update fails', async()=>{
        const req = {
            body : {
                title : 'Notes from user updated',
                content : 'Some content updated',
                date_reference : now
            },
            params : {
                id : 1
            },
            user : {
                id :1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        notesService.update.mockRejectedValue(new Error('Failed to update note'));

        await notesController.update(req,res);

        await expect(notesService.update).toHaveBeenCalledWith({
            id : 1,
            requesterId : 1,
            noteData : {
                title : 'Notes from user updated',
                content : 'Some content updated',
                date_reference : now
            }
        })

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message : "Failed to update note",
            error : expect.any(String)
        })
    })
})

describe('notesController deactivate', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks()
    })

    it('should deactivate a note successfully', async()=>{
        const req = {
            params : {
                id : 1
            },
            user : {
                id :1
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        notesService.deactivate.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : 'Notes from user updated',
            content : 'Some content updated',
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : now
        });

        await notesController.deactivate(req,res);

        await expect(notesService.deactivate).toHaveBeenCalledWith({
            id : 1,
            requesterId : 1
        })

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message : "Note deactivated successfully",
            data : {
                id : 1,
                user_id : 1,
                title : 'Notes from user updated',
                content : 'Some content updated',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : now
            }
        })
    })

    it('should return an error if note is not found', async()=>{
        const req = {
            params : {
                id : 1
            },
            user : {
                id : 1
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        await notesService.deactivate.mockRejectedValue(new Error('Note not found'));

        await notesController.deactivate(req,res);

        expect(notesService.deactivate).toHaveBeenCalledWith({
            id : 1,
            requesterId : 1
        })

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message : "Failed to deactivate note",
            error : expect.any(String)
        })
    })
})

describe('notesController activate', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks()
    })

    it('should activate a note successfully', async()=>{
        const req = {
            params : {
                id : 1
            },
            user : {
                id : 1
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        notesService.activate.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : 'Notes from user updated',
            content : 'Some content updated',
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        });

        await notesController.activate(req,res);

        expect(notesService.activate).toHaveBeenCalledWith({
            id : 1,
            requesterId : 1
        })

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message : "Note activated successfully",
            data : {
                id : 1,
                user_id : 1,
                title : 'Notes from user updated',
                content : 'Some content updated',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        })
    })

    it('should not activate a note if note is not found', async()=>{
        const req = {
            params : {
                id : 1
            },
            user : {
                id : 1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        notesService.activate.mockRejectedValue(new Error('Note not found'));

        await notesController.activate(req,res);

        expect(notesService.activate).toHaveBeenCalledWith({
            id : 1,
            requesterId : 1
        })

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message : "Failed to activate note",
            error : expect.any(String)
        })
    })
})

describe('notesController findUserNotes', ()=>{
    
    beforeEach(()=>{
        jest.clearAllMocks()
    })

    it('should find notes from user successfully', async()=>{
        const req = {
            user : {
                id : 1
            },
            query : {}
        };

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        notesService.findFromUser.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user updated',
                content : 'Some content updated',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        ]);

        await notesController.findUserNotes(req,res);

        console.log(res.status.mock.calls)
        console.log(res.json.mock.calls);

        expect(notesService.findFromUser).toHaveBeenCalledWith({
            user_id : 1,
            title : null,
            date_reference_start : null,
            date_reference_end : null,
            includedDeleted : null
        })

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message : 'Notes found successfully',
                data : [
                    {
                       id : 1,
                        user_id : 1,
                        title : 'Notes from user updated',
                        content : 'Some content updated',
                        date_reference : now,
                        created_at : now,
                        updated_at : now,
                        deleted_at : null 
                    }
                ]
        })
    })
})