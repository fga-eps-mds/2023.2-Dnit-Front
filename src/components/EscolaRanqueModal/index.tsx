import React, { ReactNode, useState, useEffect } from "react";
import "../../styles/App.css";
import "../../pages/Ranque/";
import Modal from "../../components/Modal/index";
import { fetchEscolaRanque } from "../../service/ranqueApi";
import { EscolaRanqueDetalhes } from "../../models/ranque";
import ReactLoading from "react-loading";
import { formataCustoLogistico } from "../../utils/utils";
import "./index.css";
import { PoloModel } from "../../models/polo";
import { fetchPolo } from "../../service/poloApi";

interface ModalProps {
  onClose: () => void;
  onCreateAcao: () => void;
  escolaId: string;
}

interface LabelProps {
  children: ReactNode;
  className?: string;
}

function Label({ children, className }: LabelProps) {
  return (
    <label
      style={{ fontSize: "14px", fontWeight: "normal" }}
      className={"mb-2 " + className}
    >
      {children}
    </label>
  );
}

const ModalRanqueEscola: React.FC<ModalProps> = ({
  escolaId,
  onClose,
  onCreateAcao,
}) => {
  const [escolaSelecionada, setEscolaSelecionada] =
    useState<EscolaRanqueDetalhes | null>(null);
  const [poloSelecionado, setPoloSelecionado] = useState<
    PoloModel | undefined
  >();

  const fetchPoloSelecionado = async (poloId?: number) => {
    const polo = await fetchPolo(poloId);
    setPoloSelecionado(polo);
  };

  useEffect(() => {
    fetchEscolaRanque(escolaId).then((escola) => {
      setEscolaSelecionada(escola);
      fetchPoloSelecionado(escola.polo?.id);
    });
  }, []);

  if (!escolaSelecionada) {
    return (
      <Modal className="modal-title" closeModal={() => onClose()}>
        <h4 className="text-center mt-2">Carregando Escola...</h4>
        <div className="d-flex justify-content-center m-4">
          <ReactLoading type="spinningBubbles" color="#000000" />
        </div>
        <span></span>
      </Modal>
    );
  }

  return (
    <Modal className="default escola-ranque-modal" closeModal={() => onClose()}>
      <div className="d-flex flex-column">
        <h4 className="text-center mt-1">Detalhes da Escola</h4>
        <div className="d-flex flex-column ">
          <Label>Nome: {escolaSelecionada.nome}</Label>
          <Label>Posição: {escolaSelecionada.ranqueInfo.posicao}</Label>
          <Label>Pontuação:</Label>
          <div className="d-flex flex-column">
            {escolaSelecionada.ranqueInfo.fatores.map((f, index) => (
              <Label className="ml-4" key={index}>
                Fator {f.nome}, Peso {f.peso}, Valor {f.valor}
              </Label>
            ))}
            <Label className="ml-4">
              Custo Logístico:{" "}
              {escolaSelecionada.distanciaPolo
                ? formataCustoLogistico(escolaSelecionada.distanciaPolo)
                : "-"}
            </Label>
          </div>
          <Label>Total: {escolaSelecionada.ranqueInfo.pontuacao}</Label>
          <Label>
            Solicitação:{" "}
            {escolaSelecionada.temSolicitacao
              ? "Esta escola possui solicitação de ação"
              : "Não há registro de solicitacao"}
          </Label>
          <hr />
          <Label>
            <strong>Dados</strong>
          </Label>
          <div className="row mb-2">
            <div className="col-12 col-md-6">
              <Label>Código: {escolaSelecionada.codigo}</Label>
            </div>
            <div className="col-12 col-md-6">
              <Label>
                Telefone:{" "}
                {escolaSelecionada.telefone.replace(
                  /^(\d{2})(\d{4})(\d{4})/gm,
                  "($1) $2-$3"
                )}
              </Label>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12 col-md-6">
              <Label>Alunos: {escolaSelecionada.totalAlunos}</Label>
            </div>
            <div className="col-12 col-md-6">
              <Label>Professores: {escolaSelecionada.totalDocentes}</Label>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12 col-md-6">
              <Label>Porte: {escolaSelecionada.porte?.descricao ?? ""}</Label>
            </div>
            <div className="col-12 col-md-6">
              <Label>
                Situação: {escolaSelecionada.situacao?.descricao ?? ""}
              </Label>
            </div>
          </div>
          <Label>Rede: {escolaSelecionada.rede?.id ?? ""}</Label>
          <Label>
            Etapas de Ensino:{" "}
            {escolaSelecionada.etapasEnsino
              ?.map((e) => e.descricao)
              .join(", ") ?? ""}
          </Label>
          <div>
            <div className="d-flex flex-column">
              <Label>
                <strong>Endereço</strong>
              </Label>
              <Label>{escolaSelecionada.endereco}</Label>
              <Label>
                Cep:{" "}
                {escolaSelecionada.cep.replace(/^(\d{5})(\d{3})$/gm, "$1-$2")}
              </Label>
              <div className="row">
                <div className="col-12 col-md-6">
                  <Label>Estado: {escolaSelecionada.uf?.sigla}</Label>
                </div>
                <div className="col-12 col-md-6">
                  <Label>Município: {escolaSelecionada.municipio?.nome}</Label>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex flex-column ">
            <Label>
              <strong>Polo mais próximo</strong>
            </Label>
            <Label>
              Distância: {escolaSelecionada.distanciaPolo?.toFixed(2)} Km
            </Label>
            <Label>
              Endereço:{" "}
              {escolaSelecionada.distanciaPolo
                ? poloSelecionado?.endereco
                : "-"}
            </Label>
            <Label>
              Cep:{" "}
              {escolaSelecionada.distanciaPolo ? poloSelecionado?.cep : "-"}
            </Label>
            <Label>
              UF:{" "}
              {escolaSelecionada.distanciaPolo
                ? poloSelecionado?.uf.sigla
                : "-"}
            </Label>
          </div>
        </div>
      </div>
      <br />
      <div className="d-flex w-100 justify-content-end mb-2">
        <button
          className="br-button secondary mr-3"
          type="button"
          onClick={() => onClose()}
        >
          Fechar
        </button>
        <button
          className="br-button primary mr-3"
          type="button"
          onClick={() => {
            onCreateAcao();
          }}
          disabled
        >
          Criar Ação
        </button>
      </div>
    </Modal>
  );
};

export default ModalRanqueEscola;
