import TrilhaNavegacao from "../../../../components/Navegacao";
import FiltragemTabela from "../../../../components/escolasCadastradas/tabela/Filtro";
import Footer from "../../../../components/Footer";
import TabelaEscola from "../../../../components/escolasCadastradas/tabela/Tabela";
import { FiltroProvider } from "../../../../context/FiltroTabela";
import "../../../../styles/App.css";
import Header from "../../../../components/Header";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../../provider/Autenticacao";
import { Permissao } from "../../../../models/auth";
import { useNavigate } from "react-router-dom";
import { ButtonComponent } from "../../../../components/Button";
import { exportarEscolas } from "../../../../consts/service";

export default function EscolasCadastradas() {
  const paginas = [{ nome: "Logout", link: "/login" }];

  const navigate = useNavigate();
  const { temPermissao } = useContext(AuthContext);

  const podeExportar = temPermissao(Permissao.EscolaExportar);

  useEffect(() => {
    if (!temPermissao(Permissao.EscolaVisualizar)) {
      navigate("/");
    }
  }, []);

  const exportEscolas = () => {
    window.open(exportarEscolas, '_blank');
  }

  return (
    <div className="App">
      <Header />
      {!temPermissao(Permissao.EscolaCadastrar) ?
        <TrilhaNavegacao
          elementosLi={paginas} />
        : <TrilhaNavegacao
          elementosLi={paginas}
          escolasCadastradas />
      }
      <FiltroProvider>
        <FiltragemTabela />
        <TabelaEscola />
      </FiltroProvider>
      <div className="d-flex justify-content-end mt-4 mb-4">
        <ButtonComponent label="Exportar Dados" buttonStyle="primary" onClick={exportEscolas} disabled={!podeExportar} />
      </div>
      <Footer />
    </div>
  );
}
