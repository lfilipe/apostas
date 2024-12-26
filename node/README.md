# Super Apostas

Sistema de apostas em jogos de futebol que permite aos usuários fazerem palpites em partidas de diferentes competições.

## Funcionalidades

- Autenticação de usuários (login/cadastro)
- Listagem de competições
- Visualização de jogos por competição
- Sistema de apostas com odds
- Ranking de apostadores
- Interface responsiva

## Tecnologias Utilizadas

- React
- TypeScript
- Material-UI
- React Router
- React Query
- Axios
- JWT para autenticação

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/super-apostas.git
cd super-apostas
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto
- Adicione a URL da API:
```
VITE_API_URL=http://localhost:3001
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a versão de produção
- `npm run preview`: Visualiza a versão de produção localmente

## Estrutura do Projeto

```
src/
  components/         # Componentes reutilizáveis
  contexts/          # Contextos do React (ex: AuthContext)
  pages/             # Páginas da aplicação
    Auth/            # Páginas de autenticação
    Competitions/    # Páginas de competições
    Matches/         # Páginas de jogos
    Rankings/        # Página de ranking
  services/          # Serviços e configuração da API
  styles/            # Estilos globais
  types/            # Definições de tipos TypeScript
  App.tsx           # Componente principal
  main.tsx          # Ponto de entrada
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 