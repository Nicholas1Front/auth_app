const authMiddleware = require('../auth_middleware');

const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authMiddleware', ()=>{
    it('should return 401 if no token is provided', ()=>{
        const req = {
            headers : {}
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            message : "No token provided"
        })

        expect(next).not.toHaveBeenCalled();
    })

    it('should successfully call next if a valid token is provided', ()=>{
        jwt.verify.mockReturnValue({
            sub : 1
        });

        const req = {
            headers : {
                authorization : "Bearer token"
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        const next = jest.fn();

        authMiddleware(req, res, next);

        // Check if jwt.verify was called with the correct arguments
        expect(jwt.verify).toHaveBeenCalledWith(
            "token",
            process.env.JWT_SECRET
        )

        // Check if req.user was set correctly
        expect(req.user).toEqual({
            id : 1
        });

        expect(next).toHaveBeenCalled();

    })
})