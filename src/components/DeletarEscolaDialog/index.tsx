import Modal from "../Modal";
import "./styles.css";
import { EscolasPlanejamentoTabela } from "../../models/gerenciarAcoes";

interface DeletarEscolaDialogProps {
  readonly escola: EscolasPlanejamentoTabela | undefined;
  readonly closeDialog: (deleted: boolean) => void;
  readonly onConfirm: () => void;
}

export default function DeletarEscolaDialog({
  escola,
  closeDialog,
  onConfirm,
}: DeletarEscolaDialogProps) {
  return (
    <Modal
      className="delete-escola-planejamento"
      closeModal={() => closeDialog(false)}
    >
      <p>
        <strong>Tem certeza que deseja excluir esta escola?</strong>
      </p>
      <p data-testid="delete-text">
        A escola <strong>{escola?.nome}</strong> será excluída do planejamento.
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
          onClick={onConfirm}
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
}
