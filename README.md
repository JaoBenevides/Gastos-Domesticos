# Gestão de Gastos Domésticos

Aplicação web para controlar gastos mensais de uma residência, visualizar o orçamento e acompanhar a distribuição dos gastos por categoria.

## 📌 Objetivo

O projeto permite registrar despesas do dia a dia, como moradia, alimentação, transporte, saúde, educação, lazer e outros, além de manter um orçamento mensal e mostrar o saldo disponível em tempo real.

## ✨ Funcionalidades

- Cadastro de gastos com descrição, valor, categoria e data
- Atualização automática do total gasto
- Definição do orçamento mensal
- Cálculo do saldo disponível
- Indicador percentual de uso do orçamento
- Agrupamento dos gastos por categoria
- Filtro por categoria na tabela de lançamentos
- Remoção individual de itens ou limpeza de todos os lançamentos
- Persistência em localStorage para manter os dados no navegador

## 🧩 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- Bootstrap 5

## 📁 Estrutura do projeto

```text
Gastos-Domesticos/
├── index.html
├── src/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── README.md
└── .git/
```

## ▶️ Como executar

1. Abra a pasta do projeto no VS Code.
2. Inicie um servidor local em vez de abrir o arquivo diretamente no navegador, por exemplo:

```bash
python -m http.server 8000
```

3. Acesse no navegador:

```text
http://localhost:8000
```

> O projeto foi desenvolvido como uma aplicação front-end simples, então o uso de um servidor local facilita o carregamento dos módulos do JavaScript.

## 📝 Observações

- Os dados ficam salvos no navegador através do localStorage.
- O app é focado em uso local e não possui backend ou banco de dados.
- A interface é responsiva e adequada para uso em desktop e mobile.

## 👨‍💻 Autor

Projeto desenvolvido para fins de avaliação e prática de front-end.
