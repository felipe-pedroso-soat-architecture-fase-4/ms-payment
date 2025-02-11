# order-manager-api

## Descrição do Projeto

Esta API é um projeto desenvolvido utilizando as melhores práticas de desenvolvimento de software, com foco em entregar uma solução de alta qualidade. O projeto adota a abordagem de **Domain-Driven Design (DDD)** para modelagem do domínio e **Arquitetura Hexagonal** para garantir um desacoplamento efetivo entre o núcleo da aplicação e suas interfaces externas.

Além disso, emprega-se a **Clean Architecture** para manter um código limpo e organizado, facilitando a manutenção e evolução do sistema. O design inclui a utilização de padrões de projeto como o **State Design Pattern** e o **Static Factory Method**, entre outros, para promover uma estrutura de código robusta e eficiente.

Estas práticas e padrões são aplicados para garantir a criação de uma API bem projetada, que é extensível e adaptável às necessidades futuras.

## Event-Storming e Estrutura do Projeto

Este projeto foi fundamentado no event-storming realizado na plataforma Lucid. Esse processo permitiu mapear e estruturar eventos de domínio cruciais, bem como identificar agregados e contextos delimitados, que são essenciais para a modelagem e organização da aplicação. 

Confira o diagrama detalhado em: [Lucidchart Event-Storming](https://lucid.app/lucidchart/edbd91cc-478d-4b5e-a72f-1013f450f952/view).

## Iniciando o Projeto

Para iniciar o projeto, você pode usar o Docker Compose para configurar e executar os serviços necessários. Siga estas etapas:

1. **Certifique-se de que o Docker e o Docker Compose estão instalados em seu sistema.**

2. **Clone o repositório do projeto:**
   ```bash
   git clone https://github.com/felipepxavier/order-manager-api.git
   cd order-manager-api
   ```

3. **Inicie os serviços** do projeto executando o comando Docker Compose:

    ```bash
    docker-compose up
    ```

4. **Acesse a API e a documentação** no seu navegador:

    - **API**: http://localhost:3000
    - **Documentação Swagger**: http://localhost:3000/api-docs


## Sobre Este Projeto

Este projeto faz parte da especialização em **Arquitetura de Software** da FIAP. Desenvolvido como parte do curso, ele utiliza práticas e padrões avançados de design de software.
