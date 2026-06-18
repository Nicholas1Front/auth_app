const authService = require('./auth_service');
const {
    loginSchema
} = require('./auth_schema');

class AuthController{
    async login(req,res){
        try{
            const data = loginSchema.parse(req.body);

            const user = await authService.login({
                email : data.email,
                password : data.password
            });

            return res.status(200).json({
                message : "Login successful",
                data : user
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to login",
                error : `${err.code} - ${err.message}`
            })
        }
    }

    async me(req,res){
        try{
            const user = await authService.me(
                req.user.id
            );

            return res.status(200).json({
                message : "User found",
                data : user
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to find user",
                error : `${err.code} - ${err.message}`
            })
        }
    }
}

module.exports = new AuthController();