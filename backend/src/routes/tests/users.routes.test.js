const usersService = require('../../modules/users/users_service');

const request = require('supertest');
const app = require('../../app');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../modules/users/users_service');
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

    it('should return 400 if request data is invalid', async()=>{
        const response = await request(app)
            .put("/api/users/update/1")
            .set('Authorization', 'Bearer token')
            .send({
                name : 1,
                email : "invalid-email-format",
                address : 1,
                password : 1
            })
        
        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message : "Failed to update user",
            error : expect.any(String)
        })
    })

    it('should return 400 if the email is the same as the current one', async()=>{
        usersService.update.mockRejectedValue(
            new Error("Email already in use")
        )

        jwt.verify.mockReturnValue({
            sub : 1
        })

        const response = await request(app)
            .put("/api/users/update/1")
            .set('Authorization', 'Bearer token')
            .send({
                email : "teste@gmail.com"
            })

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message : "Failed to update user",
            error : expect.any(String)
        })

        expect(usersService.update).toHaveBeenCalledWith({
            targetId : 1,
            requesterId : 1,
            userData : {
                email : "teste@gmail.com"
            }
        })
    })
})

describe('DELETE /api/users/delete/:id', ()=>{
    it('should delete user successfully', async()=>{
        usersService.delete.mockResolvedValue(
            true
        );

        jwt.verify.mockReturnValue({
            sub : 1
        });

        const response = await request(app)
            .delete('/api/users/delete/1')
            .set('Authorization', 'Bearer token')
        
        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message : 'User deleted successfully',
        })

        expect(usersService.delete).toHaveBeenCalledWith({
            targetId : 1,
            requesterId : 1
        })
    })

    it('should return 400 if user not found', async()=>{
        usersService.delete.mockRejectedValue({
            message : "User not found"
        });

        jwt.verify.mockReturnValue({
            sub : 1
        });

        const response = await request(app)
            .delete('/api/users/delete/1')
            .set('Authorization', 'Bearer token')

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message : 'Failed to delete user',
            error : expect.any(String)
        })

        expect(usersService.delete).toHaveBeenCalledWith({
            targetId : 1,
            requesterId : 1
        })
    })
})