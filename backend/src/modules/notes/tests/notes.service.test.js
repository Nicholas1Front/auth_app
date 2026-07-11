const notesRepository = require('../notes_repository');
const notesService = require('../notes_service');

jest.mock('../notes_repository');
jest.mock('../notes_service');

describe('notesService create', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks()
    })

    it('should create a note successfully', async()=>{
        notesRepository.create.mockResolvedValue({
            id : 1,
            title : 'Note 1',
            content : "Some content",
            date_reference : 
        })
    })
})