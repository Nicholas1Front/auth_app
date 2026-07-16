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
})