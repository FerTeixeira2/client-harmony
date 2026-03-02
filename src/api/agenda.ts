import { apiFetch } from "./client";

export interface AgendaDto {
  id: string;
  pessoaId: string;
  titulo: string;
  descricao?: string | null;
  dataAgenda: string;
  horarioInicio: string;
  horarioFim: string;
  dataCadastro: string;
  dataAtualizacao?: string | null;
}

const BASE = "/api/agenda";

export async function fetchAgendasPorPeriodo(
  dataInicio: string,
  dataFim: string
): Promise<AgendaDto[]> {
  const params = new URLSearchParams({
    dataInicio,
    dataFim,
  });

  return apiFetch<AgendaDto[]>(`${BASE}/periodo?${params.toString()}`);
}

export interface CreateAgendaInput {
  pessoaId: string;
  titulo: string;
  descricao?: string;
  dataAgenda: string;
  horarioInicio: string;
  horarioFim: string;
}

export type UpdateAgendaInput = Omit<CreateAgendaInput, "pessoaId">;

export async function createAgenda(
  input: CreateAgendaInput
): Promise<AgendaDto> {
  return apiFetch<AgendaDto>(BASE, {
    method: "POST",
    body: JSON.stringify({
      pessoaId: input.pessoaId,
      titulo: input.titulo,
      descricao: input.descricao,
      dataAgenda: input.dataAgenda,
      horarioInicio: input.horarioInicio,
      horarioFim: input.horarioFim,
    }),
  });
}

export async function updateAgenda(
  id: string,
  input: UpdateAgendaInput
): Promise<AgendaDto> {
  return apiFetch<AgendaDto>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      titulo: input.titulo,
      descricao: input.descricao,
      dataAgenda: input.dataAgenda,
      horarioInicio: input.horarioInicio,
      horarioFim: input.horarioFim,
    }),
  });
}

export async function deleteAgenda(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export async function fetchAgendasPorPessoa(pessoaId: string): Promise<AgendaDto[]> {
  return apiFetch<AgendaDto[]>(`${BASE}/pessoa/${pessoaId}`);
}


