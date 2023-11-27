import { useState } from "react";
import Modal from "../Modal";
import { deleteEmpresa } from "../../service/empresaApi";
import { notification } from "antd";
import "./styles.css"

export interface DeletarEmpresaDialogArgs {
  id: string;
  nome: string;
}

interface DeletarEmpresaDialogProps {
    readonly id: string;
    readonly nome: string;
    readonly closeDialog: (deleted: boolean) => void;
}

export default function DeletarEmpresaDialog( { id, nome, closeDialog }: DeletarEmpresaDialogProps) {
    const deletarEmpresa = () => {
        deleteEmpresa(id)
        .then(() => {
            notification.success({ message: "Empresa deletada com sucesso" });
            closeDialog(true);
          })
        .catch((error) => {
            notification.error({
              message:
                "Falha na exclusão da empresa. " + (error?.response?.data ?? ""),
            });
          })
    }

    return (
        <Modal className="delete-empresa" closeModal={() => { closeDialog(false) }}>
          <p>
            <strong>Tem certeza que deseja excluir essa empresa?</strong>
          </p>
          <p>
            A empresa <strong>{nome}</strong> será excluída para sempre.
          </p>
          <div className="d-flex w-100 justify-content-center">
            <button className="br-button secondary" type="button" onClick={() => closeDialog(false)} data-testid="botaoCancelar">
              Cancelar
            </button>
            <button className="br-button primary" type="button"onClick={deletarEmpresa} data-testid="botaoConfirmar">
              Confirmar
            </button>
          </div>
        </Modal>
      );
}