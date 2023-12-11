import { Select } from "antd";
import {ChangeEvent, useEffect, useState} from "react";
import { useSelectedValue } from "../../../../context/Situacao";
import {EscolaData, SituacaoData} from "../../../../models/service";
import {fetchSituacao} from "../../../../service/escolaApi";
import {fetchEtapasDeEnsino} from "../../../../service/escolaApi";
import MenuSuspenso from "../../MenuSuspenso";
import {formataCustoLogistico} from "../../../../utils/utils";
import { fetchPolo } from "../../../../service/poloApi";
import { PoloModel } from "../../../../models/polo";

interface ModalCamposEscolaProps {
  data: EscolaData;
  onUpdateObservacao: (novaObservacao: any) => void;
  onUpdateTelefone: (novaTelefone: any) => void;
  onUpdateLatitude: (novaLatitude: any) => void;
  onUpdateLongitude: (novaLongitude: any) => void;
  onUpdateNumAlunos: (novaNumAlunos: any) => void;
  onUpdateNumDocentes: (novaNumDocentes: any) => void;
  onUpdateEtapasEnsino: (novaEtapasEnsino: any) => void;
}

const ModalCampos = ({
  data,
  onUpdateTelefone,
  onUpdateObservacao,
  onUpdateLatitude,
  onUpdateLongitude,
  onUpdateNumAlunos,
  onUpdateNumDocentes,
  onUpdateEtapasEnsino,
}: ModalCamposEscolaProps) => {
  const [menuSuspensoAberto, setMenuSuspensoAberto] = useState(false);
  const { setSelectedValue, selectedValue } = useSelectedValue();
  const [situacoes, setSituacoes] = useState<SituacaoData[]>();
  const [OpcoesEtapasDeEnsino, setOpcoesEtapasDeEnsino] = useState<
    { value: number; label: string }[]
  >([]);

  const [novaLat, setNovaLat] = useState(data?.latitude);
  const [novaLong, setNovaLong] = useState(data?.longitude);
  const [novoNumAlunos, setNovoNumAlunos] = useState(data?.numeroTotalDeAlunos);
  const [novoNumDoc, setNovoNumDoc] = useState(data?.numeroTotalDeDocentes);
  const [novoTel, setNovoTel] = useState(data?.telefone);
  const [novaObs, setNovaObs] = useState(data?.observacao);

  const ultimaAtualizacao = new Date();
 
  const [poloSelecionado, setPoloSelecionado] = useState<PoloModel | undefined>();
  const fetchpoloSelecionado = async () => {
    const polo = await fetchPolo(data.poloId);
    setPoloSelecionado(polo);
  }
  useEffect(()=>{
    fetchpoloSelecionado();
  }, []);
  
  const chamarSituacao = async () => {
    const situacoes = await fetchSituacao();
    setSituacoes(situacoes);
  };

  const abrirMenuSuspenso = async () => {
    setMenuSuspensoAberto(!menuSuspensoAberto);
    await chamarSituacao();
  };

  const handleTelefoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNovoTel(event.target.value)
    onUpdateTelefone(event.target.value);
  };

  const handleSituacaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.currentTarget.value);
  };

  const handleObservacaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNovaObs(event.target.value)
    onUpdateObservacao(event.target.value);
  };

  const handleLatitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNovaLat(event.target.value)
    onUpdateLatitude(event.target.value);
  };

  const handleLongitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNovaLong(event.target.value)
    onUpdateLongitude(event.target.value);
  };

  const handleNumAlunosChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNovoNumAlunos(Number(event.target.value))
    onUpdateNumAlunos(Number(event.target.value));
  };

  const handleNumDocentesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNovoNumDoc(Number(event.target.value))
    onUpdateNumDocentes(Number(event.target.value));
  };

  const handleEtapasDeEnsinoChange = (event: ChangeEvent<HTMLInputElement>) => {
    onUpdateEtapasEnsino(event);
  };

  const getEtapasDeEnsino = async () => {
    try {
      const resposta = await fetchEtapasDeEnsino();
      const etapas = resposta.map((e) => ({ label: e.descricao, value: e.id }));
      setOpcoesEtapasDeEnsino(etapas);
    } catch (error) {}
  };

  return (
    <div className="br-modal-body">
      <div className="br-input">
        <label htmlFor="input-default">Código</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-barcode" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            value={data.codigoEscola}
            disabled
          />
        </div>
        <label htmlFor="input-default">Rede</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-school" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            placeholder={data.descricaoRede}
            disabled
          />
        </div>
        <label htmlFor="input-default">UF</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-map-pin" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            placeholder={data.siglaUf}
            disabled
          />
        </div>
        <label htmlFor="input-default">Município</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-building" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            placeholder={data.nomeMunicipio}
            disabled
          />
        </div>
        <label htmlFor="input-default">Endereço</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-home" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            placeholder={data.endereco}
            disabled
          />
        </div>
        <label htmlFor="input-default">Telefone</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-phone" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            onChange={handleTelefoneChange}
            value={novoTel}
          />
        </div>
        <label htmlFor="input-default">CEP</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-thumbtack" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            placeholder={data.cep}
            disabled
          />
          
          <div className="br-select">
            <label htmlFor="select-multtiple">Etapas de Ensino</label>
            <Select
              mode="multiple"
              placeholder={Object.values(data.etapaEnsino)}
              onChange={handleEtapasDeEnsinoChange}
              onMouseDown={getEtapasDeEnsino}
              onClick={getEtapasDeEnsino}
              options={OpcoesEtapasDeEnsino}
              className="select-etapas"
              showSearch={false}
              data-testid="buscar-etapas"
            />
          </div>
        </div>
        
        <label htmlFor="input-default">CEP Polo</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-thumbtack" aria-hidden="true"></i>
          </div>
          <input
              id="input-default"
              type="text"
              placeholder={data.distanciaPolo ? poloSelecionado?.cep : '-'}
              disabled
          />
        </div>

        <label htmlFor="input-default">Endereço Polo</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-home" aria-hidden="true"></i>
          </div>
          <input
              id="input-default"
              type="text"
              placeholder={data.distanciaPolo ? poloSelecionado?.endereco : '-'}
              disabled
          />
        </div>
        
      </div>
      <div className="br-input">
        <div className="input-default">
          <label htmlFor="select-simple">Situação</label>
          <input
            onFocus={abrirMenuSuspenso}
            value={selectedValue}
            onChange={handleSituacaoChange}
            id="select-simple"
            type="text"
            placeholder={selectedValue ? selectedValue : data.descricaoSituacao}
          />
          <div className="alinhar-botoes">
            <button
              className="br-button"
              type="button"
              aria-label="Exibir lista"
              data-trigger="data-trigger"
              onClick={abrirMenuSuspenso}
              data-testid="dropdown-situacao"
            >
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </button>
            {selectedValue && (
              <button
                className="br-button"
                type="button"
                onClick={() => setSelectedValue("")}
              >
                <i className="fas fa-close" aria-hidden="true"></i>
              </button>
            )}
          </div>
        </div>
        {menuSuspensoAberto && situacoes && (
          <MenuSuspenso
            onClose={abrirMenuSuspenso}
            onClick={setSelectedValue}
            situacoes={situacoes}
            descricao={data.descricaoSituacao}
          />
        )}
        <label htmlFor="input-default">Localização</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-map" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            placeholder={data.descricaoLocalizacao}
            disabled
          />
        </div>
        <label htmlFor="input-default">Latitude</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-map-pin" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            value={novaLat}
            onChange={handleLatitudeChange}
          />
        </div>
        <label htmlFor="input-default">Longitude</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-map-pin" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            value={novaLong}
            onChange={handleLongitudeChange}
          />
        </div>
        <label htmlFor="input-default">Número total de alunos</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-users" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            value={novoNumAlunos}
            onChange={handleNumAlunosChange}
          />
        </div>
        <label htmlFor="input-default">Número total de docentes</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-users" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            value={novoNumDoc}
            onChange={handleNumDocentesChange}
          />
        </div>

        <label htmlFor="input-default">Observação</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-info-circle" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            onChange={handleObservacaoChange}
            value={novaObs}
          />
        </div>
        <label htmlFor="input-default">Ultima Atualização</label>
        <div className="input-group">
          <div className="input-icon">
            <i className="fas fa-sync" aria-hidden="true"></i>
          </div>
          <input
            id="input-default"
            type="text"
            placeholder={ultimaAtualizacao.toLocaleDateString()}
            disabled
          />
        </div>

        <label htmlFor="input-default">Custo Logístico</label>
        <div className="input-group">
          <input
              id="input-default"
              type="text"
              placeholder={data.distanciaPolo ? formataCustoLogistico(data.distanciaPolo) : '-'}
              disabled
          />
        </div>
      </div>
    </div>
  );
};

export default ModalCampos;
