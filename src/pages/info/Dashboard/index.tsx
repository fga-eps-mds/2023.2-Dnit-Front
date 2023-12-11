import {
  FileAddOutlined,
  FileTextOutlined,
  FormOutlined,
} from "@ant-design/icons";
import IconGerenciarPerfis from "../../../assets/icones/GerenciarPerfis.svg";
import IconGerenciarUsuarios from "../../../assets/icones/GerenciarUsuarios.svg";
import IconGerenciarAcoes from "../../../assets/icones/iconeGerenciarAcoes.svg";
import RankingEscolas from "../../../assets/icones/RankingEscolas.svg";
import Solicitacoes from "../../../assets/icones/BotaoSolicitacao.svg";
import { Card, Collapse, CollapseProps } from "antd";
import { useNavigate } from "react-router";
import Header from "../../../components/Header";
import TrilhaDeNavegacao from "../../../components/Navegacao";
import Footer from "../../../components/Footer";
import "../../../styles/App.css";
import "./styles.css";
import "../../../components/Collapse/";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/Autenticacao";
import { Permissao } from "../../../models/auth";
import { fetchPermissoesDoUsuario } from "../../../service/usuarioApi";
import IconGerenciarPrioridades from "../../../assets/icones/GerenciarPrioridades.svg";
import IconGerenciarPolos from "../../../assets/icones/GerenciarPolos.svg";

