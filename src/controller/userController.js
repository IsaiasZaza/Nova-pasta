const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ERROR_MESSAGES, HTTP_STATUS_CODES, SUCCESS_MESSAGES } = require('../utils/enum');


const createUser = async ({ name, email, senha, cpf, phone, cep, street, number, complement }) => {
    try {

        const cpfRegex = /^\d{11}$/;
        if (!cpfRegex.test(cpf)) {
            return {
                status: HTTP_STATUS_CODES.BAD_REQUEST,
                data: { message: "O CPF deve ser valido" },
            };
        }

        const existingUser = await prisma.user.findUnique({
            where: { cpf },
        });

        if (existingUser) {
            return {
                status: HTTP_STATUS_CODES.CONFLICT,
                data: { message: "Já existe um usuário cadastrado com este CPF." },
            };
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                senha,
                cpf,
                phone,
                cep,
                street,
                number,
                complement
            }
        });

        return {
            message: "Usuário criado com sucesso",
            status: HTTP_STATUS_CODES.CREATED,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                phone: user.phone,
                cep: user.cep,
                street: user.street,
                number: user.number,
                complement: user.complement
            }
        }
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
}

const getUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        if (users.length === 0) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: "Nenhum usuário encontrado" },
            };
        }
        return {
            status: HTTP_STATUS_CODES.OK,
            data: users
        };
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
}

const loginUser = async ({ email, Senha }) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: "Usuário não encontrado" },
            };
        }

        if (user.Senha !== Senha) {
            return {
                status: HTTP_STATUS_CODES.UNAUTHORIZED,
                data: { message: "Senha incorreta" },
            };
        }

        return {
            message: "Login realizado com sucesso",
            status: HTTP_STATUS_CODES.OK,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                phone: user.phone,
                cep: user.cep,
                street: user.street,
                number: user.number,
                complement: user.complement
            }
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!user) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: "Usuário não encontrado" },
            };
        }

        return {
            status: HTTP_STATUS_CODES.OK,
            data: user,
        };
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        throw error;
    }
};

const updateUser = async (id, userData) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!existingUser) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: "Usuário não encontrado" },
            };
        }

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: userData,
        });

        return {
            status: HTTP_STATUS_CODES.OK,
            message: "Usuário atualizado com sucesso",
            data: user,
        };
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!existingUser) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: "Usuário não encontrado" },
            };
        }

        await prisma.user.delete({
            where: { id: Number(id) },
        });

        return {
            status: HTTP_STATUS_CODES.OK,
            message: "Usuário deletado com sucesso",
        };
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
};


module.exports = {
    createUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};