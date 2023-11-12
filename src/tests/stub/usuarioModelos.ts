import { Permissao, PermissaoCategoria, PermissaoModel, TipoPerfil } from "../../models/auth";
import { PerfilModel } from "../../models/perfil";
import { UsuarioModel } from "../../models/usuario";


const permissao: PermissaoModel = {
  codigo: Permissao.EmpresaCadastrar,
  descricao: "descreve"
}

const categoria: PermissaoCategoria = {
  categoria: "categoria a",
  permissoes: [permissao]
}

const perfil: PerfilModel = {
  id: "0",
  nome: "perfil0",
  permissoes: [permissao],
  quantidadeUsuarios: 5,
  tipo: TipoPerfil.Basico,
  categoriasPermissao: [categoria]
};

export const usuarios: UsuarioModel[] = [
  {
    id: "0",
    empresas: [],
    email: "Teste@email.com",
    nome: "usuario0",
    ufLotacao: 1,
    perfilId: "id0",
    perfil: perfil,
    municipio: 10
  },
  {
    id: "1",
    empresas: [],
    email: "Teste1@email.com",
    nome: "usuario1",
    ufLotacao: 27,
    perfilId: "id1",
    perfil: perfil,
    municipio: 1
  }
]