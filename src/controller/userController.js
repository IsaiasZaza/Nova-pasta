const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ERROR_MESSAGES, HTTP_STATUS_CODES, SUCCESS_MESSAGES } = require('../utils/enum');


const createUser = async ({ name, email, senha, phone, nascimento, cep, endereco }) => {
    try {

        const user = await prisma.user.create({
            data: {
                name,
                email,
                senha,            
                phone,             
                nascimento,
                cep: "Coloque seu CEP aqui", // TODO: Implementar lógica para buscar o CEP
                endereco: "Coloque seu endereço aqui", // TODO: Implementar lógica para buscar o endereço
            }
        });

        return {
            message: "Usuário criado com sucesso",
            status: HTTP_STATUS_CODES.CREATED,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,  
                complement: user.complement,
                cep: user.cep,
                endereco: user.endereco,
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

const loginUser = async ({ email, senha }) => {
  try {
    // Verifica se é um usuário comum
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      if (user.senha !== senha) {
        return {
          status: HTTP_STATUS_CODES.UNAUTHORIZED,
          data: { message: "Senha incorreta" },
        };
      }

      return {
        status: HTTP_STATUS_CODES.OK,
        message: "Login realizado com sucesso",
        data: {
          tipo: 'user',
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          nascimento: user.nascimento,
          cep: user.cep,
          endereco: user.endereco,
        },
      };
    }

    // Verifica se é um vendedor
    const vendedor = await prisma.vendedor.findUnique({
      where: { email },
    });

    if (vendedor) {
      if (vendedor.senha !== senha) {
        return {
          status: HTTP_STATUS_CODES.UNAUTHORIZED,
          data: { message: "Senha incorreta" },
        };
      }

      return {
        status: HTTP_STATUS_CODES.OK,
        message: "Login realizado com sucesso",
        data: {
          tipo: 'vendedor',
          id: vendedor.id,
          nomeNegocio: vendedor.nomeNegocio,
          email: vendedor.email,
          cnpj: vendedor.cnpj,
          contato: vendedor.contato,
          cep: vendedor.cep,
          logradouro: vendedor.logradouro,
          numero: vendedor.numero,
          complemento: vendedor.complemento,
        },
      };
    }

    return {
      status: HTTP_STATUS_CODES.NOT_FOUND,
      data: { message: "E-mail não encontrado" },
    };
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    throw error;
  }
};


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


const getProdutosByVendedorId = async (vendedorId) => {
  try {
    const id = Number(vendedorId);
    if (isNaN(id)) {
      return {
        status: 400,
        data: { message: "vendedorId deve ser um número válido" },
      };
    }

    const produtos = await prisma.produto.findMany({
      where: { vendedorId: id },
    });

    if (!produtos || produtos.length === 0) {
      return {
        status: 404,
        data: { message: "Nenhum produto encontrado para este vendedor" },
      };
    }

    return {
      status: 200,
      data: produtos,
    };
  } catch (error) {
    console.error('Erro ao buscar produtos por vendedor ID:', error);
    return {
      status: 500,
      data: { message: "Erro interno do servidor" },
    };
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
    deleteUser,
    getProdutosByVendedorId
};