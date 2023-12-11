import { useState } from "react";
import Modal from "../Modal";
import { notification } from "antd";
import "./styles.css"
import { deletePolo } from "../../service/poloApi";

export interface DeletarPoloDialogArgs {
  id: number;
  nome: string;
}

interface DeletarPoloDialogProps {
    readonly id: number;
    readonly nome: string;
    readonly closeDialog: (deleted: boolean) => void;
}

export default function DeletarPoloDialog( { id, nome, closeDialog }: DeletarPoloDialogProps) {
    const deletarPolo = () => {
        deletePolo(id)
        .then(() => {
            notification.success({ message: "Polo deletado com sucesso" });
            closeDialog(true);
          })
        .catch((error) => {
            notification.error({
              message:
                "Falha na exclusão do polo. " + (error?.response?.data ?? ""),
            });
          })
    }

    return (
        <Modal className="delete-polo" closeModal={() => { closeDialog(false) }}>
          <p>
            <strong>Tem certeza que deseja excluir esse polo?</strong>
          </p>
          <p>
            O polo <strong>{nome}</strong> será excluído para sempre.
          </p>
          <div className="d-flex w-100 justify-content-center">
            <button className="br-button secondary" type="button" onClick={() => closeDialog(false)} data-testid="botaoCancelar">
              Cancelar
            </button>
            <button className="br-button primary" type="button"onClick={deletarPolo} data-testid="botaoConfirmar">
              Confirmar
            </button>
          </div>
        </Modal>
      );
}