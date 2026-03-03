# Client-Harmony 🚀

[cite_start]O **Client-Harmony** é um sistema completo de gerenciamento de clientes e agenda, desenvolvido com foco em escalabilidade e organização[cite: 3, 4]. [cite_start]O projeto utiliza uma arquitetura moderna separando claramente o backend (.NET API) e o frontend (React)[cite: 3].

---

## 🏛️ Arquitetura do Sistema

### Backend (.NET API)
[cite_start]O backend foi construído seguindo os princípios de **Clean Architecture**, dividido em camadas para garantir a separação de responsabilidades[cite: 6, 10]:

* [cite_start]**API**: Concentra os endpoints HTTP e Controllers que não possuem regras de negócio, apenas delegando chamadas para a camada de aplicação[cite: 11, 13, 14, 15].
* [cite_start]**Application**: Camada onde residem as regras de negócio, serviços, DTOs para segurança e validadores[cite: 23, 25, 26, 28, 33].
* [cite_start]**Domain**: O coração do sistema, contendo as entidades principais (`Pessoa`, `Endereco`, `Telefone`), interfaces e exceções de negócio, sem dependências externas[cite: 36, 39, 41, 42].
* **Infrastructure**: Responsável pela persistência de dados, configurações do Entity Framework e implementação dos repositórios.

### Frontend (React)
[cite_start]A interface foi organizada utilizando uma **Arquitetura Baseada em Features**, o que facilita a escalabilidade e modularidade[cite: 44, 49]:

* [cite_start]**Organização por Domínio**: Componentes, páginas e serviços são agrupados por funcionalidades como `Customers` e `Agenda`[cite: 45, 46, 47, 50].
* [cite_start]**UI Modular**: Componentes reutilizáveis como `CustomerTable`, `Calendar` (Dia/Semana/Mês) e `Modais`[cite: 58, 59, 61].
* **Hooks Customizados**: Utilização de hooks como `useCustomers` e `useViaCep` para gestão de estado e chamadas de API.

---

## 💾 Banco de Dados (SQL Server)

[cite_start]O projeto utiliza o **SQL Server** com uma estrutura relacional sólida e automações via triggers[cite: 87, 119]:

* [cite_start]**Integridade**: Relacionamentos de chave estrangeira garantem que endereços e telefones estejam sempre vinculados a uma pessoa existente[cite: 98, 104].
* [cite_start]**Auditoria Automática**: Triggers registram automaticamente histórico de inserção, atualização e desativação na tabela de pessoas[cite: 128, 129, 130, 131, 132].
* [cite_start]**Regra de Exclusão**: Implementação de *soft delete* onde o registro é marcado como "Desativado" e removido definitivamente após 30 dias por uma procedure[cite: 136, 138, 139, 140].
* [cite_start]**Validação de Agenda**: Controle rigoroso de horários, impedindo que o horário final de um evento seja menor que o inicial[cite: 116, 117].

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
| :--- | :--- |
| **Backend** | .NET 8, ASP.NET Core API, Entity Framework Core |
| **Frontend** | React, TypeScript, i18next (Internacionalização) |
| **Banco de Dados** | [cite_start]SQL Server (Triggers, Procedures, Chaves Estrangeiras) [cite: 87, 119, 139] |
| **DevOps** | Docker, Dockerfile |

---

## 🔄 Fluxo de Dados

1. [cite_start]O usuário interage com um componente **React**[cite: 67].
2. [cite_start]O componente aciona um **Service** no frontend que faz a requisição à API[cite: 68, 69].
3. [cite_start]O **Controller** recebe a requisição e chama o **Service da Application**[cite: 70, 71].
4. [cite_start]A **Regra de Negócio** é aplicada e os dados são persistidos no banco[cite: 72, 73].
5. [cite_start]Um **Middleware Global** captura qualquer erro durante o processo para garantir uma resposta padronizada[cite: 17, 18, 19].

---

## 🚀 Como Executar

### Pré-requisitos
* .NET SDK 8.0+
* Node.js & npm
* SQL Server

### Passos
1. **Clone o repositório**
2. **Configuração do Banco**: Ajuste a Connection String no `appsettings.json` da camada API.
3. **Rodar o Backend**:
   ```bash
   cd backend/src/MyApp.Api
   dotnet run
4.**Rodar o FronEnd**
    npm install
    npm start
