const authService = require('../auth_service');
const authRepository = require('../auth_repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../auth_repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authService login', ()=>{
    it('should login a user successfully', async()=>{
        authRepository.findByEmail.mockResolvedValue({
            id : 1,
            name : 'Nick',
            email : 'teste@email.com',
            password_hash : '123456'
        });

        bcrypt.compare.mockResolvedValue(true);

        jwt.sign.mockReturnValue('token'); 
        // jwt is synchronous, so we can use mockReturnValue instead of mockResolvedValue

        await expect(
            authService.login({
                email : "teste@email.com",
                password : "123456"
            })
        ).resolves.toEqual({
            id : 1,
            name : 'Nick',
            email : 'teste@email.com',
            token : 'token'
        }) // .resolves.toEqual in this case because the function returns a promise that resolves to the user object with the token
    })

    it('should not sign a token if the password is incorrect', async()=>{
        authRepository.findByEmail.mockResolvedValue({
            id : 1,
            name : "Nick",
            email : "teste@email.com",
            password_hash : "123456"
        });

        bcrypt.compare.mockResolvedValue(false);

        //jwt is not called because the password is incorrect, so we don't need to mock it here

        await expect(
            authService.login({
                email : "teste@email.com",
                password : "123456"
            })
        ).rejects.toThrow('Invalid password') 
    });

    it('should not find a user if the email is incorrect', async()=>{
        authRepository.findByEmail.mockResolvedValue(null);

        await expect(
            authService.login({
                email : "teste@gmail.com",
                password : "123456"
            })
        ).rejects.toThrow('User not found')
    })
})

describe('authService me', ()=>{
    it("should return the user data successfully", async()=>{
        authRepository.findById.mockResolvedValue({
            id : 1,
            name : "Nick",
            email : "teste@gmail.com",
            password_hash : "123456"
        })

        bcrypt.compare.mockResolvedValue(true);

        jwt.sign.mockReturnValue('token');

        await expect(
            authService.me({
                id : 1
            })
        ).resolves.toEqual({
            id : 1,
            name : "Nick",
            email : "teste@gmail.com"
        })
    })

    it('should not find a user if the id is incorrect', async()=>{
        authRepository.findById.mockResolvedValue(null);

        await expect(
            authService.me({
                id : 2
            })
        ).rejects.toThrow('User not found')
    })
})