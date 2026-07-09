const usersService = require('../../modules/users/users_service');
const usersRepository = require('../../modules/users/users_repository');

const request = require('supertest');
const app = require('../../app');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../modules/users/users_service');
jest.mock('../../modules/users/users_repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('POST /api/users/register', ()=>{
    it('should register a new user successfully', async()=>{
        usersService.register.mockResolvedValue({
            id : 1,
            name : "Nick",
            email : "teste@gmail.com",
            address : "123 Main St"
        });

        const response = await request(app)
            .post('/api/users/register')
            .send({
                name : "Nick",
                email : "teste@gmail.com",
                address : "123 Main St",
                password : "123456"
            });

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message : 'User registered successfully',
            data : {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                address : "123 Main St"
            }
        })

        expect(usersService.register).toHaveBeenCalledWith({
            name : "Nick",
            email : "teste@gmail.com",
            address : "123 Main St",
            password : "123456"
        })
    })

    it("should return 400 if registration fails", async()=>{
        usersService.register.mockRejectedValue(
            new Error('Email already in use')
        );

        const response = await request(app)
            .post('/api/users/register')
            .send({
                name : "Nick",
                email : "teste@gmail.com",
                address : "123 Main St",
                password : "123456"
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message : 'Failed to register user',
            error : expect.any(String)
        })
    })
})

describe('PUT /api/users/update/:id', ()=>{

    beforeEach(()=>{
        jest.clearAllMocks();
    })

    it('should update user information successfully', async()=>{

        usersService.update.mockResolvedValue({
            id : 1,
            name : "Nick updated",
            email : "teste_updated@gmail.com",
            address : "456 Main St"
        })

        jwt.verify.mockReturnValue({
            sub : 1
        })

        bcrypt.compare.mockResolvedValue(true);

        const response = await request(app)
            .put('/api/users/update/1')
            .set('Authorization', 'Bearer token')
            .send({
                name : "Nick updated",
                email : "teste_updated@gmail.com",
                address : "456 Main St",
                password : "newpassword"
            })

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message : "User updated successfully",
            data : {
                id : 1,
                name : "Nick updated",
                email : "teste_updated@gmail.com",
                address : "456 Main St"
            }
        })

        expect(usersService.update).toHaveBeenCalledWith({
            targetId : 1,
            requesterId : 1,
            userData : {
                name : "Nick updated",
                email : "teste_updated@gmail.com",
                address : "456 Main St",
                password : "newpassword"
            }
        })
    })
})