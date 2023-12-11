import { useContext, useEffect, useState } from "react";
import "../../../styles/App.css";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import TrilhaDeNavegacao from "../../../components/Navegacao";
import Table, { CustomTableRow } from "../../../components/Table";
import { EmpresaModel } from "../../../models/empresa";
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
import {fetchListarPolosFiltrados} from "../../../service/poloApi";
import {FiltroPoloData} from "../../../models/service";
import {PoloModel, ListaPaginada} from "../../../models/polo";
import EditarPolosDialog from "../../../components/EditarPolosDialog";
import DeletarPoloDialog, { DeletarPoloDialogArgs } from "../../../components/DeletarPoloDialog";

interface PoloDialogArgs {
  id: number | null;
  readOnly: boolean;
}

export default function GerenciarPolos() {
    const colunasTabela = ["Nome", "Endereço", "UF", "Município", "CEP"];
    const tituloTabela = "Polos cadastrados"
    const paginas = [{nome: "Gerenciar Polos", link: "/gerenciarPolos"}];

    const [nome, setNome] = useState('');
    const [ufs, setufs] = useState<string[]>([]);
    const [uf, setuf] = useState<SelectItem | null>(null);
    const [cep, setCep] = useState('');
    const [municipio, setMunicipio] = useState<SelectItem | null>(null);

    const [municipios, setMunicipios] = useState<SelectItem[]>([]);
    const [listaUfs, setListaUfs] = useState<FilterOptions[]>([]);

    const [pagina, setPagina] = useState<ListaPaginada<PoloModel>>(
        {items: [], pagina: 1, itemsPorPagina: 10, total: 0, totalPaginas: 0}
    );
	const [tamanhoPagina, setTamanhoPagina] = useState(pagina.itemsPorPagina);
    const [listaPolos, setListaPolos] = useState<PoloModel[]>(pagina.items);

    const [notificationApi, notificationContextHandler] = notification.useNotification();

    const [showPolo, setShowPolo] = useState<PoloDialogArgs | null>(null);
    const [showDeletePolo, setShowDeletePolo] = useState<DeletarPoloDialogArgs | null>(null);



	const navigate = useNavigate();

	const { temPermissao } = useContext(AuthContext);
	
	const temPermissaoGerenciar = {
		cadastrar: temPermissao(Permissao.PoloCadastrar),
		visualizar: temPermissao(Permissao.PoloVisualizar),
		remover: temPermissao(Permissao.PoloRemover),
		editar: temPermissao(Permissao.PoloEditar),
	}

    useEffect(() => {
        if (!temPermissao(Permissao.PoloVisualizar)) {
          navigate("/dashboard");
        }
        }, []);

    // TODO: permissões polos
    const onPoloChange = (changed: boolean) => {
		if (changed) buscarPolos(1);
	}

    const buscarPolos = (proximaPagina: number, novoTamanhoPagina: number = tamanhoPagina) => {
        const filtro = { params: {
            Pagina: proximaPagina,
            TamanhoPagina: novoTamanhoPagina,
            Nome: nome,
            Cep: cep,
            idUf: uf?.id,
            idMunicipio: municipio?.id}} as FiltroPoloData;

        fetchListarPolosFiltrados(filtro)
            .then(p => {
                setPagina(p)
                setListaPolos(p.items)
                setTamanhoPagina(p.itemsPorPagina)
            })
            .catch(error => notificationApi.error({message: 'Falha na listagem de polos. ' + (error?.response?.data || '')}));
    }
    useEffect(() => {
        buscarPolos(1);
    }, [nome, cep, uf, municipio]);

    useEffect(() => {
        fetchUnidadeFederativa()
            .then(ufs =>
            setListaUfs(ufs.map(m => (
                {
                    id: m.id.toString(),
                    rotulo: m.sigla
                })
            ))
        );
	}, []);

    async function fetchMunicipios(): Promise<void> {
        if (!uf?.id) {
            setMunicipios([]);
            return;
        }
        const listaMunicipios = await fetchMunicipio(Number(uf.id));
        const novoMunicipio = listaMunicipios.map((u) => ({ id: '' + u.id, rotulo: u.nome }));
        setMunicipios(novoMunicipio);
    }

    useEffect(() => {
        fetchMunicipios();
    }, [uf]);


    return (
		<div className="App">
			{notificationContextHandler}
            {showPolo && <EditarPolosDialog id={showPolo.id} listaUfs={listaUfs} readOnly={showPolo.readOnly} closeDialog={(salvou) => {setShowPolo(null); onPoloChange(salvou)}}/>}
            {showDeletePolo && <DeletarPoloDialog id={showDeletePolo.id} nome={showDeletePolo.nome} closeDialog={(deletou) => {setShowDeletePolo(null); onPoloChange(deletou)}}/>}
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
                            dropdownStyle={{ marginLeft: "20px", width: "260px" }}
                            filtrarTodos={true} />
					{temPermissaoGerenciar.cadastrar && <ButtonComponent label="Cadastrar Polo" buttonStyle="primary" onClick={() => setShowPolo({ id: null, readOnly: false })} ></ButtonComponent>}
        		</div>
				{listaPolos.length === 0 && <Table columsTitle={colunasTabela} initialItemsPerPage={10} title={tituloTabela}><></><></></Table>}
				<Table 
					title={tituloTabela}
					columsTitle={colunasTabela}
					totalPages={pagina.totalPaginas}
					totalItems={pagina.total}
					initialItemsPerPage={pagina.itemsPorPagina}
					onNextPage={() => {
						if (pagina.pagina === pagina.totalPaginas) return;
						buscarPolos(pagina.pagina + 1);
					}}
					onPreviousPage={() => {
						if (pagina.pagina === 1) return;
                        buscarPolos(pagina.pagina - 1);
					}}
					onPageResize={(newItensPerPage) => {
                        buscarPolos(pagina.pagina, newItensPerPage);
					}}
					onPageSelect={(newSelectedPage) => {
                        buscarPolos(newSelectedPage);
					}}
				>
					{
						listaPolos.map((polo, index) => (
							<CustomTableRow
								key={`${polo.endereco}`}
                                id={index}
                                onEditRow={() => {
									setShowPolo({id: polo.id, readOnly: false})
								}}
								onDetailRow={() => {
									setShowPolo({id: polo.id, readOnly: true})
								}}
                                onDeleteRow={() => {
									setShowDeletePolo({id: polo.id, nome: polo.nome})
								}}
                                onUsersRow={() => {}}
								data={
                                {
                                    '0': polo.nome,
                                    '1': polo.endereco,
									'2': polo.uf.sigla,
                                    '3': polo.municipio.nome,
                                    '4': polo.cep
                                }}
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
