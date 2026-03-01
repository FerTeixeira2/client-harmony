export const translations = {
  pt: {
    // Sidebar
    sidebarTitle: "Gestão de Clientes",
    sidebarSubtitle: "Sistema de Cadastro",
    registerCustomer: "Cadastrar Cliente",
    searchCep: "Pesquisar CEP",

    // Header
    admin: "Administrador",
    logout: "Sair",

    // Dashboard
    dashboard: "Dashboard",
    dashboardSubtitle: "Gerencie os clientes do sistema",
    list: "Listagem",
    charts: "Gráficos",

    // Stats
    totalCustomers: "Total de Clientes",
    withEmail: "Com E-mail",
    states: "Estados",
    registeredToday: "Cadastros Hoje",

    // Table columns
    photo: "Foto",
    name: "Nome",
    email: "Email",
    phone: "Telefone",
    cpf: "CPF",
    cityState: "Cidade/UF",
    registrationDate: "Cadastro",
    actions: "Ações",
    searchPlaceholder: "Pesquisar por nome ou email",
    noCustomersFound: "Nenhum cliente encontrado",
    showing: "Mostrando",
    of: "de",
    customers: "clientes",

    // Charts
    emailStatus: "Status de Email",
    customersByState: "Clientes por Estado",
    customersByCity: "Clientes por Cidade",
    registrationsByMonth: "Cadastros por Mês",
    withEmailLabel: "Com Email",
    withoutEmailLabel: "Sem Email",
    noDataCharts: "Cadastre clientes para visualizar os gráficos",

    // Modal
    editCustomer: "Editar Cliente",
    createCustomer: "Cadastrar Cliente",
    selectPhoto: "Selecionar foto",
    photoFormats: "JPG, PNG ou GIF. Max 5MB.",
    fullName: "Nome completo",
    emailPlaceholder: "email@exemplo.com",
    phonePlaceholder: "(00) 00000-0000",
    cpfPlaceholder: "000.000.000-00",
    address: "Endereço",
    cepPlaceholder: "00000-000",
    street: "Logradouro",
    streetPlaceholder: "Rua, Avenida...",
    number: "Número",
    complement: "Complemento",
    complementPlaceholder: "Apto, Bloco...",
    neighborhood: "Bairro",
    city: "Cidade",
    state: "Estado",
    location: "Localização",
    cancel: "Cancelar",
    save: "Salvar",
    register: "Cadastrar",
    addressFound: "Endereço encontrado!",
    cepNotFound: "CEP não encontrado",
    requiredFields: "Preencha os campos obrigatórios: Nome, Email e CPF",
    customerUpdated: "Cliente atualizado!",
    customerCreated: "Cliente cadastrado!",
    errorSaving: "Erro ao salvar. Tente novamente.",

    // View
    customerDetails: "Detalhes do Cliente",
    registration: "Cadastro",
    update: "Atualização",

    // Delete
    confirmDeletion: "Confirmar exclusão",
    confirmDeletionMsg: "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.",
    delete: "Excluir",

    // CEP Search
    backToDashboard: "Voltar ao Dashboard",
    searchCepTitle: "Pesquisar CEP",
    searchCepSubtitle: "Consulte endereços usando a API ViaCEP",
    search: "Buscar",
    addressFoundTitle: "Endereço Encontrado",
    cepInvalid: "CEP inválido ou não encontrado",
    cepFound: "CEP encontrado!",
  },
  en: {
    // Sidebar
    sidebarTitle: "Customer Management",
    sidebarSubtitle: "Registration System",
    registerCustomer: "Register Customer",
    searchCep: "Search ZIP Code",

    // Header
    admin: "Administrator",
    logout: "Logout",

    // Dashboard
    dashboard: "Dashboard",
    dashboardSubtitle: "Manage system customers",
    list: "List",
    charts: "Charts",

    // Stats
    totalCustomers: "Total Customers",
    withEmail: "With Email",
    states: "States",
    registeredToday: "Registered Today",

    // Table columns
    photo: "Photo",
    name: "Name",
    email: "Email",
    phone: "Phone",
    cpf: "CPF",
    cityState: "City/State",
    registrationDate: "Registered",
    actions: "Actions",
    searchPlaceholder: "Search by name or email",
    noCustomersFound: "No customers found",
    showing: "Showing",
    of: "of",
    customers: "customers",

    // Charts
    emailStatus: "Email Status",
    customersByState: "Customers by State",
    customersByCity: "Customers by City",
    registrationsByMonth: "Registrations by Month",
    withEmailLabel: "With Email",
    withoutEmailLabel: "Without Email",
    noDataCharts: "Register customers to view charts",

    // Modal
    editCustomer: "Edit Customer",
    createCustomer: "Register Customer",
    selectPhoto: "Select photo",
    photoFormats: "JPG, PNG or GIF. Max 5MB.",
    fullName: "Full name",
    emailPlaceholder: "email@example.com",
    phonePlaceholder: "(00) 00000-0000",
    cpfPlaceholder: "000.000.000-00",
    address: "Address",
    cepPlaceholder: "00000-000",
    street: "Street",
    streetPlaceholder: "Street, Avenue...",
    number: "Number",
    complement: "Complement",
    complementPlaceholder: "Apt, Block...",
    neighborhood: "Neighborhood",
    city: "City",
    state: "State",
    location: "Location",
    cancel: "Cancel",
    save: "Save",
    register: "Register",
    addressFound: "Address found!",
    cepNotFound: "ZIP code not found",
    requiredFields: "Fill in the required fields: Name, Email and CPF",
    customerUpdated: "Customer updated!",
    customerCreated: "Customer registered!",
    errorSaving: "Error saving. Please try again.",

    // View
    customerDetails: "Customer Details",
    registration: "Registered",
    update: "Updated",

    // Delete
    confirmDeletion: "Confirm deletion",
    confirmDeletionMsg: "Are you sure you want to delete this customer? This action cannot be undone.",
    delete: "Delete",

    // CEP Search
    backToDashboard: "Back to Dashboard",
    searchCepTitle: "Search ZIP Code",
    searchCepSubtitle: "Look up addresses using the ViaCEP API",
    search: "Search",
    addressFoundTitle: "Address Found",
    cepInvalid: "Invalid or not found ZIP code",
    cepFound: "ZIP code found!",
  },
} as const;

export type Lang = keyof typeof translations;
export type Translations = (typeof translations)[Lang];
