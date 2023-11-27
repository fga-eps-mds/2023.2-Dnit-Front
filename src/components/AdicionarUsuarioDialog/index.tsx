import { useEffect, useState } from "react";
import Modal from "../Modal";
import { adicionarUsuarioEmpresa } from "../../service/empresaApi";
import { notification } from "antd";
import { fetchUsuarios } from "../../service/usuarioApi";
import { FilterOptions, ListaPaginada } from "../../pages/gerencia/GerenciarUsuario";
import Select from "../Select";
import "./styles.css"

interface AdicionarUsuarioDialogProps {
    readonly cnpj: string | undefined;
    readonly nomeEmpresa: string | undefined;
    readonly closeDialog: (added: boolean) => void;
}

interface UsuarioItem {
    readonly id: string;
    readonly rotulo: string;
}

export default function AdicionarUsuarioDialog({ cnpj, nomeEmpresa, closeDialog }: AdicionarUsuarioDialogProps) {
    const [currentInputValue, setCurrentInputValue] = useState<string>("")
    const [currentInputRotulo, setCurrentInputRotulo] = useState<string>("")
    const [selectedItems, setSelectedItems] = useState<UsuarioItem[]>([]);
    const [listaUsuarios, setListaUsuarios] = useState<FilterOptions[]>([]);

    const buscarUsuarios = async () => {
        fetchUsuarios<ListaPaginada>({pagina: 1, itemsPorPagina: 15, nome: currentInputRotulo})
            .then(lista => {
                setListaUsuarios(lista.items
                    .filter(user => user.empresa?.cnpj !== cnpj && !selectedItems.some(u => u.id === user.id))
                    .map((user) => ({ id: user.id, rotulo: user.nome + " - " + user.email})));
            })
            .catch(error => {
                notification.error({message: "Erro ao obter usuários."} + 
                    (error?.response?.data ?? ""));
            })
    }

    const adicionarUsuarios = async (usuarioids: UsuarioItem[]) => {
        if (!cnpj || usuarioids.length === 0) return;

        let errorUsers = [];
        for (let item of usuarioids) {
            try {
                await adicionarUsuarioEmpresa({cnpj, usuarioid: item.id});
            }
            catch (error: any) {
                errorUsers.push(item.rotulo)
                notification.error({message: `Falha ao adicionar o usuário ${item.rotulo}.` + 
                    (error?.response?.data ?? "")});
            }
        }
        if (errorUsers.length === 0) {
            notification.success({message: "Usuários adicionados com sucesso."});
        }
        closeDialog(true);
    }

    const getRotuloById = (id: string, rotulo?: string): string => {
        const item = listaUsuarios.find(item => item.id === id);
        return item ? item.rotulo : rotulo ?? "";
    };

    useEffect(() => {
        buscarUsuarios();
    }, [currentInputValue, selectedItems]);

    return (
        <Modal className="adicionar-usuario-empresa" closeModal={() => {closeDialog(false)}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 className="text-center mt-1">Adicionar Usuários - {nomeEmpresa}</h4>
            </div>
            <Select items={listaUsuarios} value={""} label={"Selecionar Usuários"} onChange={(inputValueId, inputValueRotulo="") => {
                if (inputValueId === "" && inputValueRotulo) {
                    setCurrentInputValue(getRotuloById(inputValueId, inputValueRotulo));
                    setCurrentInputRotulo(inputValueRotulo);
                    return;
                }
                const newSelectedItems = inputValueId && inputValueRotulo ? [...selectedItems, {id: inputValueId, rotulo: inputValueRotulo}] : selectedItems;
                setSelectedItems(newSelectedItems);
                setCurrentInputValue("");
                setCurrentInputRotulo("");
            }} inputValue={currentInputValue} inputReadOnly={false} dropdownStyle={{ marginLeft: "0px", width: "280px" }}
            />
            <p className="usuarios-selecionados">Usuários selecionados:</p>
            <ul>
                {
                    selectedItems.map((item, index) => {
                        return (
                            <li key={`${item.id}`} data-testid={`usuarioadicionar${index}`}>
                                <div>{item.rotulo}</div>
                                <i className="fas fa-close" aria-hidden={true} data-testid={`usuarioadicionarcancelar${index}`} onClick={() => setSelectedItems(selectedItems.filter(it => it.id !== item.id))}></i>
                            </li>
                        )
                    })
                }
            </ul>
            
          <div className="d-flex w-100 justify-content-center">
            <button className="br-button secondary" data-testid="botao-cancelar" type="button" onClick={() => closeDialog(false)}>
              Cancelar
            </button>
            <button className="br-button primary" data-testid="botao-cadastrar" type="button"onClick={() => adicionarUsuarios(selectedItems)}>
              Adicionar
            </button>
          </div>
        </Modal>
      );
}