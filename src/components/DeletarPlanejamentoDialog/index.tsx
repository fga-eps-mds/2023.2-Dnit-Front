import Modal from "../Modal";
import "./styles.css";
import { PlanejamentoMacro } from "../../models/gerenciarAcoes";

interface DeletarPlanejamentoDialogProps {
  readonly planejamento: PlanejamentoMacro;
  readonly closeDialog: (deleted: boolean) => void;
  readonly onClick: (planejamentoId: string) => void;
}

export default function DeletarPlanejamentoDialog({
  planejamento,
  closeDialog,
  onClick,
}: DeletarPlanejamentoDialogProps) {
  return (
    <Modal
      className="delete-planejamento"
      closeModal={() => closeDialog(false)}
    >
      <p>
        <strong>Tem certeza que deseja excluir este planejamento?</strong>
      </p>
      <p>
        O planejamento{" "}
        <strong>{planejamento.nome} será excluído do sistema.</strong>
      </p>
      <div className="d-flex w-100 justify-content-end mb-2">
        <button
          className="br-button secondary"
          type="button"
          onClick={() => closeDialog(false)}
          data-testid="botaoCancelar"
        >
          Cancelar
        </button>

        <button
          className="br-button primary"
          type="button"
          data-testid="botaoConfirmar"
          onClick={() => onClick(planejamento.id)}
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
}
