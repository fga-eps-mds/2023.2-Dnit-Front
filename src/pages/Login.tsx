import imgLateral from "../assets/imgLateral.png";
import Header from "../components/Cabecalho";
import Footer from "../components/Footer";
import LoginForm from "../components/acessosUsuario/Login";
import "../styles/App.css";

function Login() {
  return (
    <div className="App">
      <Header hasLogged={false} />
      <div className="Secao">
        <div className="Lateral">
          <img className="imgLateral" src={imgLateral} alt="Logo DNIT" />
        </div>
        <div className="Central">
          <LoginForm />
        </div>
      </div>
      <Footer home />
    </div>
  );
}

export default Login;
