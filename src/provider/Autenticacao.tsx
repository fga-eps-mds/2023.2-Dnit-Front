import React, { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { AtualizarTokenDto, LoginResponse, Permissao } from "../models/auth";
import axios, { AxiosResponse } from "axios";
import { atualizarTokenUrl } from "../consts/service";

export enum AuthLocalStorage {
  Token = "Token",
  TokenAtualizacao = "TokenAtualizacao",
  ExpiraEm = "ExpiraEm",
  Permissoes = "Permissoes"
}

const PERMISSOES_SEPARATOR = ','

interface AuthContextType {
  login: (dados: LoginResponse) => void;
  logout: () => void;
  getAuth: () => boolean;
  getPermissoes: () => Permissao[];
  temPermissao: (permissao: Permissao) => boolean;
  setPermissoes: (permissoes: Permissao[]) => void,
}

export const AuthContext = createContext<AuthContextType>({
  login: () => { },
  logout: () => { },
  getAuth: () => false,
  getPermissoes: () => [],
  temPermissao: (_: Permissao) => false,
  setPermissoes: (_: Permissao[]) => {},
});

function setApiToken(token?: string | null) {
  axios.defaults.headers.common.Authorization = token;
}

export function setPermissoes(permissoes: Permissao[]) {
  localStorage.setItem(AuthLocalStorage.Permissoes, permissoes?.join(PERMISSOES_SEPARATOR) ?? "");
}

function salvarLogin(dados: LoginResponse) {
  localStorage.setItem(AuthLocalStorage.Token, dados.token);
  localStorage.setItem(AuthLocalStorage.TokenAtualizacao, dados.tokenAtualizacao);
  localStorage.setItem(AuthLocalStorage.ExpiraEm, dados.expiraEm);
  setPermissoes(dados.permissoes);
  setApiToken(dados.token);
}

function removerLogin() {
  Object.values(AuthLocalStorage).forEach(a => localStorage.removeItem(a));
  setApiToken(null);
}

async function atualizarToken() {
  const dados: AtualizarTokenDto = {
    token: localStorage.getItem(AuthLocalStorage.Token) ?? "",
    tokenAtualizacao: localStorage.getItem(AuthLocalStorage.TokenAtualizacao) ?? "",
  }
  const autenticacao: AxiosResponse<LoginResponse> = await axios.post(atualizarTokenUrl, dados);
  salvarLogin(autenticacao.data);
  return autenticacao.data.token;
}

export function configuraAutenticacaoAxios() {
  axios.interceptors.response.use((response) => response, async function (error) {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await atualizarToken();
        originalRequest.headers.Authorization = token;
        return axios(originalRequest);
      } catch {
        removerLogin();
        useNavigate()('/');
      }
    }
    return Promise.reject(error);
  });
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const getAuth = () => {
    let token = localStorage.getItem(AuthLocalStorage.Token);
    if (!!token && !axios.defaults.headers.common.Authorization) {
      setApiToken(token);
    }
    return !!token;
  };

  const login = (dados: LoginResponse) => {
    salvarLogin(dados);
    navigate("/home");
  };

  const logout = () => {
    removerLogin();
  };

  const getPermissoes = () => {
    return (localStorage.getItem(AuthLocalStorage.Permissoes)?.split(PERMISSOES_SEPARATOR) ?? []) as Permissao[];
  }

  const temPermissao = (permissao: Permissao) => {
    const temPermissaoSolicitada = getPermissoes().includes(permissao);
    if (!temPermissaoSolicitada) {
      console.error(`O usuário não tem a permissao ${permissao}. Permissões do usuário: ${getPermissoes()}`);
    }
    return temPermissaoSolicitada;
  };

  return (
    <AuthContext.Provider value={{ login, logout, getAuth, getPermissoes, temPermissao, setPermissoes }}>
      {children}
    </AuthContext.Provider>
  );
};
