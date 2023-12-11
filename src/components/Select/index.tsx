import { useEffect, useRef, useState } from "react";
import "./styles.css";

interface SelectOptions {
  id: string;
  rotulo: string;
}

export interface SelectItem {
  id: string;
  rotulo: string;
}

export interface SelectProps {
  readonly inputValue?: string;
  readonly items: SelectItem[];
  readonly value: string; //Valor selecionado atualmente
  readonly label?: string; //Titulo do dropdown
  readonly inputStyle?: object;
  readonly dropdownStyle?: object;
  readonly buttonStyle?: object;
  readonly onChange: (id: string, rotuloAtual?: string) => void;
  readonly filtrarTodos?: boolean;
  readonly definePlaceholder?: string;
  readonly inputReadOnly?: boolean;
}

export default function Select({ inputValue, items, value, label, onChange, inputStyle, dropdownStyle, buttonStyle, filtrarTodos, definePlaceholder, inputReadOnly=true }: SelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [novaLista, setNovaLista] = useState<SelectOptions[]>([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: SelectItem) => {
    onChange(item.id, item.rotulo);
    setIsOpen(false);
  };

  const getRotuloById = (id: string, items: SelectItem[]): string => {
    const item = items.find(item => item.id === id);
    return item ? item.rotulo : '';
  };

  useEffect(() => {

    if (filtrarTodos === true) { 
      const concatLista = [{ id: "", rotulo: "Todos" }].concat(items); 
      setNovaLista(concatLista);
      onChange("", "Todos")
    }
    else
      setNovaLista(items);
  }, [items])

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fechaDropdown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', fechaDropdown);

    return () => {
      document.removeEventListener('mousedown', fechaDropdown);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="profile-type-select br-select" style={{ flexBasis: "90%" }}>
      <div className="br-input ">
        <label className="profile-type-label ml-2" htmlFor="select-simple" ><p style={{ marginBottom: "4px" }}><strong>{label}</strong></p></label>
        <div className="br-input large input-button">
          {inputReadOnly && <input id="select-simple" data-testid="select-simple" type="text" placeholder={definePlaceholder} value={getRotuloById(value, novaLista)} readOnly={inputReadOnly} style={inputStyle} />}
          {!inputReadOnly && <input id="select-simple" data-testid="select-simple" type="text" placeholder={definePlaceholder} onChange={e => onChange("", e.target.value)} value={getRotuloById(value, novaLista)} style={inputStyle} readOnly={!inputReadOnly} />}
          {inputReadOnly && <button data-testid={`${label}customSelect`} className="br-button" type="button" aria-label="Exibir lista" tabIndex={-1} data-trigger="data-trigger" onClick={toggleDropdown} style={buttonStyle}>
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </button>}
        </div>
      </div>
      {isOpen &&
        <div className="br-list2" style={dropdownStyle} tabIndex={0}>
          {novaLista.map((item, index) => (
            <div key={index} data-testId={`${label}${index}`} className="br-item" tabIndex={-1} onClick={() => handleItemClick(item)} onKeyDown={() => { }}>
              <div className="br-radio">
                <input id={`rb${index}`} type="radio" name="estados-simples" value={item.rotulo} checked={value === item.id} onChange={() => { }} />
                <label htmlFor={`rb${index}`}>{item.rotulo}</label>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
