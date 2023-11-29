import { useContext, useEffect, useState } from "react";
import "../../../styles/App.css";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import TrilhaDeNavegacao from "../../../components/Navegacao";
import Table, { CustomTableRow } from "../../../components/Table";
import { EmpresaModel, ListaPaginada } from "../../../models/empresa";
import EditarEmpresasDialog from "../../../components/EditarEmpresaDialog";
import { fetchEmpresas } from "../../../service/empresaApi";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../provider/Autenticacao";
import { Permissao } from "../../../models/auth";
import InputFilter from "../../../components/InputFilter";
import { ButtonComponent } from "../../../components/Button";
import DeletarEmpresaDialog, { DeletarEmpresaDialogArgs } from "../../../components/DeletarEmpresaDialog";
import { FilterOptions } from "../GerenciarUsuario";
import {fetchMunicipio, fetchUnidadeFederativa} from "../../../service/escolaApi";
import MultiSelect from "../../../components/MultiSelect";
import Select, {SelectItem} from "../../../components/Select";

interface EmpresaDialogArgs {
  id: string | null;
  readOnly: boolean;
}

export default function GerenciarEmpresas() {
    const paginas = [{nome: "Gerenciar Polos", link: "/gerenciarPolos"}];
    const [nome, setNome] = useState('');
    const [ufs, setufs] = useState<string[]>([]);
    const [uf, setuf] = useState<SelectItem | null>(null);
    const [cep, setCep] = useState('');
    const [municipio, setMunicipio] = useState<SelectItem | null>(null);
    const [municipios, setMunicipios] = useState<SelectItem[]>([]);
    // TODO: criar poloModel
    const [pagina, setPagina] = useState<ListaPaginada<EmpresaModel>>({items: [], pagina: 1, itemsPorPagina: 10, total: 0, totalPaginas: 0});

    // TODO:
    const [listaEmpresas, setListaEmpresas] = useState<EmpresaModel[]>(pagina.items);
    const [showEmpresa, setShowEmpresa] = useState<EmpresaDialogArgs | null>(null);
    const [showDeleteEmpresa, setShowDeleteEmpresa] = useState<DeletarEmpresaDialogArgs | null>(null);

    const [razaoSocial, setRazaoSocial] = useState('');
	const [cnpj, setCnpj] = useState('');
	const [listaUfs, setListaUfs] = useState<FilterOptions[]>([]);
	const [tamanhoPagina, setTamanhoPagina] = useState(pagina.itemsPorPagina);
	const [notificationApi, notificationContextHandler] = notification.useNotification();

	const navigate = useNavigate();

	const { temPermissao } = useContext(AuthContext);

    // TODO: permissões polos
	const temPermissaoGerenciar = {
		cadastrar: temPermissao(Permissao.EmpresaCadastrar),
		visualizar: temPermissao(Permissao.EmpresaVisualizar),
		remover: temPermissao(Permissao.EmpresaRemover),
		editar: temPermissao(Permissao.EmpresaEditar),
		visualizarUsuarios: temPermissao(Permissao.EmpresaVisualizarUsuarios)
	}

	const ufParams = () => {
		return ufs.join(",");
	}

	const buscarEmpresas = (proximaPagina: number, novoTamanhoPagina: number = tamanhoPagina) => {
		fetchEmpresas(proximaPagina, novoTamanhoPagina, razaoSocial, cnpj, ufParams())
			.then(pagina => {
				setPagina(pagina)
				setListaEmpresas(pagina.items)
				setTamanhoPagina(pagina.itemsPorPagina)
			})
			.catch(error => notificationApi.error({ message: 'Falha na listagem de empresas. ' + (error?.response?.data || '') }))
	}

	async function fetchUf(): Promise<void> {
		const listaUfs = await fetchUnidadeFederativa();
		const novaUf = listaUfs.map((u) => ({ id: '' + u.id, rotulo: u.sigla }));
		setListaUfs(novaUf);
	}

	const onEmpresaChange = (changed: boolean) => {
		if (changed) buscarEmpresas(1);
	}

	useEffect(() => {
		buscarEmpresas(1);
	  }, [razaoSocial, cnpj, ufs]);

	useEffect(() => {
		fetchUf();
	}, []);

	useEffect(() => {
	if (!temPermissao(Permissao.EmpresaVisualizar)) {
	  navigate("/dashboard");
	}
	}, []);


    useEffect(() => {
        if (!uf?.id) {
            return;
        }
        fetchMunicipio(Number(uf.id)).then(municipios => setMunicipios(municipios.map(m => ({ id: m.id.toString(), rotulo: m.nome }))))
    }, [uf]);

    return (
		<div className="App">
			{notificationContextHandler}
			<Header/>
			<TrilhaDeNavegacao elementosLi={paginas}/>
			<div className="d-flex flex-column m-5">
				<div className="d-flex justify-content-left align-items-center mr-5">
					<InputFilter onChange={setNome} dataTestId="filtroNome" label="Nome" placeholder="Nome" />
					<InputFilter onChange={setCep} dataTestId="filtroCep" label="CEP" placeholder="CEP" />
                    <Select items={listaUfs} value={uf?.id || ''} label={"UF:"}
                            dropdownStyle={{ marginLeft: "20px", width: "260px" }}
                            onChange={id => setuf(listaUfs.find(u => u.id == id) || null)}
                            filtrarTodos={true}/>
                    <Select items={municipios} value={municipio?.id || ''} label={"Municípios:"}
                            onChange={id => setMunicipio(municipios.find(m => m.id == id) || null)}
                            dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true} />
					<ButtonComponent label="Cadastrar Polo" buttonStyle="primary" ></ButtonComponent>
        		</div>
				{listaEmpresas.length === 0 && <Table columsTitle={["Razão Social", "CNPJ", "UFs"]} initialItemsPerPage={10} title="Empresas Cadastradas"><></><></></Table>}
				<Table 
					title="Polos cadastrados"
					columsTitle={["Nome", "Endereço", "UF", "Município", "CEP"]}
					totalPages={pagina.totalPaginas}
					totalItems={pagina.total}
					initialItemsPerPage={pagina.itemsPorPagina}
					onNextPage={() => {
						if (pagina.pagina === pagina.totalPaginas) return;
						buscarEmpresas(pagina.pagina + 1);
					}}
					onPreviousPage={() => {
						if (pagina.pagina === 1) return;
						buscarEmpresas(pagina.pagina - 1);
					}}
					onPageResize={(newItensPerPage) => {
						buscarEmpresas(pagina.pagina, newItensPerPage);
					}}
					onPageSelect={(newSelectedPage) => {
						buscarEmpresas(newSelectedPage);
					}}
				>
					{
						listaEmpresas.map((empresa, index) => (
							<CustomTableRow
								key={`${empresa.cnpj}`} id={index}
								data={{'0': empresa.razaoSocial, '1': formatCnpj(empresa.cnpj),
									'2': empresa.uFs.length === 27 ? "Todas" : empresa.uFs.map((e) => e.sigla).join(', ')}}
								onEditRow={() => {
									// setEmpresaSelecionada(empresa.Cnpj)
									setShowEmpresa({id: empresa.cnpj, readOnly: false})
								}}
								onDetailRow={() => {
									// setEmpresaSelecionada(empresa.Cnpj)
									setShowEmpresa({id: empresa.cnpj, readOnly: true})
								}}
								onDeleteRow={() => {
									setShowDeleteEmpresa({id: empresa.cnpj, nome: empresa.razaoSocial})
								}}
								onUsersRow={() => {
									navigate(`/gerenciarUsuariosEmpresa/${empresa.cnpj}`);
								}}
								hideUsersIcon = {!temPermissaoGerenciar.visualizarUsuarios}
								hideEyeIcon = {!temPermissaoGerenciar.visualizar}
								hideTrashIcon = {!temPermissaoGerenciar.remover}
								hideEditIcon={!temPermissaoGerenciar.editar}
							/>
						))
					}
				</Table>
			</div>
			<Footer/>
		</div>
    )
}

export const formatCnpj = (input: string) => {
	const cnpjNumeric = input.replace(/\D/g, '');

	if (cnpjNumeric.length >= 13) {
		return `${cnpjNumeric.slice(0, 2)}.${cnpjNumeric.slice(2, 5)}.${cnpjNumeric.slice(5, 8)}/${cnpjNumeric.slice(8, 12)}-${cnpjNumeric.slice(12)}`;
	} 
	else if (cnpjNumeric.length >= 9) {
		return `${cnpjNumeric.slice(0, 2)}.${cnpjNumeric.slice(2, 5)}.${cnpjNumeric.slice(5, 8)}/${cnpjNumeric.slice(8)}`;
	} 
	else if (cnpjNumeric.length >= 6) {
		return `${cnpjNumeric.slice(0, 2)}.${cnpjNumeric.slice(2, 5)}.${cnpjNumeric.slice(5)}`;
	} 
	else if (cnpjNumeric.length >= 3) {
		return `${cnpjNumeric.slice(0, 2)}.${cnpjNumeric.slice(2)}`;
	} 
	else {
		return cnpjNumeric;
	}
}
