import { useEffect, useState } from "react";
import Modal from "../Modal";
import "./styles.css"
import { notification } from "antd";
import { FilterOptions } from "../../pages/gerencia/GerenciarUsuario";
import Select from "../Select";
import { PoloModel } from "../../models/polo";
import { fetchPolo, sendCadastroPolo, updatePolo } from "../../service/poloApi";
import { fetchMunicipio } from "../../service/escolaApi";
import { fetchCEP } from "../../service/apiUtils";

interface EditarPolosDialogProps {
	readonly id: number | null;
	readonly readOnly: boolean;
	readonly listaUfs: FilterOptions[];
	readonly closeDialog: (saved: boolean) => void;
}

export default function EditarPolosDialog( { id, readOnly, listaUfs, closeDialog }: EditarPolosDialogProps ) {
	const [notificationApi, contextHolder] = notification.useNotification();
	const [newUF, setNewUF] = useState(Number);
	const [listaMunicipios, setListaMunicipios] = useState<FilterOptions[]>([]);
	const [newMunicipio, setNewMunicipio] = useState("");
	const [nome, setNome] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [endereco, setEndereco] = useState("");
	const [cep, setCEP] = useState("");
	const [erroLatitude, setErroLatitude] = useState(false);
	const [erroLongitude, setErroLongitude] = useState(false);
	const [erroNome, setErroNome] = useState(false);
	const [erroEndereco, setErroEndereco] = useState(false);
	const [erroCep, setErroCep] = useState(false);

	const parseCoordenadas = (value: string, name: string) => {
		const parts = value.split(',').map(part => part.trim());
		if (parts.length === 2) {
		  const latitude = parts[0];
		  const longitude = parts[1];

		  setErroLatitude(!Boolean(latitude.length));
		  setErroLongitude(!Boolean(longitude.length));

		  setLatitude(latitude.substring(0, 10));
		  setLongitude(longitude.substring(0, 10));
		}
	  };
	
	  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
		event.preventDefault();
	
		const pastedData = event.clipboardData.getData('text');    
		const fieldName = event.currentTarget.name;
	  
		parseCoordenadas(pastedData, fieldName);
	  };

	async function fetchMunicipios(): Promise<void> {
		const listaMunicipios = await fetchMunicipio(Number(newUF));
		const novoMunicipio = listaMunicipios.map((u) => ({ id:''+ u.id, rotulo: u.nome }));
		setListaMunicipios(novoMunicipio);
	}

	useEffect(() => {
		fetchMunicipios();
	}, [newUF]);
	
	const consultaCEP = async (cep: string) => {
		setCEP(cep);
		setErroCep(!Boolean(cep.length));
		try {
		  if (cep.length === 8) {
			const res = await fetchCEP(cep);
			if (!res.erro) {
				//setEndereco(res.bairro + ", " + res.logradouro + ", " + res.complemento);
				setNewUF(Number(listaUfs.find(obj => obj.rotulo === res.uf)?.id));
				setNewMunicipio(res.ibge);
			}}
	} catch (error) { }
	  };

	async function buscarPolo(id : any) {
		fetchPolo(id)
			.then(polo => {
				setNome(polo.nome);
				setEndereco(polo.endereco);
				setCEP(polo.cep);
				setLatitude(polo.latitude);
				setLongitude(polo.longitude);
				setNewUF(polo.uf.id);
				setNewMunicipio(polo.municipio.id.toString());
			});
	}

	const salvarPolo = () => {
		const polo = {
			nome: nome.trim(),
			endereco: endereco.trim(),
			cep: cep.trim().replace(/^(\d{5})(\d{3})$/gm, "$1-$2"),
			latitude: latitude.trim().replace(".", ","),
			longitude: longitude.trim().replace(".", ","),
			idUf: newUF,
			municipioId: Number(newMunicipio),
		};

		setErroNome(!Boolean(nome.length));
		setErroEndereco(!Boolean(endereco.length));
		setErroCep(!Boolean(cep.length));
		setErroLatitude(!Boolean(latitude.length));
		setErroLongitude(!Boolean(longitude.length));

		if (nome.length > 0 && endereco.length > 0 && cep.length > 0 && latitude.length > 0 && longitude.length > 0){
			if (!id)
			{
				sendCadastroPolo(polo)
					.then(e => {
					notification.success({message: 'O polo foi cadastrado com sucesso!'});
					closeDialog(true);
				})
				.catch(error => notificationApi.error({message: 'Falha no cadastro do polo. ' + (error?.response?.data?.message ?? ''), duration: 30}))
				return;
			}
			
			updatePolo(id, polo)
			.then(e => {
				notification.success({message: 'O polo foi alterado com sucesso!'});
				closeDialog(true);
			})
			.catch(error => notificationApi.error({message: 'Falha na edição do polo. ' + (error?.response?.data?.message ?? ''), duration: 30}))
		}else{
			notification.error({message: 'Falha na confirmação dos dados. Insira os dados do polo', duration: 30})
		}
	}

	useEffect(() => {
		if (id) {
			buscarPolo(id);
		}
	}, [id]);

	return (
		
		<Modal className="edicao-polo" closeModal={() => { closeDialog(false) }}>
			{contextHolder}
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				{id && <h4 className="text-center mt-1">{readOnly ? 'Informações do Polo' : 'Atualizar Polo'}</h4>}
        		{!id && <h4 className="text-center mt-1">Cadastrar Polo</h4>}
				<button data-testid="botaoFechar" className="br-button close circle" type="button" aria-label="Close" onClick={() =>{ closeDialog(false) }}>
					<i className="fas fa-times" aria-hidden="true"></i>
				</button>
      		</div>
			<div style={ {height: "fit-content"} }>
				<div className="br-input edicao-polo">
					<label>Nome</label>
					<input id="input-default" data-testid="inputNome" type={"text"} readOnly={readOnly} onChange={e => {
						setNome(e.target.value);
						setErroNome(!Boolean(e.target.value.length));
					}} defaultValue={nome}/>
					{erroNome && <span style={{color: "red"}}>Insira um nome para o polo</span>}
				</div>
				<div className="br-input edicao-polo">
					<label>Endereço</label>
					<input id="input-default" type={"text"} readOnly={readOnly} onChange={e => {
						setEndereco(e.target.value);
						setErroEndereco(!Boolean(e.target.value.length));
					}} defaultValue={endereco} data-testid="inputEndereco" />
					{erroEndereco && <span style={{color: "red"}}>Insira um endereço para o polo</span>}
				</div>
				<div className="br-input edicao-polo-cod ">
					<label>Latitude</label>
					<input id="input-default" type={"text"} readOnly={readOnly} onChange={e => {
						setLatitude(e.target.value);
						setErroLatitude(!Boolean(e.target.value.length));
					}} onPaste={handlePaste}
						defaultValue={latitude} data-testid="inputLatitude" />
					{erroLatitude && <span style={{color: "red"}}>Insira um número entre -90 e +90 com até 6 casas decimais</span>}
				</div>
				<div className="br-input edicao-polo-cod ">
					<label>Longitude</label>
					<input id="input-default" type={"text"} readOnly={readOnly} onChange={e => {
						setLongitude(e.target.value);
						setErroLongitude(!Boolean(e.target.value.length));
					}} onPaste={handlePaste}
						defaultValue={longitude} data-testid="inputLongitude" />
					{erroLongitude && <span style={{color: "red"}}>Insira um número entre -90 e +90 com até 6 casas decimais</span>}
				</div>
				<div className="br-input edicao-polo-cod ">
					<label>CEP</label>
					<input id="input-default" type={"text"} readOnly={readOnly} onChange={e => consultaCEP(e.target.value)} 
						 data-testid="inputCEP" defaultValue={cep}/>
					{erroCep && <span style={{color: "red"}}>Insira um CEP para o polo</span>}
				</div>
				<Select 
					items={listaUfs} 
					value={newUF.toString()} 
					label={"UF"} 
					onChange={(uf) => {
					setNewUF(parseInt(uf,10))}} 
					inputStyle={{ width: "450px" }} 
					dropdownStyle={{ width: "450px" }} 
					buttonStyle={{ left: "150px" } } 
					filtrarTodos={false}
					definePlaceholder="Escolha a Unidade Federativa"
					inputReadOnly={!readOnly}
				/>
				<Select 
					items={listaMunicipios} 
					value={newMunicipio} 
					label={"Município"} 
					onChange={(municipio) => {
					setNewMunicipio(municipio)}} 
					inputStyle={{ width: "450px" }} 
					dropdownStyle={{ width: "450px" }} 
					buttonStyle={{ left: "150px" } } 
					filtrarTodos={false}
					definePlaceholder="Escolha o Município"
					inputReadOnly={!readOnly}
				/>
			</div>
			{!readOnly &&
			(<div className="d-flex w-100 justify-content-end">
        		<button data-testid="botaoCancelar" className="br-button secondary" type="button" onClick={() => {closeDialog(false)}}>Cancelar</button>
        		<button data-testid="botaoConfirmar" className="br-button primary" type="submit" onClick={salvarPolo}>Confirmar</button>
      		</div>)
			}
			{readOnly &&
			(<div className="d-flex w-100 justify-content-end">
				<button data-testid="botaoCancelar" className="br-button secondary" type="button" onClick={() => {closeDialog(false)}}>Voltar</button>
			</div>)
			}

		</Modal>
	)
}