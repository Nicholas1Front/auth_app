const usersService = require('./users_service');
const {
    registerUserSchema,
    findUserSchema,
    updateUserSchema
} = require('./users_schema');

class UsersController{
    async register(req,res){
        try{
            const data = registerUserSchema.parse(req.body);

            const user = await usersService.register({
                name : data.name,
                email : data.email,
                address : data.address,
                password : data.password
            });

            return res.status(201).json({
                message : "User registered successfully",
                data : user
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to register user",
                error : `${err.code} - ${err.message}`
            })
        }
    }
    async update(req,res){
        try{
            let data = updateUserSchema.parse(req.body);

            const user = await usersService.update({
                targetId : req.params.id,
                requesterId : req.user.id,
                userData : data
            })

            return res.status(200).json({
                message : 'User updated successfully',
                data : user
            })

        }catch(err){
            return res.status(400).json({
                message : "Failed to update user",
                error : `${err.code} - ${err.message}`
            })
        }
    }

    async delete(req,res){
        try{
            await usersService.delete({
                targetId : req.params.id,
                requesterId : req.user.id
            })

            return res.status(200).json({
                message : "User deleted successfully"
            })

        }catch(err){
            return res.status(400).json({
                message : "Failed to delete user",
                error : `${err.code} - ${err.message}`
            })
        }
    }
}

module.exports = new UsersController();