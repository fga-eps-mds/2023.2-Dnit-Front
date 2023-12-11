import { useEffect, useState } from "react";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import TrilhaDeNavegacao from "../../../../components/Navegacao";
import "./styles.css";
import { ButtonComponent } from "../../../../components/Button";
import MonthSelect from "../../../../components/MonthSelect";
import PlanejamentoInfo from "../PlanejamentoInfo";
import {
  fetchPlanejamentoId,
  sendPlanejamento,
  updatePlanejamento,
} from "../../../../service/gerenciarAcoes";
import * as DATA from "../../../../models/service";
import { AuthLocalStorage } from "../../../../provider/Autenticacao";
import { PlanejamentoMacro } from "../../../../models/gerenciarAcoes";
import { meses } from "../fixtures";
import { useParams } from "react-router-dom";
import { PlanejamentoMacroMesUpdate } from "../../../../models/service";
import ReactLoading from "react-loading";

export default function GerenciarAcoes() {
  const { id } = useParams();
  const paginas = [
    { nome: "Gerenciar Ações", link: "/gerenciarAcoes" },
    { nome: "Criar Planejamento", link: "/gerenciarAcoes/criarPlanejamento" },
  ];

  const userEmail = localStorage.getItem(AuthLocalStorage.Email);

  const [savedTitle, setSavedTitle] = useState("");
  const [title, setTitle] = useState("");
  const [initialMonth, setInitialMonth] = useState("");
  const [qtdActions, setQtdActions] = useState(0);
  const [finalMonth, setFinalMonth] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    initialMonth: "",
    finalMonth: "",
    qtdActions: "",
  });

  const [isPlanningGenerated, setIsPlanningGenerated] = useState(false);
  const [planejamentoInfo, setPlanejamentoInfo] =
    useState<PlanejamentoMacro | null>(null);

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      initialMonth: "",
      finalMonth: "",
      qtdActions: "",
    };

    if (title.trim() === "") {
      newErrors.name = "O nome é obrigatório";
      isValid = false;
    } else if (title.length < 4) {
      newErrors.name =
        "O nome do planejamento deve conter pelo menos 5 caracteres";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    if (initialMonth === "") {
      newErrors.initialMonth = "Selecione um mês";
      isValid = false;
    } else {
      newErrors.initialMonth = "";
    }

    if (finalMonth === "") {
      newErrors.finalMonth = "Selecione um mês";
      isValid = false;
    } else {
      newErrors.finalMonth = "";
    }

    if (meses.indexOf(finalMonth) < meses.indexOf(initialMonth)) {
      newErrors.finalMonth = "O mês final deve ser posterior ao mês inicial";
      isValid = false;
    } else {
      newErrors.finalMonth = "";
    }

    if (!qtdActions) {
      newErrors.qtdActions = "Escolha a quantidade de ações";
      isValid = false;
    } else {
      newErrors.qtdActions = "";
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      await createPlanejamento();
      setIsPlanningGenerated(true);
      setSavedTitle(title);
    }
  };

  async function createPlanejamento(): Promise<void> {
    let planejamento: DATA.CriarPlanejamentoRequest = {
      nome: title,
      responsavel: userEmail ?? "",
      anoInicio: "2023",
      anoFim: "2024",
      mesInicio: meses.indexOf(initialMonth) + 1,
      mesFim: meses.indexOf(finalMonth) + 1,
      quantidadeAcoes: qtdActions,
    };

    const planejamentoCriado = (await sendPlanejamento(
      planejamento
    )) as unknown as PlanejamentoMacro;
    setPlanejamentoInfo(planejamentoCriado);
  }

  async function sendUpdatePlanejamento(): Promise<void> {
    let newPlanejamento = planejamentoInfo;
    newPlanejamento!.nome = title;
    setSavedTitle(title);

    let planejamentoMesesInfo: PlanejamentoMacroMesUpdate[] =
      newPlanejamento!.planejamentoMacroMensal.map((element) => ({
        mes: element.mes,
        ano: element.ano,
        escolas: element.escolas.map((escola) => escola.id),
      }));

    let bodyRequest: DATA.AtualizarPlanejamento = {
      nome: newPlanejamento!.nome,
      planejamentoMacroMensal: planejamentoMesesInfo,
    };
    await updatePlanejamento(planejamentoInfo!.id, bodyRequest);
    setPlanejamentoInfo(newPlanejamento);
  }

  useEffect(() => {
    async function fetchData() {
      if (id !== "null" && id !== undefined) {
        const planejamentoResponse = await fetchPlanejamentoId(id);
        setPlanejamentoInfo(planejamentoResponse);
        setSavedTitle(planejamentoResponse.nome);
        setTitle(planejamentoResponse.nome);
        setQtdActions(planejamentoResponse.quantidadeAcoes);
        setInitialMonth(meses[planejamentoInfo?.mesInicio! - 1]);
        setFinalMonth(meses[planejamentoInfo?.mesFim! - 1]);
        setIsPlanningGenerated(true);
      }
    }

    fetchData();
  }, [id, planejamentoInfo?.mesFim, planejamentoInfo?.mesInicio]);

  return (
    <div className="App">
      <div>
        <Header />
        <TrilhaDeNavegacao elementosLi={paginas} />

        <div className="content">
          <div className="planejamento-form">
            <div className="br-input planejamento-input-large">
              <label>Título</label>
              <input
                id="input-default"
                data-testid="inputTitulo"
                type={"text"}
                readOnly={false}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <span className="error">{errors.name}</span>
            </div>
            <div className="br-input planejamento-input">
              <label htmlFor="month-select-init">Mês inicial</label>
              <MonthSelect
                onMonthSelected={(month) => setInitialMonth(month)}
                disabled={isPlanningGenerated}
                valueSelected={initialMonth}
              />
              <span className="error">{errors.initialMonth}</span>
            </div>
            <div className="br-input planejamento-input">
              <label htmlFor="month-select-end">Mês final</label>
              <MonthSelect
                onMonthSelected={(month) => setFinalMonth(month)}
                disabled={isPlanningGenerated}
                valueSelected={finalMonth}
              />
              <span className="error">{errors.finalMonth}</span>
            </div>
            <div className="br-input planejamento-input">
              <label htmlFor="input-default-qtd">Quantidade de Ações</label>
              <input
                id="input-default-qtd"
                type={"text"}
                disabled={isPlanningGenerated}
                onChange={(e) => setQtdActions(Number(e.target.value))}
                data-testid="qtd-actions-field"
                value={qtdActions}
              />
              <span className="error">{errors.qtdActions}</span>
            </div>
          </div>

          {isPlanningGenerated ? null : (
            <div className="planning-button">
              <ButtonComponent
                label="Gerar Planejamento"
                buttonStyle="outlined"
                buttonType="default"
                padding="37px"
                onClick={() => handleSubmit()}
              />
            </div>
          )}

          {isPlanningGenerated && savedTitle !== title ? (
            <div className="planning-button">
              <ButtonComponent
                label="Salvar"
                buttonStyle="primary"
                buttonType="default"
                padding="37px"
                onClick={() => sendUpdatePlanejamento()}
              />
            </div>
          ) : null}

          {isPlanningGenerated && planejamentoInfo ? (
            <PlanejamentoInfo planejamento={planejamentoInfo} />
          ) : null}

          {loading && !isPlanningGenerated && (
            <div className="d-flex justify-content-center w-100 m-5">
              <ReactLoading type="spinningBubbles" color="#000000" />
            </div>
          )}
        </div>
      </div>

      <div className="page-footer">
        <Footer />
      </div>
    </div>
  );
}
