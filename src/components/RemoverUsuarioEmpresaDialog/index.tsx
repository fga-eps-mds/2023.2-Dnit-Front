import Modal from "../Modal";
import { deleteUsuarioEmpresa } from "../../service/empresaApi";
import { notification } from "antd";
import "./styles.css"

interface RemoverUsuarioEmpresaProps {
    readonly cnpj: string | undefined;
    readonly nomeEmpresa: string | undefined;
    readonly usuarioid: string;
    readonly nomeUsuario: string;
    readonly closeDialog: (removed: boolean) => void;
}

export default function RemoverUsuarioEmpresaDialog( { cnpj, nomeEmpresa, usuarioid, nomeUsuario, closeDialog }: RemoverUsuarioEmpresaProps) {
    const removerUsuario = () => {
        if (cnpj) {
            deleteUsuarioEmpresa({cnpj, usuarioid})
            .then(() => {
                notification.success({ message: "O usuário foi removido da empresa com sucesso." });
                closeDialog(true);
            })
            .catch((error) => {
                notification.error({
                message:
                    "Falha na remoção do usuário. " + (error?.response?.data ?? ""),
                });
            })
        }
    }

    return (
        <Modal className="delete-usuario" closeModal={() => {}}>
          <p>
            <strong>Tem certeza que deseja remover esse usuário da empresa?</strong>
          </p>
          <p>
            O usuário <strong>{nomeUsuario}</strong> será removido da empresa <strong>{nomeEmpresa}</strong>.
          </p>
          <div className="d-flex w-100 justify-content-center">
            <button className="br-button secondary" data-testid="botao-confirmar" type="button" onClick={() => closeDialog(false)}>
              Cancelar
            </button>
            <button className="br-button primary" data-testid="botao-cancelar" type="button"onClick={removerUsuario}>
              Confirmar
            </button>
          </div>
        </Modal>
      );
}