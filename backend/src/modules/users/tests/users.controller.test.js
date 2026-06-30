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

    it('should return 400 when schema validation fails', async()=>{
        const req = {
            body : {
                name : "Nick",
                email : undefined,
                address : "Rua 45, Fortaleza",
                password : "123456"
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        await usersController.register(req,res);

        expect(
            res.status
        ).toHaveBeenCalledWith(400);

        expect(
            res.json
        ).toHaveBeenCalledWith({
            message : "Failed to register user",
            error : expect.any(String)
        })
    });
});

describe('usersController update', ()=>{
    it('should update a user successfully', async()=>{
        const req = {
            user : {
                id : 1
            },
            params : {
                id : 1
            },
            body : {
                name : "Nick",
                email : "teste@gmail.com"
            }
        };

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        usersService.update.mockResolvedValue({
            id : 1,
            name : "Nick",
            email : "teste@gmail.com",
            address : "Rua 45, Fortaleza"
        })

        await usersController.update(req,res);

        expect(usersService.update).toHaveBeenCalledWith({
                targetId : 1,
                requesterId : 1,
                userData : {
                    name : "Nick",
                    email : "teste@gmail.com"
                }
        });

        expect(
            res.status
        ).toHaveBeenCalledWith(200);

        expect(
            res.json
        ).toHaveBeenCalledWith({
            message : "User updated successfully",
            data : {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                address : "Rua 45, Fortaleza"
            }
        })
    })

    it('should return 400 when schema validation fails', async()=>{
        const req = {
            user : {
                id : 1
            },
            params : {
                id : 1
            },
            body : {
                name : undefined,
                email : "abc"
            }
        };

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        await usersController.update(req,res);

        expect(
            res.status
        ).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message : "Failed to update user",
            error : expect.any(String)
        })
    })
})

describe('usersController delete', ()=>{
    it('should delete a user successfully', async()=>{
        const req = {
            user : {
                id : 1
            },
            params : {
                id : 1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        usersService.delete.mockResolvedValue(true);

        await usersController.delete(req,res);
        
        expect(
            usersService.delete
        ).toHaveBeenCalledWith({
            targetId : 1,
            requesterId : 1
        });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message : "User deleted successfully"
        })
    })
})