const usersRepository = require('../users_repository');
const usersService = require('../users_service');
const bcrypt = require('bcrypt');

jest.mock('../users_repository');
jest.mock('bcrypt');

describe('usersService register', ()=>{
    it('should throw error when email already exists', async () => {

        usersRepository.find.mockResolvedValue([
            {
                id: 1,
                email: 'teste@email.com'
            }
        ]);

        await expect(
            usersService.register({
                name: 'Nick',
                email: 'teste@email.com',
                address: 'Fortaleza',
                password: '123456'
            })
        ).rejects.toThrow('Email already in use');

    });
})

describe('usersService update', ()=>{
    it('should not allow a user update another user', async () =>{
        await expect(
            usersService.update({
                targetId : 1,
                requesterId : 2,
                userData : {
                    name : "Nick"
                }
            })
        ).rejects.toThrow('Unauthorized access');
    });

    it('should not find a user while updating', async()=>{
        usersRepository.find.mockResolvedValue([]);

        expect(
            usersService.update({
                targetId : 1,
                requesterId : 1,
                userData : {
                    name : 'Nick'
                }
            })
        ).rejects.toThrow('User not found');
    });

    it('should not allow updating with same password', async()=>{
        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                password_hash : 'senha_hash'
            }
        ]);

        bcrypt.hash.mockResolvedValue('novo_hash');

        bcrypt.compare.mockResolvedValue(true);

        await expect(
            usersService.update({
                targetId : 1,
                requesterId : 1,
                userData : {
                    password : '123456'
                }
            })
        ).rejects.toThrow('The password is the same as before')
    })

    it('should not allow updating with same email', async()=>{
        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                email : 'teste@gmail.com'
            }
        ]);

        await expect(
            usersService.update({
                targetId : 1,
                requesterId : 1,
                userData : {
                    email : 'teste@gmail.com'
                }
            })
        ).rejects.toThrow('The email is the same as before')
    })
});

describe('usersService delete', ()=>{
    it('should not allow a user delete another user', async()=>{
        await expect(
            usersService.delete({
                targetId : 1,
                requesterId : 2
            })
        ).rejects.toThrow('Unauthorized access');
    });

    it('should not find a user while deleting', async()=>{
        usersRepository.find.mockResolvedValue([]);

        await expect(
            usersService.delete({
                targetId : 1,
                requesterId : 1
            })
        ).rejects.toThrow('User not found');
    });

    it('should delete a user', async()=>{
        usersRepository.find.mockResolvedValue([
            {
                id : 1,
                name : 'Nick',
                email : 'teste@gmail.com',
                address : 'Rua 45, Fortaleza'
            }
        ]);

        usersRepository.deleteById.mockResolvedValue(true)

        await expect(
            usersService.delete({
                targetId : 1,
                requesterId : 1
            })
        ).resolves.toBe(true);
    })
})