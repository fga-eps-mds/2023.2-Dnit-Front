export enum Permissao {
  EscolaCadastrar = "EscolaCadastrar",
  EscolaEditar = "EscolaEditar",
  EscolaRemover = "EscolaRemover",
  EscolaVisualizar = "EscolaVisualizar",
  EscolaExportar = "EscolaExportar",
  
  PerfilCadastrar = "PerfilCadastrar",
  PerfilEditar = "PerfilEditar",
  PerfilRemover = "PerfilRemover",
  PerfilVisualizar = "PerfilVisualizar",
  
  UpsCalcularSinistro = "UpsCalcularSinistro",
  UpsCalcularEscola = "UpsCalcularEscola",
  RanqueVisualizar = "RanqueVisualizar",
  RanqueExportar = "RanqueExportar",

  UsuarioCadastrar = "UsuarioCadastrar",
  UsuarioVisualizar = "UsuarioVisualizar",
  UsuarioEditar = "UsuarioEditar",
  UsuarioRemover = "UsuarioRemover",
  UsuarioPerfilEditar = "UsuarioPerfilEditar",

  RodoviaCadastrar = "RodoviaCadastrar",

  SinistroCadastrar = "SinistroCadastrar",

  SolicitacaoVisualizar = "SolicitacaoVisualizar",

  EmpresaGerenciar = "EmpresaGerenciar",
  EmpresaCadastrar = "EmpresaCadastrar",
  EmpresaVisualizar = "EmpresaVisualizar",
  EmpresaEditar = "EmpresaEditar",
  EmpresaRemover = "EmpresaRemover",
  EmpresaGerenciarUsuarios = "EmpresaGerenciarUsuarios",
  EmpresaVisualizarUsuarios = "EmpresaVisualizarUsuarios",

  PoloCadastrar = "PoloCadastrar",
  PoloVisualizar = "PoloVisualizar",
  PoloEditar = "PoloEditar",
  PoloRemover = "PoloRemover",
}

export enum TipoPerfil {
  Basico = "Basico",
  Administrador = "Administrador",
  Customizavel = "Customizavel",
}

export interface LoginResponse {
  token: string;
  tokenAtualizacao: string;
  expiraEm: string;
  permissoes: Permissao[];
}

export interface AtualizarTokenDto {
  token: string;
  tokenAtualizacao: string;
}

export interface PermissaoCategoria{
  categoria: string;
  permissoes: PermissaoModel[];
}

export interface PermissaoModel {
  codigo: Permissao;
  descricao: string;
}
