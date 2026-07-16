const notesRepository = require('../notes_repository');
const notesService = require('../notes_service');
const usersRepository = require('../../users/users_repository');

jest.mock('../notes_repository');
jest.mock('../../users/users_repository');

describe('notesService create', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks()
    })

    it('should create a note successfully', async()=>{

        const now = new Date(); // because if we put several "new Date()" it will be different every time

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                password_hash : "123456",
                address : "Main st"
            }
        ]);
        
        notesRepository.create.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : "Notes from user",
            date_reference : now,
            content : "Some content",
            created_at : now,
            updated_at : now,
            deleted_at : null
        });

        await expect(
            notesService.create({
                title : "Notes from user",
                date_reference : now,
                content : "Some content",
                user_id : 1
            })
        ).resolves.toEqual({
            id : 1,
            user_id : 1,
            title : "Notes from user",
            date_reference : now,
            content : "Some content",
            created_at : now,
            updated_at : now,
            deleted_at : null
        })
    })

    it('should create a note successfully even if some data is missing', async()=>{
        
        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                password_hash : "123456",
                address : "Main st"
            }
        ]);

        notesRepository.create.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : "Notes by Nick - 1",
            content : "Some content",
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        })

        await expect(
            notesService.create({
                title : null,
                date_reference : null,
                content : "Some content",
                user_id : 1
            })
        ).resolves.toEqual({
            id : 1,
            user_id : 1,
            title : "Notes by Nick - 1",
            content : "Some content",
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        })
    })

    it('should throw an error if repository cant create note', async()=>{
        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                password_hash : "123456",
                address : "Main st"
            }
        ])

        notesRepository.create.mockResolvedValue(false) // Mock the repository to return false

        await expect(
            notesService.create({
                title : "Notes",
                content : "Some content",
                date_reference : now
            })
        ).rejects.toThrow(
            'Failed to create note'
        )
    })
})

describe('notesService update', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks()
    })

    it('should update a note sucessfully', async()=>{
        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : 'Nick',
                email : "teste@gmail.com",
                password_hash : '123456',
                address : "Main st"
            }
        ])

        notesRepository.find.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        ])

        notesRepository.update.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : 'Notes from user updated',
            content : 'Some content updated',
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        })

        await expect(
            notesService.update({
                id : 1,
                requesterId : 1,
                noteData : {
                    title : 'Notes from user updated',
                    content : 'Some content updated'
                }
            })
        ).resolves.toEqual({
            id : 1,
            user_id : 1,
            title : 'Notes from user updated',
            content : 'Some content updated',
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        })
    })

    it('should throw an error if repository cant update note', async()=>{

        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : 'Nick',
                email : "teste@gmail.com",
                password_hash : '123456',
                address : "Main st"
            }
        ])

        notesRepository.find.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        ])

        notesRepository.update.mockResolvedValue(false) // Mock the repository to return false

        await expect(
            notesService.update({
                id : 1,
                requesterId : 1,
                noteData : {
                    title : 'Notes from user updated'
                }
            })
        ).rejects.toThrow(
            'Failed to update note'
        )
    })

    it('should throw a error if user is unauthorized', async()=>{

        usersRepository.find.mockResolvedValue([
            {
                id : 2,
                name : 'Nick',
                email : "teste@gmail.com",
                password_hash : '123456',
                address : "Main st"
            }
        ]);

        notesRepository.find.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : new Date(),
                created_at : new Date(),
                updated_at : new Date(),
                deleted_at : null
            }
        ])

        await expect(
            notesService.update({
                id : 1,
                requesterId : 2,
                noteData : {
                    title : 'Notes from user updated'
                }
            })
        ).rejects.toThrow(
            'Unauthorized access'
        )
    })
})

describe('notesService findFromUser', ()=>{
    it('should find notes from user successfully', async()=>{
       
        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                password_hash : '123456',
                address : "Main st"
            }
        ])

        notesRepository.find.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        ])

        await expect(
            notesService.findFromUser({
                user_id : 1,
                id : null,
                title : null,
                date_reference_start : null,
                date_reference_end : null,
                includedDeleted : null
            })
        ).resolves.toEqual([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        ])
    })
})

describe('notesService deactivate', ()=>{
    it('should deactivate note successfully', async()=>{

        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                password_hash : '123456',
                address : "Main st"
            }
        ])

        notesRepository.find.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        ]);

        notesRepository.deactivate.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : 'Notes from user',
            content : 'Some content',
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : now
        })

        await expect(
            notesService.deactivate({
                id : 1,
                requesterId : 1
            })
        ).resolves.toEqual({
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : now
        })
    })

    it('should throw a error if note is already deactivated', async()=>{
        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                password_hash : '123456',
                address : "Main st"
            }
        ])

        notesRepository.find.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : now
            }
        ])

        await expect(
            notesService.deactivate({
                id : 1,
                requesterId : 1
            })
        ).rejects.toThrow(
            'Note already deactivated'
        )
    })
})

describe('notesService activate', ()=>{
    it('should activate note sucessfully', async()=>{

        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                password_hash : '123456',
                address : 'Main st'
            }
        ]);

        notesRepository.find.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : now
            }
        ]);

        notesRepository.activate.mockResolvedValue({
            id : 1,
            user_id : 1,
            title : 'Notes from user',
            content : 'Some content',
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        })

        await expect(
            notesService.activate({
                id : 1,
                requesterId : 1
            })
        ).resolves.toEqual({
            id : 1,
            user_id : 1,
            title : 'Notes from user',
            content : 'Some content',
            date_reference : now,
            created_at : now,
            updated_at : now,
            deleted_at : null
        })
    })

    it('should throw a error if note is already activated', async()=>{
        const now = new Date();

        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                password_hash : '123456',
                address : "Main st"
            }
        ])

        notesRepository.find.mockResolvedValue([
            {
                id : 1,
                user_id : 1,
                title : 'Notes from user',
                content : 'Some content',
                date_reference : now,
                created_at : now,
                updated_at : now,
                deleted_at : null
            }
        ])

        await expect(
            notesService.activate({
                id : 1,
                requesterId : 1
            })
        ).rejects.toThrow(
            'Note already activated'
        )
    })

})