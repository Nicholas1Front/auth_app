const usersService = require('../users_service');
const usersController = require('../users_controller');

jest.mock('../users_service');

describe('usersController register', () => {
    it('should register a user successfully', async ()=>{
        const req = {
            body : {
                name: 'Nick',
                email: 'teste@gmail.com',
                address: 'Rua 45, Fortaleza',
                password: '123456'
            }
        };

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        usersService.register.mockResolvedValue({
            id : 1,
            name: 'Nick',
            email: 'teste@gmail.com',
            address: 'Rua 45, Fortaleza'
        });

        await usersController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201)

        expect(res.json).toHaveBeenCalledWith({
            message : "User registered successfully",
            data : {
                id : 1,
                name: 'Nick',
                email: 'teste@gmail.com',
                address: 'Rua 45, Fortaleza'
            }
        })
    })
});