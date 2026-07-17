const notesService = require('../../modules/notes/notes_service');
const usersRepository = require('../../modules/users/users_repository');

const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

jest.mock('../../modules/users/users_repository');
jest.mock('../../modules/notes/notes_service');
jest.mock('jsonwebtoken');

const now = new Date('2026-01-30');
const dateString = now.toISOString();

describe('POST /api/notes/create', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks()
    })

    it('should create a note successfully', async()=>{
        notesService.create.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : "Notes from user",
            date_reference : now,
            content : "Some content",
            created_at : now,
            updated_at : now,
            deleted_at : null
        });

        jwt.verify.mockReturnValue({
            sub : 1
        });

        const response = await request(app)
            .post('/api/notes/create')
            .set('Authorization', 'Bearer token')
            .send({
                user_id : 1,
                title : "Notes from user",
                content : "Some content",
                date_reference : now
            })

        console.log(response.status);
        console.log(response.body);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message : 'Note created successfully',
            data : {
                id : 1,
                user_id : 1,
                title : "Notes from user",
                date_reference : dateString,
                content : "Some content",
                created_at : dateString,
                updated_at : dateString,
                deleted_at : null
            }
        })

        expect(notesService.create).toHaveBeenCalledWith({
            title : "Notes from user",
            content : "Some content",
            date_reference : now,
            user_id : 1
        })
    });

    // TODO : Add test -> Should create a note successfully it title and date is null

    it('should return error if note data is invalid', async()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        const response = await request(app)
            .post('/api/notes/create')
            .set('Authorization', 'Bearer token')
            .send({
                user_id : 1,
                title : 1,
                content : 1,
                date_reference : 1
            })

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message : "Failed to create note",
            error : expect.any(String)
        })
    })
})

describe('PUT /api/notes/update/:id', ()=>{
    it('should update a note successfully', async()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        notesService.update.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : "Notes from user",
            date_reference : now,
            content : "Some content",
            created_at : now,
            updated_at : now,
            deleted_at : null
        });

        const response = await request(app)
            .put('/api/notes/update/1')
            .set('Authorization', 'Bearer token')
            .send({
                user_id : 1,
                title : "Notes from user",
                content : "Some content",
                date_reference : now
            })

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message : 'Note updated successfully',
            data : {
                id : 1,
                user_id : 1,
                title : "Notes from user",
                date_reference : dateString,
                content : "Some content",
                created_at : dateString,
                updated_at : dateString,
                deleted_at : null
            }
        })
    })

    it('should return error if note is not found', async()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        notesService.update.mockRejectedValue(new Error('Note not found'));

        const response = await request(app)
            .put('/api/notes/update/1')
            .set('Authorization', 'Bearer token')
            .send({
                user_id : 1,
                title : "Notes from user",
                content : "Some content",
                date_reference : now
            })

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message : "Failed to update note",
            error : expect.any(String)
        })
    })
})

describe('DELETE /api/notes/deactivate/:id', ()=>{
    it('should deactivate a note successfully', async()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        notesService.deactivate.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : "Notes from user",
            date_reference : now,
            content : "Some content",
            created_at : now,
            updated_at : now,
            deleted_at : now
        });

        const response = await request(app)
            .delete('/api/notes/deactivate/1')
            .set('Authorization', 'Bearer token')
            .send({
                id : 1,
                requesterId : 1
            })

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message : 'Note deactivated successfully',
            data : {
                id : 1,
                user_id : 1,
                title : "Notes from user",
                date_reference : dateString,
                content : "Some content",
                created_at : dateString,
                updated_at : dateString,
                deleted_at : dateString
            }
        })
    })

    it('should return a error if note is not found', async()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        notesService.deactivate.mockRejectedValue(new Error('Note not found'));

        const response = await request(app)
            .delete('/api/notes/deactivate/1')
            .set('Authorization', 'Bearer token')
            .send({
                id : 1,
                requesterId : 1
            })

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message : "Failed to deactivate note",
            error : expect.any(String)
        })
    })
})

describe('PATCH /api/notes/activate/:id', ()=>{
    it('should activate a note successfully', async()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        notesService.activate.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : "Notes from user",
            date_reference : now,
            content : "Some content",
            created_at : now,
            updated_at : now,
            deleted_at : null
        })

        const response = await request(app)
            .patch('/api/notes/activate/1')
            .set('Authorization', 'Bearer token')
            .send({
                id : 1,
                requesterId : 1
            })

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message : 'Note activated successfully',
            data : {
                id : 1,
                user_id : 1,
                title : "Notes from user",
                date_reference : dateString,
                content : "Some content",
                created_at : dateString,
                updated_at : dateString,
                deleted_at : null
            }
        })
    })

    it('should return a error if note is already activated', async()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        notesService.activate.mockRejectedValue(new Error('Note already activated'));

        const response = await request(app)
            .patch('/api/notes/activate/1')
            .set('Authorization', 'Bearer token')
            .send({
                id : 1,
                requesterId : 1
            });
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message : "Failed to activate note",
            error : expect.any(String)
        })
    })
})

describe('GET /api/notes/find', ()=>{
    it('should find notes successfully', async()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        notesService.findFromUser.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : "Notes from user",
                date_reference : now,
                content : "Some content",
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        ])

        const response = await request(app)
            .get('/api/notes/find')
            .set('Authorization', 'Bearer token')
            .send({
                user_id : 1
            })

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message : 'Notes found successfully',
            data : [
                {
                    id : 1,
                    user_id : 1,
                    title : "Notes from user",
                    date_reference : dateString,
                    content : "Some content",
                    created_at : dateString,
                    updated_at : dateString,
                    deleted_at : null
                }
            ]
        })
    })
})