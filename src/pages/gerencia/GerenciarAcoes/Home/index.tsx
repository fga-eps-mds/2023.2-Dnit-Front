import React, { useContext, useEffect, useState } from "react";
import { notification } from "antd";
import { AuthContext } from "../../../../provider/Autenticacao";
import { useNavigate } from "react-router-dom";
import { Permissao } from "../../../../models/auth";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import TrilhaDeNavegacao from "../../../../components/Navegacao/index";
import InputFilter from "../../../../components/InputFilter/index";
import Select from "../../../../components/Select";
import Table, { CustomTableRow } from "../../../../components/Table";
import ReactLoading from "react-loading";
import { ButtonComponent } from "../../../../components/Button";
import DeletarPlanejamentoDialog from "../../../../components/DeletarPlanejamentoDialog";
import {
  deletePlanejamentoMacro,
  fetchPlanejamentos,
} from "../../../../service/gerenciarAcoes";
import { PlanejamentoMacro } from "../../../../models/gerenciarAcoes";
import { meses } from "../fixtures";
import "./styles.css";

interface FilterOptions {
  id: string;
  rotulo: string;
}

export default function GerenciarAcoes() {
  const { temPermissao } = useContext(AuthContext);
  const possuiPermissao = { excluir: temPermissao(Permissao.UsuarioEditar) };
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const paginas = [{ nome: "Gerenciar Ações", link: "/gerenciarAcoes" }];
  const colunas = ["Nome", "Período", "Quantidade de Ações", "Responsável"];

  const [notificationApi, notificationContextHandler] =
    notification.useNotification();

  const [deletePlanejamento, setDeletePlanejamento] =
    useState<PlanejamentoMacro | null>(null);

  const [listaPeriodo, setListaPeriodo] = useState<FilterOptions[]>([]);

  const [nome, setNome] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [planejamentoBanco, setPlanejamentoBanco] = useState<
    PlanejamentoMacro[]
  >([]);
  const [planejamentos, setPlanejamentos] = useState<PlanejamentoMacro[]>([]);

  async function sendDeletePlanejamento(planejamentoId: string) {
    deletePlanejamentoMacro(planejamentoId)
      .then(() => {
        notification.success({
          message: "Planejamento deletado com sucesso!",
        });
        setDeletePlanejamento(null);
        setPlanejamentos(
          planejamentos.filter((element) => element.id !== planejamentoId)
        );
      })
      .catch((error) => {
        notification.error({
          message: "Falha na exclusão do Planejamento.",
        });
      });
  }

  useEffect(() => {
    fetchPlanejamentos({
      params: {
        Pagina: 1,
        TamanhoPagina: 10000,
        Nome: "",
        Periodo: "",
        Responsavel: "",
        QuantidadeAcoes: undefined,
      },
    })
      .then((planejamento) => {
        setPlanejamentoBanco(planejamento.items);
        setPlanejamentos(planejamento.items);
        let listPeriods: FilterOptions[] = [];

        planejamento.items.forEach((element, index) => {
          let planejamentoPeriod = `${meses[element.mesInicio - 1]} de ${
            element.anoInicio
          } - ${meses[element.mesFim - 1]} de ${element.anoFim}`;

          if (!listPeriods.find((e) => e.rotulo === planejamentoPeriod)) {
            listPeriods.push({
              id: index.toString(),
              rotulo: planejamentoPeriod,
            });
          }
        });

        setListaPeriodo(listPeriods);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let planejamentosFiltrados = planejamentos.filter(
      (index) =>
        index.nome.toLowerCase().includes(nome.toLowerCase()) &&
        index.responsavel.toLowerCase().includes(responsavel.toLowerCase())
    );

    if (periodo !== "") {
      planejamentosFiltrados = planejamentosFiltrados.filter(
        (element) =>
          `${meses[element.mesInicio - 1]} de ${element.anoInicio} - ${
            meses[element.mesFim - 1]
          } de ${element.anoFim}` === listaPeriodo[Number(periodo)].rotulo
      );
    }
    setPlanejamentoBanco(planejamentosFiltrados);
  }, [nome, responsavel, periodo, planejamentos]);

  return (
    <div className="App">
      {notificationContextHandler}
      {deletePlanejamento && (
        <DeletarPlanejamentoDialog
          planejamento={deletePlanejamento}
          onClick={sendDeletePlanejamento}
          closeDialog={(deletou) => {
            setDeletePlanejamento(null);
          }}
        />
      )}
      <Header />
      <TrilhaDeNavegacao elementosLi={paginas} />
      <div className="d-flex flex-column m-5">
        <div className="filters-row">
          <div style={{ margin: "20px" }}>
            <InputFilter onChange={setNome} label="Nome" />
          </div>
          <Select
            items={listaPeriodo}
            value={periodo}
            label={"Período:"}
            onChange={setPeriodo}
            dropdownStyle={{ marginLeft: "20px", width: "260px" }}
            filtrarTodos={true}
          />
          <div data-testid="inputResponsavel">
            <InputFilter onChange={setResponsavel} label="Responsável" />
          </div>

          {possuiPermissao && (
            <div
              data-testid="botaoPossuiPermissao"
              className="new-planning-button"
              style={{ right: "5%" }}
            >
              <ButtonComponent
                label="Criar Novo Planejamento"
                buttonStyle="primary"
                onClick={() =>
                  navigate("/gerenciarAcoes/gerarPlanejamento/null")
                }
              />
            </div>
          )}
        </div>

        {(loading || !planejamentoBanco?.length) && (
          <Table
            columsTitle={colunas}
            initialItemsPerPage={10}
            totalItems={0}
            title=""
          >
            <></>
            <></>
          </Table>
        )}

        {(loading || planejamentoBanco.length != null) && (
          <Table
            columsTitle={colunas}
            title=""
            initialItemsPerPage={10}
            totalItems={planejamentoBanco?.length}
          >
            {planejamentoBanco?.map((e, index) => (
              <CustomTableRow
                key={`${e.nome}-${index}`}
                id={index}
                data={{
                  "0": e.nome,
                  "1": `${meses[e.mesInicio - 1]} de ${e.anoInicio} - ${
                    meses[e.mesFim - 1]
                  } de ${e.anoFim}`,
                  "2": `${e.quantidadeAcoes}`,
                  "3": e.responsavel,
                }}
                hideEditIcon={true}
                onDeleteRow={() => {
                  setDeletePlanejamento(e);
                }}
                onDetailRow={() => {
                  navigate(`/gerenciarAcoes/gerarPlanejamento/${e.id}`);
                }}
              />
            ))}
          </Table>
        )}

        {loading && (
          <div className="d-flex justify-content-center w-100 m-5">
            <ReactLoading type="spinningBubbles" color="#000000" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
