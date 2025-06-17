const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { HTTP_STATUS_CODES } = require('../utils/enum');

// Criar produto
const createProduto = async ({ nome, quantidade, image, price, vendedorId }) => {
    try {
        if (!nome || typeof quantidade !== 'number' || !vendedorId) {
            return {
                status: HTTP_STATUS_CODES.BAD_REQUEST,
                data: { message: "Nome, quantidade e vendedorId são obrigatórios" },
            };
        }

        const produto = await prisma.produto.create({
            data: {
                nome,
                quantidade,
                image,
                price,
                vendedorId
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

// Buscar todos os produtos (pode filtrar por vendedor)
const getProdutos = async ({ vendedorId = null } = {}) => {
    try {
        const whereClause = vendedorId ? { vendedorId: Number(vendedorId) } : {};

        const produtos = await prisma.produto.findMany({
            where: whereClause
        });

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

// Buscar produto por ID
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

// Atualizar produto (verifica se o vendedor é dono do produto)
const updateProduto = async ({ id, nome, quantidade, vendedorId }) => {
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

        const updatedProduto = await prisma.produto.update({
            where: { id: Number(id) },
            data: { nome, quantidade }
        });

        return {
            status: HTTP_STATUS_CODES.OK,
            message: "Produto atualizado com sucesso",
            data: updatedProduto
        };
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
    }
};

// Deletar produto (verifica se o vendedor é dono do produto)
const deleteProduto = async ({ id }) => {
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