export default function Dashboard() {
  const navigate = useNavigate();
  const paginas = [{ nome: "Logout", link: "/login" }];

  const { temPermissao, setPermissoes } = useContext(AuthContext);

  const [podeVisualizarEscola, setPodeVisualizarEscola] = useState(
    temPermissao(Permissao.EscolaVisualizar)
  );
  const [podeVisualizarAcoes, setPodeVisualizarAcoes] = useState(
    temPermissao(Permissao.UsuarioVisualizar)
  );
  const [podeVisualizarRanque, setPodeVisualizarRanque] = useState(
    temPermissao(Permissao.RanqueVisualizar)
  );
  const [podeCadastrarEscola, setPodeCadastrarEscola] = useState(
    temPermissao(Permissao.EscolaCadastrar)
  );
  const [podeCadastrarSinistro, setPodeCadastrarSinistro] = useState(
    temPermissao(Permissao.SinistroCadastrar)
  );
  const [podeCadastrarRodovias, setPodeCadastrarRodovias] = useState(
    temPermissao(Permissao.RodoviaCadastrar)
  );
  const [podeGerenciarPerfis, setPodeGerenciarPerfis] = useState(
    temPermissao(Permissao.PerfilVisualizar)
  );
  const [podeGerenciarEmpresas, setPodeGerenciarEmpresas] = useState(
    temPermissao(Permissao.EmpresaCadastrar)
  );
  const [podeGerenciarUsuario, setPodeGerenciarUsuario] = useState(
    temPermissao(Permissao.UsuarioVisualizar)
  );
  const [podeGerenciarAcoes, setPodeGerenciarAcoes] = useState(
    temPermissao(Permissao.UsuarioVisualizar)
  );

  const [podeGerenciarPolos, setPodeGerenciarPolos] = useState(
    temPermissao(Permissao.PoloVisualizar)
  );
  const [podeGerenciarSolicitacao, setPodeGerenciarSolicitacao] = useState(
    temPermissao(Permissao.SolicitacaoVisualizar)
  );

  useEffect(() => {
    fetchPermissoesDoUsuario().then((permissoes) => {
      setPermissoes(permissoes);

      setPodeVisualizarEscola(temPermissao(Permissao.EscolaVisualizar));
      setPodeVisualizarAcoes(temPermissao(Permissao.UsuarioVisualizar));
      setPodeVisualizarRanque(temPermissao(Permissao.RanqueVisualizar));
      setPodeCadastrarEscola(temPermissao(Permissao.EscolaCadastrar));
      setPodeCadastrarSinistro(temPermissao(Permissao.SinistroCadastrar));
      setPodeCadastrarRodovias(temPermissao(Permissao.RodoviaCadastrar));
      setPodeGerenciarUsuario(temPermissao(Permissao.UsuarioVisualizar));
      setPodeGerenciarPerfis(temPermissao(Permissao.PerfilVisualizar));
      setPodeGerenciarEmpresas(temPermissao(Permissao.EmpresaVisualizar));
      setPodeGerenciarAcoes(temPermissao(Permissao.UsuarioVisualizar));
      setPodeGerenciarPolos(temPermissao(Permissao.PoloVisualizar));
      setPodeGerenciarSolicitacao(
        temPermissao(Permissao.SolicitacaoVisualizar)
      );
    });
  }, []);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Visualizações",
      children: (
        <div className="collapse-item">
          {podeVisualizarEscola && (
            <Card
              className="card"
              onClick={() => navigate("/escolas-cadastradas")}
            >
              <FileTextOutlined className="icon" />
              <p data-testid="visualizar-escola-option" className="text">
                Visualizar Escolas
              </p>
            </Card>
          )}
          {podeVisualizarRanque && (
            <Card className="card" onClick={() => navigate("/ranque")}>
              <img src={RankingEscolas} alt="ícone gerenciar usuarios" />
              <p className="text">Ranking de escolas</p>
            </Card>
          )}
          {podeGerenciarSolicitacao && (
            <Card className="card" onClick={() => navigate("/solicitacoes")}>
              <img
                className="iconPerfis"
                src={Solicitacoes}
                alt="ícone solicitacoes"
              />
              <p className="text">Solicitações</p>
            </Card>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Adição de dados",
      children: (
        <div className="collapse-item">
          {podeCadastrarEscola && (
            <Card className="card" onClick={() => navigate("/cadastrarescola")}>
              <FormOutlined className="icon" />
              <p className="text">Cadastrar Escolas</p>
            </Card>
          )}
          {podeCadastrarSinistro && (
            <Card
              className="card"
              onClick={() => navigate("/cadastrarsinistros")}
            >
              <FileAddOutlined className="icon" />
              <p className="text">Adicionar Sinistros</p>
            </Card>
          )}
          {podeCadastrarRodovias && (
            <Card
              className="card"
              onClick={() => navigate("/cadastrarRodovias")}
            >
              <FileAddOutlined className="icon" />
              <p className="text">Adicionar Rodovias</p>
            </Card>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "Ferramentas Administrativas",
      children: (
        <div className="collapse-item">
          {podeGerenciarEmpresas && (
            <Card
              className="card"
              onClick={() => navigate("/gerenciarEmpresas")}
            >
              <FileTextOutlined className="icon" />
              <p className="text">Gerenciar Empresas</p>
            </Card>
          )}
          {podeGerenciarUsuario && (
            <Card
              className="card"
              onClick={() => navigate("/gerenciarUsuario")}
            >
              <img
                className="iconGenciaUsuarios"
                src={IconGerenciarUsuarios}
                alt="ícone gerenciar usuarios"
              />
              <p className="text">Gerenciar Usuário</p>
            </Card>
          )}
          {podeGerenciarPerfis && (
            <Card className="card" onClick={() => navigate("/gerenciarPerfis")}>
              <img
                className="iconPerfis"
                src={IconGerenciarPerfis}
                alt="ícone gerenciar perfis"
              />
              <p className="text">Gerenciar Perfis</p>
            </Card>
          )}
          {podeGerenciarAcoes && (
            <Card className="card" onClick={() => navigate("/gerenciarAcoes")}>
              <img
                className="iconPerfis"
                src={IconGerenciarAcoes}
                alt="Ícone gerenciar ações"
              />
              <p className="text">Gerenciar Ações</p>
            </Card>
          )}
          {podeGerenciarPolos && (
            <Card className="card" onClick={() => navigate("/gerenciarPolos")}>
              <img
                className="iconPerfis"
                src={IconGerenciarPolos}
                alt="ícone gerenciar polos"
              />
              <p className="text">Gerenciar Polos</p>
            </Card>
          )}
          <Card
            className="card"
            onClick={() => navigate("/gerenciarPrioridades")}
          >
            <img
              className="iconGerenciarPrioridades"
              src={IconGerenciarPrioridades}
              alt="ícone prioridades"
            />
            <p className="text">Gerenciar Prioridades</p>
          </Card>
        </div>
      ),
    },
  ];
  return (
    <div className="App">
      <Header />
      <div className="Main-content" data-testid="dashboard">
        <TrilhaDeNavegacao elementosLi={paginas} />
        <Collapse
          defaultActiveKey={["1", "2", "3"]}
          ghost
          items={items}
          className="collapse"
        />
      </div>
      <Footer />
    </div>
  );
}
