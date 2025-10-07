# 🎯 Sistema de Gerenciamento de Tarefas - Frontend

Uma aplicação web moderna e responsiva para gerenciamento de tarefas, desenvolvida com Next.js 15, React 19 e Ant Design.

## 🚀 Funcionalidades

### 📋 Gestão de Tarefas
- ✅ Listar todas as tarefas com informações detalhadas
- ✅ Visualizar detalhes completos de uma tarefa
- ✅ Criar nova tarefa com formulário intuitivo
- ✅ Editar tarefas existentes
- ✅ Excluir tarefas
- ✅ Filtrar tarefas por status
- ✅ Sistema de prioridades (Alta, Média, Baixa)

### 👥 Integração com Usuários
- ✅ Associar tarefas aos usuários responsáveis

### 🎨 Experiência do Usuário
- ✅ Design moderno com Ant Design
- ✅ Notificações toast para feedback
- ✅ Navegação intuitiva

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca para interfaces de usuário
- **Ant Design 5** - Biblioteca de componentes UI
- **Axios** - Cliente HTTP para requisições
- **React Toastify** - Sistema de notificações
- **CSS Modules** - Estilização com escopo local

## 📁 Estrutura do Projeto

```
Front-end-final/
├── src/
│   └── app/
│       ├── globals.css              # Estilos globais
│       ├── layout.js               # Layout principal
│       ├── page.jsx                # Página inicial (lista de tarefas)
│       ├── page.module.css         # Estilos da página inicial
│       ├── about/
│       │   ├── page.jsx            # Página sobre o projeto
│       │   └── about.module.css    # Estilos da página sobre
│       ├── completed/
│       │   ├── page.jsx            # Página de tarefas concluídas
│       │   └── completed.module.css # Estilos das tarefas concluídas
│       ├── create/
│       │   ├── page.jsx            # Formulário de criação de tarefa
│       │   └── create.module.css   # Estilos do formulário de criação
│       ├── edit/
│       │   └── [id]/
│       │       ├── page.jsx        # Formulário de edição de tarefa
│       │       └── edit.module.css # Estilos do formulário de edição
│       └── task/
│           └── [id]/
│               ├── page.jsx        # Detalhes da tarefa
│               └── task.module.css # Estilos dos detalhes
├── package.json                    # Dependências e scripts
├── next.config.mjs                 # Configuração do Next.js
├── tailwind.config.js              # Configuração do TailwindCSS
├── postcss.config.mjs              # Configuração do PostCSS
└── README.md                       # Documentação do projeto
```

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm, yarn ou pnpm
- API Backend rodando em `http://localhost:4000`

### 1. Clone o repositório
Abrir o terminal cmd e executar
git clone https://github.com/LuizGabrielLopes/Front-end-final.git
cd Front-end-final
```

### 2. Instale as dependências
Abrir o terminal cmd e executar
npm install
```

### 3. Configure a API
Certifique-se de que a API backend está rodando em `http://localhost:4000`

### 4. Execute o projeto

#### Desenvolvimento
Abrir o terminal cmd e executar
npm run dev

A aplicação estará disponível em `http://localhost:3000`

## 🎨 Páginas e Funcionalidades

### 🏠 Página Inicial (`/`)
- Lista todas as tarefas
- Cards informativos com estatísticas
- Botões para criar nova tarefa
- Navegação para outras seções

### ➕ Criar Tarefa (`/create`)
- Formulário completo para criação
- Campos: título, descrição, status, prioridade, responsável
- Validação de campos obrigatórios
- Feedback visual de sucesso/erro

### ✏️ Editar Tarefa (`/edit/[id]`)
- Formulário pré-preenchido com dados atuais
- Possibilidade de alterar todos os campos

### 👁️ Detalhes da Tarefa (`/task/[id]`)
- Visualização completa da tarefa
- Opções para editar ou excluir

### ✅ Tarefas Concluídas (`/completed`)
- Lista filtrada de tarefas concluídas
- Interface otimizada para visualização

### ℹ️ Sobre (`/about`)
- Informações sobre o projeto
- Tecnologias utilizadas
- Créditos do desenvolvedor

## 🎯 Status das Tarefas

- **Pendente** - Tarefa criada mas não iniciada
- **Em andamento** - Tarefa sendo executada  
- **Concluído** - Tarefa finalizada

## 🔥 Níveis de Prioridade

- **Alta** - Prioridade alta
- **Média** - Prioridade moderada
- **Baixa** - Prioridade mínima

## 🔗 Integração com Backend

A aplicação se conecta com a API backend através dos seguintes endpoints:

- `GET /api/task` - Listar tarefas
- `GET /api/task/:id` - Buscar tarefa por ID
- `POST /api/task` - Criar nova tarefa
- `PUT /api/task/:id` - Atualizar tarefa
- `DELETE /api/task/:id` - Deletar tarefa
- `GET /api/users` - Listar usuários

## 🎨 Design System

### Cores Principais
- Azul primário: `#1e40af`
- Verde sucesso: `#10b981`
- Vermelho erro: `#ef4444`
- Cinza neutro: `#6b7280`

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Luiz Gabriel Lopes**
- GitHub: [@LuizGabrielLopes](https://github.com/LuizGabrielLopes)

## 🔗 Repositórios Relacionados

- **Backend API**: [Back-End-final](https://github.com/LuizGabrielLopes/Back-End-final)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
