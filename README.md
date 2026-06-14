# SaveUp Front-end

Aplicação front-end do projeto **SaveUp**, desenvolvida em Angular como parte do meu TCC. Este módulo é responsável pela interface do usuário, navegação entre telas, consumo da API e apresentação dos dados financeiros do sistema.

## Visão geral

O front-end foi construído em Angular, enquanto o back-end do projeto utiliza Java com Quarkus. A aplicação foi pensada para gerenciamento financeiro pessoal, com telas de dashboard, ganhos, gastos, relatórios e componentes de layout como sidebar, topbar e modais.

## Tecnologias utilizadas

- Angular
- TypeScript
- Angular Material
- HTML5
- CSS3
- RxJS

## Funcionalidades principais

- Autenticação de usuário.
- Dashboard com visão geral financeira.
- Cadastro, listagem, edição e exclusão de gastos.
- Cadastro, listagem, edição e exclusão de ganhos.
- Emissão e histórico de relatórios.
- Layout responsivo com sidebar, topbar e modais visuais.

## Estrutura do projeto

```bash
src/
 ├── app/
 │   ├── core/
 │   ├── shared/
 │   ├── layout/
 │   ├── dashboard/
 │   ├── expenses/
 │   ├── gains/
 │   ├── reports/
 │   └── ...
 ├── assets/
 └── styles.css
```

## Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- Angular CLI instalado globalmente.
- Back-end da aplicação em execução para integração com a API.

### Instalação

```bash
npm install
```

### Execução em ambiente de desenvolvimento

```bash
ng serve
```

Após iniciar, a aplicação ficará disponível em:

```bash
http://localhost:4200
```

## Build para produção

```bash
ng build
```

Os arquivos gerados ficarão na pasta de saída configurada pelo Angular.

## Responsividade e interface

O projeto contempla estilo para melhorar a experiência em desktop, tablet e celular. Também foram trabalhados estados visuais de modal, blur de fundo, tabela com rolagem horizontal em telas pequenas e adaptação de cards, filtros e formulários para uso mobile.

## Integração com back-end

O front-end consome os dados da API do sistema, cuja camada de servidor foi desenvolvida em Java com Quarkus. Para o funcionamento completo da aplicação, o back-end deve estar configurado e em execução.

## Objetivo acadêmico

O foco da aplicação é oferecer uma interface organizada, moderna e acessível para o controle de finanças pessoais.

## Melhorias futuras

- Aprimorar acessibilidade.
- Expandir testes automatizados.
- Evoluir componentes reutilizáveis.
- Refinar ainda mais a experiência mobile.
- Integrar novos relatórios e indicadores financeiros.
