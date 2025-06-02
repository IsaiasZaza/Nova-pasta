const {
    createUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('./controller/userController');
const {
    createProduto,
    getProdutos,
    getProdutoById,
    updateProduto,
    deleteProduto
} = require('./controller/produtoController');

const {
    createCupom,
    getCupons,
    getCupomById,
    validarCupom
} = require('./controller/cupomController');


const express = require('express');
const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
    const { name, email, cpf, phone, cep, street, number, complement, senha } = req.body;
    const { status, data } = await createUser({ name, email, cpf, phone, cep, street, number, complement, senha });
    res.status(status).json(data);
});

// Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const { status, data } = await loginUser({ email, senha });
    res.status(status).json(data);
});

// Listar todos os usuários
router.get('/users', async (req, res) => {
    try {
        const { status, data } = await getUsers();
        res.status(status).json(data);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Buscar usuário por ID
router.get('/users/:id', async (req, res) => {
    try {
        const { status, data } = await getUserById(req.params.id);
        res.status(status).json(data);
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Atualizar usuário por ID
router.put('/users/:id', async (req, res) => {
    try {
        const { status, data, message } = await updateUser(req.params.id, req.body);
        res.status(status).json({ message, data });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Deletar usuário por ID
router.delete('/users/:id', async (req, res) => {
    try {
        const { status, message } = await deleteUser(req.params.id);
        res.status(status).json({ message });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.post('/products', async (req, res) => {
    try {
        const { nome, quantidade, image, price } = req.body;
        const { status, data, message } = await createProduto({ nome, quantidade, image, price });
        res.status(status).json({ message, data });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
})

// Listar todas as frutas
router.get('/products', async (req, res) => {
    try {
        const { status, data } = await getProdutos();
        res.status(status).json(data);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Buscar fruta por ID
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { status, data } = await getProdutoById({ id });
    return res.status(status).json(data);
});

// Atualizar fruta
router.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, quantidade } = req.body;
    const { status, data } = await updateProduto({ id, nome, quantidade });
    res.status(status).json((data))
});

// Deletar fruta
router.delete('/products/:id', async (req, res) => {
    try {
        const { status, message } = await deleteProduto(req.params.id);
        res.status(status).json({ message });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Criar cupom
router.post('/coupons', async (req, res) => {
    try {
        const { codigo, valor, expiracao, tipo } = req.body;
        const { status, data } = await createCupom({ codigo, valor, expiracao, tipo });
        res.status(status).json(data);
    } catch (error) {
        console.error('Erro ao criar cupom:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/coupons', async (req, res) => {
    try {
        const { status, data } = await getCupons();
        res.status(status).json(data);
    } catch (error) {
        console.error('Erro ao buscar cupons:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/coupons/:id', async (req, res) => {
    try {
        const { status, data } = await getCupomById({ id: req.params.id });
        res.status(status).json(data);
    } catch (error) {
        console.error('Erro ao buscar cupom por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.post('/coupons/validate', async (req, res) => {
    try {
        const { codigo } = req.body;
        const { status, data } = await validarCupom({ codigo });
        res.status(status).json(data);
    } catch (error) {
        console.error('Erro ao validar cupom:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.test('/test', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});
module.exports = router;
