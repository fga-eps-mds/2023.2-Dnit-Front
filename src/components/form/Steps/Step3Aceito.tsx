import "../../../styles/form/step3_1.css"
import { Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEscolasCadastradas } from "../../../context/escolasCadastradasErro";

interface Step3_1Props {
    onClickVoltar: () => void;
}

export default function Step3_Aceito({onClickVoltar }: Step3_1Props) {
    const { escolasCadastradas } = useEscolasCadastradas();
    if (escolasCadastradas.length > 0) {
        return (
            <div className="form3_1">
                <div className="secaoTexto">
                    <h2>Inserção de arquivos concluída com sucesso</h2>
                    <h2>Quantidade de escolas novas: {escolasCadastradas.length}</h2>
                    <CheckCircleOutlined className="botaoCheck" />
                </div>
                <div className="secaoVoltar2">
                    <Button className="botaoVoltar" onClick={onClickVoltar}>
                        Concluir
                    </Button>
                </div>
            </div>
        )
    }
    return (
        <div className="form3_1">
            <div className="secaoTexto">
                <h2>Inserção de arquivos concluída com sucesso</h2>
                <CheckCircleOutlined className="botaoCheck" />
            </div>
            <div className="secaoVoltar">
                <Button className="botaoVoltar" onClick={onClickVoltar}>
                    Concluir
                </Button>
            </div>
        </div>
    )
}