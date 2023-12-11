import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import ReactLoading from "react-loading";
import SelectSchoolCard from "../../SelectSchoolCard";

import {
  EscolaPlanejamentoModel,
  PlanejamentoMacro,
  EscolasPlanejamentoTabela,
} from "../../../models/gerenciarAcoes";

interface ModalProps {
  readonly planejamento: PlanejamentoMacro;
  readonly escolaSelected: EscolasPlanejamentoTabela;
  readonly onClose: () => void;
  readonly onConfirm: (
    escolaSelecionadaInfo: EscolaPlanejamentoModel,
    escolaSelected: EscolasPlanejamentoTabela
  ) => void;
}

export default function ModalAlterarEscola({
  planejamento,
  escolaSelected,
  onClose,
  onConfirm,
}: ModalProps) {
  const [escolas, setEscolas] = useState<EscolaPlanejamentoModel[]>();
  const [listEscolas, setListEscolas] = useState<EscolaPlanejamentoModel[]>();
  const [nome, setNome] = useState("");
  const [escolaSelecionada, setEscolaSelecionada] = useState<number>();
  const [escolaSelecionadaInfo, setEscolaSelecionadaInfo] =
    useState<EscolaPlanejamentoModel>();

  useEffect(() => {
    let escolasPlanejamento: EscolaPlanejamentoModel[] = [];
    planejamento.planejamentoMacroMensal.forEach((planejamentoMensal) => {
      if (
        !planejamentoMensal.escolas.find(
          (element) =>
            element.nome === escolaSelected.nome &&
            escolaSelected.quantidadeAlunos === element.quantidadeAlunos
        )
      )
        planejamentoMensal.escolas.forEach((escola) => {
          escolasPlanejamento.push(escola);
        });
    });
    setListEscolas(escolasPlanejamento);
    setEscolas(escolasPlanejamento);
  }, [planejamento.planejamentoMacroMensal]);

  useEffect(() => {
    setEscolas(
      listEscolas?.filter((index) =>
        index.nome.toLowerCase().includes(nome.toLowerCase())
      )
    );
  }, [nome, listEscolas]);

  if (!escolas) {
    return (
      <Modal className="modal-title" closeModal={() => onClose()}>
        <h4 className="text-center mt-2">Carregando Escolas...</h4>
        <div className="d-flex justify-content-center m-4">
          <ReactLoading type="spinningBubbles" color="#000000" />
        </div>
        <span></span>
      </Modal>
    );
  }

  return (
    <Modal className="default" closeModal={() => onClose()}>
      <div className="d-flex flex-column">
        <div
          style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}
        >
          <h4 className="text-center mt-1">Alterar Escolas</h4>

          <label className="text-center mt-1" htmlFor="delete-inp">
            Escolha a escola que deseja trocar com a seguinte escola:
          </label>

          <label className="text-center bold">{escolaSelected.nome}</label>

          <div className="d-flex flex-column">
            <div
              className="br-input large input-button"
              style={{ width: "95%", fontSize: "16px", textAlign: "start" }}
            >
              <input
                data-testid={"Procurar escola"}
                className="br-input-search-large"
                type="search"
                placeholder={"Procure uma escola"}
                onChange={(e) => setNome(e.target.value)}
              />
              <button
                className="br-button"
                type="button"
                aria-label="Buscar"
                onClick={() => {}}
              >
                <i className="fas fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        <br />

        <div
          className="d-flex flex-column"
          style={{ width: "95%", position: "relative", left: "2%" }}
        >
          {escolas?.map((escola, index) => (
            <div key={index}>
              <SelectSchoolCard
                schoolId={index}
                schoolName={escola.nome}
                schoolUf={escola.uf}
                schoolStudents={escola.quantidadeAlunos}
                isSelected={escolaSelecionada === index}
                onClick={(schoolId: number) => {
                  setEscolaSelecionada(index);
                  setEscolaSelecionadaInfo(escola);
                }}
              />
              <br />
            </div>
          ))}
        </div>
        <br />
        <br />

        <div
          className="d-flex justify-content-end mb-2"
          style={{
            position: "absolute",
            bottom: 0,
            right: "5%",
            height: "10%",
            width: "95%",
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          <div style={{ position: "relative", top: "20%" }}>
            <button
              className="br-button secondary mr-3"
              type="button"
              onClick={() => {
                onClose();
              }}
            >
              Cancelar
            </button>
            <button
              data-testId="Adicionar"
              className="br-button primary"
              disabled={escolaSelecionadaInfo === undefined}
              type="button"
              onClick={async () => {
                onConfirm(escolaSelecionadaInfo!, escolaSelected);
              }}
            >
              Trocar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
