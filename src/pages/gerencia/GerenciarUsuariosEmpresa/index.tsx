import { notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { UsuarioModel } from "../../../models/usuario";
import Header from "../../../components/Header";
import Table, { CustomTableRow } from "../../../components/Table";
import Footer from "../../../components/Footer";
import { fetchEmpresa, fetchUsuariosEmpresa } from "../../../service/empresaApi";
import TrilhaDeNavegacao from "../../../components/Navegacao";
import InputFilter from "../../../components/InputFilter";
import ReactLoading from "react-loading";
import { useParams } from "react-router-dom";
import { FilterOptions } from "../GerenciarUsuario";
import { fetchUnidadeFederativa } from "../../../service/escolaApi";
import { fetchPerfis } from "../../../service/usuarioApi";
import Select from "../../../components/Select";
import RemoverUsuarioEmpresaDialog from "../../../components/RemoverUsuarioEmpresaDialog";
import { AuthContext } from "../../../provider/Autenticacao";
import { Permissao } from "../../../models/auth";
import { ButtonComponent } from "../../../components/Button";
import AdicionarUsuarioDialog from "../../../components/AdicionarUsuarioDialog";

interface RemoverUsuarioEmpresaArgs {
  cnpj: string | undefined;
  nomeUsuario: string;
  usuarioId: string;
}

interface AdicionarUsuarioEmpresaArgs {
  cnpj: string | undefined;
}

export default function GerenciarUsuariosEmpresa() {
    const { cnpj } = useParams();
    const paginas = [{nome: "Gerenciar Empresas", link: "/gerenciarEmpresas"}, 
        {nome: "Usuarios", link: "/gerenciarUsuariosEmpresa"}];
    const [notificationApi, notificationContextHandler] = notification.useNotification();
    const [loading, setLoading] = useState(false);
    const [showRemover, setShowRemover] = useState<RemoverUsuarioEmpresaArgs | null>(null);
    const [showAdicionar, setShowAdicionar] = useState<AdicionarUsuarioEmpresaArgs | null>(null);
    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [listaUsuarios, setListaUsuarios] = useState<UsuarioModel[]>([]);
    const [nome, setNome] = useState('');
    const [uf, setUf] = useState('');
    const [perfil, setPerfil] = useState('');
    const [listaUfs, setListaUfs] = useState<FilterOptions[]>([]);
    const [listaPerfis, setListaPerfis] = useState<FilterOptions[]>([]);
    const { temPermissao } = useContext(AuthContext);
    const tamanhoPagina = 20;
    
    const buscarUsuariosEmpresa = () => {
        if (cnpj) {
            setLoading(true);
            fetchUsuariosEmpresa(cnpj, {pagina: 1, itemsPorPagina: tamanhoPagina, nome: nome, ufLotacao: uf, perfilId: perfil})
            .then(u => setListaUsuarios(u.items))
            .catch(error => notificationApi.error({ message: 'Falha na listagem de usuários. ' + (error?.response?.data || '') }))
            .finally(() => setLoading(false));
        }
    }

    async function buscarEmpresa(cnpj : string) {
        const empresa = await fetchEmpresa(cnpj);
        setNomeEmpresa(empresa.razaoSocial);
    }

    async function fetchUf(): Promise<void> {
      const listaUfs = await fetchUnidadeFederativa();
      const novaUf = listaUfs.map((u) => ({ id: '' + u.id, rotulo: u.sigla }));
      setListaUfs(novaUf);
    }

    async function fetchPerfil(pagina: number, tamanhoPagina: number, nome: string): Promise<void> {
      const listaPerfis = await fetchPerfis(pagina, tamanhoPagina, nome);
      const novoPerfil = listaPerfis.map((u) => ({ id: u.id, rotulo: u.nome }));
      setListaPerfis(novoPerfil);
    }
    
    function procuraRotuloUf(usuario: UsuarioModel) {
      return listaUfs.find((uf) => uf.id === '' + usuario.ufLotacao)?.rotulo;
    }

    const onUsuarioChange = (changed: boolean) => {
      if (changed) buscarUsuariosEmpresa();
    }

    useEffect(() => {
        buscarUsuariosEmpresa();
    }, [nome, uf, perfil]);

    useEffect(() => {
      fetchUf();
      fetchPerfil(1, 100, '');
    }, []);

    useEffect(() => {
      if (cnpj) {
        buscarEmpresa(cnpj);
      }
    }, []);

    return (
        <div className="App">
          {notificationContextHandler}
          {showRemover && <RemoverUsuarioEmpresaDialog cnpj={showRemover.cnpj} usuarioid={showRemover.usuarioId} 
            nomeEmpresa={nomeEmpresa} nomeUsuario={showRemover.nomeUsuario} closeDialog={(removed) => {setShowRemover(null); onUsuarioChange(removed)}}/>}
            {showAdicionar && <AdicionarUsuarioDialog cnpj={showAdicionar.cnpj} nomeEmpresa={nomeEmpresa} closeDialog={(added) => {setShowAdicionar(null); onUsuarioChange(added)}}/>}
          <Header />
          <TrilhaDeNavegacao elementosLi={paginas} />
          <div className="d-flex flex-column m-5">
            <div className="d-flex justify-content-between align-items-center mr-5">
                <InputFilter onChange={setNome} dataTestId="filtroNome" label="Nome" placeholder="Nome"/>
                <Select items={listaUfs} value={uf} label={"UF:"} onChange={setUf} dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true}/>
                <Select items={listaPerfis} value={perfil} label={"Perfil:"} onChange={setPerfil} dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true}/>
                {temPermissao(Permissao.EmpresaGerenciarUsuarios) && <ButtonComponent label="Adicionar Usuário" buttonStyle="primary" onClick={() => setShowAdicionar({cnpj})}></ButtonComponent>}
            </div>
            {listaUsuarios.length === 0 && <Table columsTitle={['Nome', 'Tipo de Perfil', 'UF', 'E-mail']} initialItemsPerPage={10} title="Usuários cadastrados"><></><></></Table>}
    
            <Table columsTitle={['Nome', 'Tipo de Perfil', 'UF', 'E-mail']} initialItemsPerPage={10} title="Usuários cadastrados">
              {
                listaUsuarios.map((usuario, index) =>
                  <CustomTableRow key={`${usuario.id}-${index}`} id={index}
                    data={{ '0': usuario.nome, '1': `${temPermissao(Permissao.PerfilVisualizar) ? usuario.perfil.nome : ""}`, '2': `${procuraRotuloUf(usuario)}`, '3': `${usuario.email}`}}
                    hideEditIcon={true}
                    hideEyeIcon={true}
                    hideTrashIcon={!temPermissao(Permissao.EmpresaGerenciarUsuarios)}
                    onDeleteRow={() => setShowRemover({
                      cnpj: cnpj, nomeUsuario: usuario.nome, usuarioId: usuario.id
                    })}
                    />
                )
              }
            </Table>
            {loading && <div className="d-flex justify-content-center w-100 m-5"><ReactLoading type="spinningBubbles" color="#000000" /></div>}
          </div>
          <Footer />
        </div>
      )
}