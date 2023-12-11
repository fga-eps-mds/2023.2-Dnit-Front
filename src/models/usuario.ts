import { Permissao } from "./auth";
import { EmpresaModel } from "./empresa";
import { PerfilModel } from "./perfil";
import { MunicipioData } from "./service";

export interface UsuarioDto {
    nome: string;
    permissoes: Permissao[];
}

export interface UsuarioModel {
    id: string;
    email: string;
    nome: string;
    empresa?: EmpresaModel;
    perfilId: string;
    perfil: PerfilModel;
    ufLotacao: number;
    municipio?: MunicipioData;
}

export interface ListarUsuariosQueryParams {
    pagina: number;
    itemsPorPagina: number;
    empresa?: string;
    total?: number;
    nome?: string;
    ufLotacao?: string;
    perfilId?: string;
    municipioId?: string
  }
  