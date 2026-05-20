# 🥗 NutriGuide - Wellness Hub

Plataforma web para gerenciamento de saúde, nutrição e hábitos saudáveis.

🌐 **[Live Demo](https://nutriguide-wellness-hub.vercel.app)**

## 🎯 Funcionalidades

- ✅ Autenticação segura com JWT
- 📊 Dashboard com métricas de saúde
- 🧮 Calculadoras (IMC, TMB, calorias)
- 📖 Blog educativo
- 🏆 Rastreamento de hábitos
- ♿ Painel de acessibilidade
- 📱 Design responsivo

## 🛠️ Tech Stack

**Frontend:** React 19 | TypeScript | Vite | Tailwind CSS  
**Backend:** Express | MongoDB | Mongoose | bcryptjs  
**Deploy:** Vercel

## ⚡ Quick Start

### Instalação
```bash
git clone https://github.com/gabrielsantosssssz/nutriguide-wellness-hub.git
cd nutriguide-wellness-hub
npm install
```

### Variáveis de Ambiente
```bash
cat > .env << EOF
VITE_API_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/nutriguide
JWT_SECRET=sua_chave_secreta
EOF
```

### Rodando
```bash
# Terminal 1 - Frontend (porta 5173)
npm run dev

# Terminal 2 - Backend (porta 3000)
cd api && npm install && node index.js
```

## 📖 Scripts

```bash
npm run build    # Build otimizado
npm run lint     # Verificar código
npm run preview  # Preview da build
```

## 🗂️ Estrutura

```
src/
├── pages/          # Login, Dashboard, Calculators, Blog, Habits, Profile
├── components/     # Header, Footer, AccessibilityPanel, ProtectedRoute
├── contexts/       # Auth, HealthData, Accessibility
├── services/       # API calls
└── types/         # TypeScript definitions

api/
├── routes/        # auth, users, metrics, habits, calculator
├── middleware/    # auth validation, error handling
└── database.js    # MongoDB config
```

## 🔐 Autenticação

- Registro: POST `/api/auth/registro`
- Login: POST `/api/auth/login`
- Senhas: Criptografadas com bcryptjs (10 rounds)
- Tokens: JWT armazenados em localStorage

## 🌐 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Fazer login |
| POST | `/api/auth/registro` | Criar conta |
| GET | `/api/usuarios/:id` | Dados do usuário |
| GET | `/api/metricas/:usuarioId` | Métricas de saúde |
| POST | `/api/metricas` | Registrar métrica |
| GET | `/api/habitos/:usuarioId` | Listar hábitos |
| POST | `/api/habitos` | Criar hábito |
| POST | `/api/calculadora/imc` | Calcular IMC |
| POST | `/api/calculadora/tmb` | Calcular TMB |

## 🚀 Deploy

Já configurado no Vercel. Para fazer deploy manual:

```bash
npm i -g vercel
vercel
```

**Variáveis obrigatórias em produção:**
- `MONGODB_URI`
- `JWT_SECRET`
- `BCRYPT_ROUNDS`

## 🔒 Segurança

- ✅ CORS configurado
- ✅ Senhas hasheadas (bcryptjs)
- ✅ JWT para autenticação
- ✅ Rotas protegidas
- ✅ Validação de entrada

## ♿ Acessibilidade

- Navegação por teclado
- Suporte a screen readers
- Painel de ajustes de contraste e fonte
- ARIA labels
- Cores com contraste adequado

## 📝 Tipos TypeScript

Projeto totalmente tipado com TypeScript 6.0.2

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit (`git commit -m 'Add: nova feature'`)
4. Push (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 👤 Autor

Gabriel Santos
gustavo augusto de souza 
everton correia 
gabriel pedroso 

 - [@gabrielsantosssssz](https://github.com/gabrielsantosssssz)

---

⭐ Se gostou, deixe uma star!
