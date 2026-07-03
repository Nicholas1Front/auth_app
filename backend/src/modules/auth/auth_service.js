const authRepository = require('./auth_repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService{
    async login({
        email,
        password
    }){
        const user = await authRepository.findByEmail(email);

        if(!user){
            throw new Error('User not found');
        }

        const passwordMath = await bcrypt.compare(
            password,
            user.password_hash
        );

        if(!passwordMath){
            throw new Error('Invalid password')
        }

        const token = jwt.sign(
            {
                sub : user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn : '1d'
            }
        )

        return {
            token,
            id : user.id,
            name : user.name,
            email : user.email
        }
    }

    async me(id){
        const user = await authRepository.findById(id);

        if(!user || user.length === 0){
            throw new Error('User not found');
        }

        return {
            id : user.id,
            name : user.name,
            email : user.email
        }
    }
}

module.exports = new AuthService();