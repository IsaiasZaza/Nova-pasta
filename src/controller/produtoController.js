const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { HTTP_STATUS_CODES } = require('../utils/enum');

const createProduto = async ({ nome, quantidade, image, price }) => {
    try {
        if (!nome || typeof quantidade !== 'number') {
            return {
                status: HTTP_STATUS_CODES.BAD_REQUEST,
                data: { message: "Nome e quantidade são obrigatórios" },
            };
        }

        const produto = await prisma.produto.create({
            data: {
                nome,
                quantidade,
                image,
                price
            }
        });

        return {
            status: HTTP_STATUS_CODES.CREATED,
            message: "Produto criado com sucesso",
            data: produto
        };
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
    }
};

const getProdutos = async () => {
    try {
        const produtos = await prisma.produto.findMany();
        if (produtos.length === 0) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: "Nenhum produto encontrado" },
            };
        }
        return {
            status: HTTP_STATUS_CODES.OK,
            data: produtos
        };
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
};

const getProdutoById = async ({ id }) => {
    try {
        const produto = await prisma.produto.findUnique({
            where: { id: Number(id) }
        });

        if (!produto) {
            return {
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: { message: "Produto não encontrado" },
            };
        }

        return {
            status: HTTP_STATUS_CODES.OK,
            data: produto
        };
    } catch (error) {
        console.error('Erro ao buscar produto por ID:', error);
        throw error;
    }
};

const updateProduto = async ({ nome, quantidade, id }) => {
    try {
        const produto = await prisma.produto.update({
            where: { id: Number(id) },
            data: { nome, quantidade }
        });

        return {
            status: HTTP_STATUS_CODES.OK,
            message: "Produto atualizado com sucesso",
            data: produto
        };
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
    }
};

const deleteProduto = async ({ id }) => {
    try {
        await prisma.produto.delete({
            where: { id: Number(id) }
        });

        return {
            status: HTTP_STATUS_CODES.OK,
            message: "Produto deletado com sucesso"
        };
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
    }
};

module.exports = {
    createProduto,
    getProdutos,
    getProdutoById,
    updateProduto,
    deleteProduto
};