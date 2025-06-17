const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ERROR_MESSAGES, HTTP_STATUS_CODES, SUCCESS_MESSAGES } = require('../utils/enum');
const { get } = require('../router');


const createVendedor = async ({ nomeNegocio, cnpj, email, senha, cep, numero, complemento, contato, logradouro }) => {
    try {
        const vendedor = await prisma.vendedor.create({
            data: {
                nomeNegocio,
                cnpj,
                email,
                senha,
                cep,
                numero,
                contato,
                logradouro,
                complemento,
            }
        });
        

        return {
            message: SUCCESS_MESSAGES.VENDEDOR_CREATED,
            status: HTTP_STATUS_CODES.CREATED,
            data: {
                id: vendedor.id,
                name: vendedor.name,
                email: vendedor.email,
                phone: vendedor.phone
            }
        };
    } catch (error) {
        console.error('Erro ao criar vendedor:', error);
        throw error;
    }
}

const loginVendedor = async ({ email, senha }) => {
    try {
        const vendedor = await prisma.vendedor.findUnique({
            where: { email }
        });

        if (!vendedor || vendedor.senha !== senha) {
            return {
                status: HTTP_STATUS_CODES.UNAUTHORIZED,
                data: { message: ERROR_MESSAGES.INVALID_CREDENTIALS }
            };
        }

        return {
            status: HTTP_STATUS_CODES.OK,
            data: {
                id: vendedor.id,
                nomeNegocio: vendedor.nomeNegocio,
                email: vendedor.email
            }
        };
    } catch (error) {
        console.error('Erro ao fazer login do vendedor:', error);
        throw error;
    }
}

const getVendedorById = async ({ vendedorId }) => {
    try {
        const vendedor = await prisma.vendedor.findUnique({
            where: { id: Number(vendedorId) }
        });

        if (!vendedor) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: ERROR_MESSAGES.VENDEDOR_NOT_FOUND }
            };
        }

        return {
            status: HTTP_STATUS_CODES.OK,
            data: vendedor
        };
    }
    catch (error) {
        console.error('Erro ao buscar vendedor por ID:', error);
        throw error;
    }
}

const getVendedores = async () => {
    try {
        const vendedores = await prisma.vendedor.findMany();

        if (vendedores.length === 0) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: ERROR_MESSAGES.NO_VENDEDORES_FOUND }
            };
        }

        return {
            status: HTTP_STATUS_CODES.OK,
            data: vendedores
        };
    } catch (error) {
        console.error('Erro ao buscar vendedores:', error);
        throw error;
    }
}

module.exports = {
    createVendedor,
    loginVendedor,
    getVendedorById,
    getVendedores
};