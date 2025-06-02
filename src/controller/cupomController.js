const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCupom = async ({ codigo, valor, expiracao, tipo }) => {
    try {
        // Verifica se o cupom já existe
        const existingCupom = await prisma.cupom.findUnique({
            where: { codigo },
        });

        if (existingCupom) {
            return {
                status: 409, // Conflito
                data: { message: "Já existe um cupom cadastrado com este código." },
            };
        }

        // Cria o novo cupom
        const cupom = await prisma.cupom.create({
            data: {
                codigo,
                valor,
                expiracao: new Date(expiracao), // Converte a string de data para um objeto Date
                tipo,
            },
        });

        return {
            status: 201, // Criado
            data: {
                id: cupom.id,
                codigo: cupom.codigo,
                expiracao: cupom.expiracao,
                expirationDate: cupom.expirationDate,
                tipo: cupom.tipo,
                valor: cupom.valor,
            },
        };
    } catch (error) {
        console.error('Erro ao criar cupom:', error);
        throw error;
    }
}

const getCupons = async () => {
    try {
        const cupons = await prisma.cupom.findMany();
        if (cupons.length === 0) {
            return {
                status: 404, // Não encontrado
                data: { message: "Nenhum cupom encontrado" },
            };
        }
        return {
            status: 200, // OK
            data: cupons,
        };
    } catch (error) {
        console.error('Erro ao buscar cupons:', error);
        throw error;
    }
};

const getCupomById = async ({ id }) => {
    try {
        const cupom = await prisma.cupom.findUnique({
            where: { id: Number(id) }
        });

        if (!cupom) {
            return {
                status: 404, // Não encontrado
                data: { message: "Cupom não encontrado" },
            };
        }

        return {
            status: 200, // OK
            data: cupom
        };
    } catch (error) {
        console.error('Erro ao buscar cupom por ID:', error);
        throw error;
    }
};

const validarCupom = async ({ codigo }) => {
    try {
        const cupom = await prisma.cupom.findUnique({
            where: { codigo }
        });

        if (!cupom) {
            return {
                status: 404, // Não encontrado
                data: { message: "Cupom não encontrado" },
            };
        }

        // Verifica se o cupom está expirado
        const hoje = new Date();
        if (hoje > cupom.expiracao) {
            return {
                status: 400, // Bad Request
                data: { message: "Cupom expirado" },
            };
        }

        return {
            status: 200, // OK
            data: cupom
        };
    } catch (error) {
        console.error('Erro ao validar cupom:', error);
        throw error;
    }
};

module.exports = {
    createCupom,
    getCupons,
    getCupomById,
    validarCupom
};