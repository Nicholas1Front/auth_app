const authService = require("../auth_service");
const authController = require('../auth_controller');

jest.mock('../auth_service');

describe('authController login', ()=>{
    it('should login a user successfully', async()=>{
        const req = {
            body : {
                email : "teste@gmail.com",
                password : "123456"
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        authService.login.mockResolvedValue({
            id : 1,
            name : "Nick",
            email : "teste@gmail.com",
            token : "token"
        });

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(
            res.json
        ).toHaveBeenCalledWith({
            message : "Login successful",
            data : {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com",
                token : "token"
            }
        })
    })

    it("should not login a user if some data of request is invalid", async()=>{
        const req = {
            body : {
                email : 123,
                password : "123456"
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message : "Failed to login",
            error : expect.any(String)
        })
    })
})

describe('authController me', ()=>{
    it('should return user data successfully', async()=>{
        const req = {
            user : {
                id : 1
            }
        }

        const res = {
            status : jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        authService.me.mockResolvedValue({
            id : 1,
            name : "Nick",
            email : "teste@gmail.com"
        })

        await authController.me(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message : "User found",
            data : {
                id : 1,
                name : "Nick",
                email : "teste@gmail.com"
            }
        })
    })
})