const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const authService = require('../../modules/auth/auth_service');

jest.mock('../../modules/auth/auth_service');
jest.mock('jsonwebtoken');

describe('POST /auth/login', ()=>{
    beforeEach(()=>{
            jest.clearAllMocks();
    })

    it('should login a user successfully', async()=>{
        authService.login.mockResolvedValue({
            id : 1,
            name : "Nick",
            email : "teste@gmail.com",
            token : "token"
        });
        
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email : "teste@gmail.com",
                password : "123456"
            })

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message : 'Login successful',
            data : {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                token : "token"
            }
        })

        expect(authService.login).toHaveBeenCalledWith({
            email : "teste@gmail.com",
            password : "123456"
        })
    })

    it('should return 400 if login data is invalid', async()=>{
        authService.login.mockRejectedValue(new Error('Invalid credentials'));

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email : "teste@gmail.com",
                password : "wrongpassword"
            })

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message : 'Failed to login',
            error : expect.any(String)
        })

        expect(authService.login).toHaveBeenCalledWith({
            email : "teste@gmail.com",
            password : "wrongpassword"
        })
    })
})

describe('GET /auth/me', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it("should return the authenticated user's information", async()=>{
        authService.me.mockResolvedValue({
            id : 1,
            name : 'Nick',
            email : "teste@gmail.com"
        });

        // Mock the JWT for the request to simulate an authenticated user
        jwt.verify.mockReturnValue({ sub: 1 });

        /* request is a object like this :
        
        {
            headers : {
                Authorization : 'Bearer token'
            },
            user : {
                id : 1
            }
        }
        
        */
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer token')

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message : 'User found',
            data : {
                id : 1,
                name : 'Nick',
                email : "teste@gmail.com"
            }
        });

        expect(authService.me).toHaveBeenCalledWith(
            1 // req.user.id
        )
    })

    it('should return 400 if the req.user.id is not valid or found', async()=>{
        authService.me.mockRejectedValue(
            new Error('User not found')
        );

        // jwt is not called because the user is not authenticated

        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer token');

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message : 'Failed to find user',
            error : expect.any(String)
        })
    })
})