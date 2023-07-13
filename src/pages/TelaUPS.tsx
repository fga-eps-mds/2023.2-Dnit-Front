import Header from "../components/Header";
import UPSForm from "../components/visualizarUps/FormularioUPS";
import "../styles/App.css";

function TelaUPS() {
  return (
    <div className="App">
      <Header dashboard />
      <UPSForm />
    </div>
  );
}

export default TelaUPS;
