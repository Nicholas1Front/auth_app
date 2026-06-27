const usersRepository = require('./users_repository');
const bcrypt = require('bcrypt');

class UsersService{
    async register({
        name,
        email,
        address,
        password
    }){
        const findEmail = await usersRepository.find({
            email : email
        })

        if(findEmail.length > 0){
            throw new Error('Email already in use');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await usersRepository.register({
            name : name,
            email : email,
            address : address,
            passwordHash : passwordHash
        });

        if(!user){
            throw new Error('Failed to register user');
        }

        return {
            id : user.id,
            name : user.name,
            email : user.email,
            address : user.address
        }
    }
    async update({
        targetId,
        requesterId,
        userData
    }){

        if(requesterId !== targetId){
            throw new Error('Unauthorized access');
        }

        const findUser = await usersRepository.find({
            id : targetId
        });

        if(findUser.length === 0){
            throw new Error('User not found');
        }

        if(userData.email !== undefined){
            if(userData.email === findUser[0].email){
                throw new Error('The email is the same as before');
            }

            const findEmail = await usersRepository.find({
                email : userData.email
            });

            if(findEmail.length > 0 && findEmail[0].id !== targetId){
                throw new Error('Email already in use');
            }

            userData.email = userData.email.toLowerCase();
        }

        if(userData.password !== undefined){
            const passwordHash = await bcrypt.hash(userData.password, 10);

            const passwordMatch = await bcrypt.compare(
                userData.password,
                findUser[0].password_hash
            );

            if(passwordMatch){
                throw new Error('The password is the same as before');
            }

            userData.password_hash = passwordHash;
        }

        const updatedUser = await usersRepository.updateById({
            id : targetId,
            userData
        });

        if(!updatedUser){
            throw new Error('Failed to update user');
        }

        return {
            id : updatedUser.id,
            name : updatedUser.name,
            email : updatedUser.email,
            address : updatedUser.address
        };
    
    }

    async delete({
        targetId,
        requesterId
    }){
        if(requesterId !== targetId){
            throw new Error('Unauthorized access');
        }

        const deletedUser = await usersRepository.deleteById(
            targetId
        );

        if(!deletedUser){
            throw new Error('Failed to delete user');
        }

        return true;
    }
}

module.exports = new UsersService();