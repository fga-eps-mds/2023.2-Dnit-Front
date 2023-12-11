import { ReactNode, useEffect, useState } from "react";
import "./styles.css";

interface CustomTableProps {
  title: string;
  initialItemsPerPage: number;
  columsTitle: string[];
  totalPages?: number;
  totalItems?: number;
  children: ReactNode[];
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onPageResize?: (newItemsPerPage: number) => void;
  onPageSelect?: (newSelectedPage: number) => void;
}

interface CustomTableRowsProps {
  data: Record<string, string>;
  id: number;
  hideEditIcon?: boolean;
  hideEyeIcon?: boolean;
  hideTrashIcon?: boolean;
  hideUsersIcon?: boolean;
  hideChangeIcon?: boolean;
  hidePlusIcon?: boolean;
  hideDownloadIcon?: boolean;
  hideLocationIcon?: boolean;
  onDeleteRow?: (rowIndex: number) => void;
  onEditRow?: (rowIndex: number) => void;
  onDetailRow?: (rowIndex: number) => void;
  onChangeRow?: (rowIndex: number) => void;
  onUsersRow?: (rowIndex: number) => void;
  onPlusRow?: (rowIndex: number) => void;
  onDownload?: (rowIndex: number) => void;
  onLocationRow?: (rowIndex: number) => void;
}

export function CustomTableRow({
  data,
  id,
  onDeleteRow = () => {},
  onEditRow = () => {},
  onDetailRow = () => {},
  onChangeRow = () => {},
  onUsersRow = () => {},
  onPlusRow = () => {},
  onDownload = () => {},
  onLocationRow = () => {},
  hideEditIcon = false,
  hideEyeIcon = false,
  hideTrashIcon = false,
  hideUsersIcon = true,
  hideChangeIcon = true,
  hidePlusIcon = true,
  hideDownloadIcon = true,
  hideLocationIcon = true,
}: CustomTableRowsProps) {
  const columns = Object.keys(data);

  return (
    <tr>
      {columns.map((column, colIndex) =>
        column === "Custo logístico" ? (
          <td key={`${id}-${column}`}>
            <div className="icon-row-cost">
              {[...Array(Number(data[column]))].map((_, digitIndex) => (
                <i
                  data-testid={`table-row-seeuser-${id}`}
                  className="fas fa-dollar-sign"
                  aria-hidden="true"
                  onClick={() => onUsersRow(id)}
                  key={`${id}-${digitIndex}`}
                />
              ))}
            </div>
          </td>
        ) : (
          <td key={`${id}-${column}`} data-th={colIndex}>
            {data[column]}
          </td>
        )
      )}
      <td>
        <div className="icon-row">
          {!hideUsersIcon && (
            <i
              data-testid={`table-row-seeuser-${id}`}
              className="fas fa-user"
              aria-hidden="true"
              onClick={() => onUsersRow(id)}
            />
          )}
          {!hidePlusIcon && (
            <i
              data-testid={`table-row-plus-${id}`}
              className="fas fa-plus"
              aria-hidden="true"
              onClick={() => onPlusRow(id)}
            />
          )}
          {!hideDownloadIcon && (
            <i
              data-testid={`table-row-download-${id}`}
              className="fas fa-download"
              aria-hidden="true"
              onClick={() => onDownload(id)}
            />
          )}
          {!hideEditIcon && (
            <i
              data-testid={`table-row-edit-${id}`}
              className="fas fa-edit"
              aria-hidden="true"
              onClick={() => onEditRow(id)}
            />
          )}
          {!hideEyeIcon && (
            <i
              data-testid={`table-row-eye-${id}`}
              className="fas fa-eye"
              aria-hidden="true"
              onClick={() => onDetailRow(id)}
            />
          )}
          {!hideChangeIcon && (
            <i
              data-testid={`table-row-change-${id}`}
              className="fas fa-repeat"
              aria-hidden="true"
              onClick={() => onChangeRow(id)}
            />
          )}
          {!hideLocationIcon && (
            <i
              data-testid={`table-row-location-${id}`}
              className="fas fa-location-dot"
              aria-hidden="true"
              onClick={() => onLocationRow(id)}
            />
          )}
          {!hideTrashIcon && (
            <i
              data-testid={`table-row-delete-${id}`}
              className="fas fa-trash-alt"
              aria-hidden="true"
              onClick={() => onDeleteRow(id)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

export default function CustomTable({
  title,
  children,
  columsTitle,
  initialItemsPerPage,
  onNextPage,
  onPreviousPage,
  onPageResize,
  onPageSelect,
  totalPages,
  totalItems,
}: CustomTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [isPageItemsOpen, setPageItemsOpen] = useState(false);
  const [isPageIndexOpen, setPageIndexOpen] = useState(false);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const [indexOfLastItem, setIndexOfLastItem] = useState(itemsPerPage);
  const [currentItems, setCurrentItems] = useState<ReactNode[]>([]);

  const dataSize = totalItems ? totalItems : 1;

  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.max(1, Math.ceil(dataSize / itemsPerPage)); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    const lastItem =
      currentPage * itemsPerPage > children.length
        ? children.length
        : currentPage * itemsPerPage;

    const firstItem = Math.max(lastItem - itemsPerPage, 0);

    const screenLastItem =
      currentPage * itemsPerPage > dataSize
        ? dataSize
        : currentPage * itemsPerPage;

    const screenFirstItem = Math.max(screenLastItem - itemsPerPage, 0);

    setIndexOfFirstItem(screenFirstItem);
    setIndexOfLastItem(screenLastItem);
    setCurrentItems(children.slice(firstItem, lastItem));
  }, [currentPage, itemsPerPage, children]);

  if (children.length === 0) return null;

  const changeItemsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const valorPagina = parseInt(event.target.value);
    setItemsPerPage(valorPagina);
    pageResize(valorPagina);
    setPageItemsOpen(false);
  };

  const changeSelectedPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const valorPaginaSelecionada = parseInt(event.target.value);
    setCurrentPage(valorPaginaSelecionada);
    pageSelect(valorPaginaSelecionada);
    setPageIndexOpen(false);
  };

  function previousPage() {
    if (currentPage === 1) return;
    onPreviousPage && onPreviousPage();
    setCurrentPage(currentPage - 1);
  }

  function nextPage() {
    if (currentPage === totalPages) return;
    onNextPage && onNextPage();
    setCurrentPage(currentPage + 1);
  }

  function pageResize(newItensPerPage: number) {
    onPageResize && onPageResize(newItensPerPage);
    setItemsPerPage(newItensPerPage);
  }

  function pageSelect(newSelectedPage: number) {
    onPageSelect && onPageSelect(newSelectedPage);
  }

  const pageOptions = [1, 2, 5, 10, 25, 50, 100, 150, 200, 500, 1000, 2000];

  return (
    <div
      className="br-table ml-3 mr-3"
      data-search="data-search"
      data-selection="data-selection"
      data-collapse="data-collapse"
      data-random="data-random"
    >
      <div className="table-header">
        <div className="top-bar">
          <div className="table-title mb-1">{title}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columsTitle.map((element, index) => (
              <th
                key={`${title}-${element}`}
                scope="col"
                style={{ color: "#1351B4", fontWeight: "bold" }}
                data-testid={`table-row-${index}`}
              >
                {element}
              </th>
            ))}
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>{currentItems.map((item, _) => item)}</tbody>
      </table>
      <div className="table-footer">
        <nav
          className="br-pagination"
          aria-label="Paginação de resultados"
          data-total={dataSize}
          data-current={currentPage}
          data-per-page={itemsPerPage}
        >
          <div className="pagination-per-page">
            <div className="br-select">
              <div className="br-input select-div">
                <label htmlFor="per-page-selection-random-94892">Exibir</label>
                <select
                  data-testid="items-per-page"
                  className="select-expand"
                  aria-label="Exibir lista"
                  tabIndex={-1}
                  data-trigger="data-trigger"
                  onChange={(value) => {
                    changeItemsPerPage(value);
                  }}
                  onFocus={() => setPageItemsOpen(true)}
                  onBlur={() => setPageItemsOpen(false)}
                  value={itemsPerPage}
                >
                  {pageOptions.map((element) => {
                    return element <= dataSize * 3 ? (
                      <option key={element} value={element}>
                        {element}
                      </option>
                    ) : null;
                  })}
                </select>
                <i
                  className={
                    isPageItemsOpen
                      ? "fas fa-angle-down select-icon"
                      : "fas fa-angle-up select-icon"
                  }
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <span className="br-divider d-none d-sm-block mx-3"></span>
          <div className="pagination-inhtmlFormation d-none d-sm-flex">
            {!!totalItems && (
              <span className="current">
                {`${indexOfFirstItem + 1}-${indexOfLastItem} de ${
                  dataSize <= 10 ? children.length : dataSize
                } itens`}
              </span>
            )}
          </div>
          <div className="pagination-go-to-page d-none d-sm-flex ml-auto">
            <div className="br-select">
              <div className="br-input select-div">
                <label htmlFor="per-page-selection-random-94892">Página</label>
                <select
                  data-testid="drop-select-page"
                  className="select-expand"
                  aria-label="Exibir página"
                  tabIndex={-1}
                  data-trigger="data-trigger"
                  onChange={(value) => {
                    changeSelectedPage(value);
                  }}
                  defaultValue={currentPage}
                  onFocus={() => setPageIndexOpen(true)}
                  onBlur={() => setPageIndexOpen(false)}
                  value={currentPage}
                >
                  {pageNumbers.map((element) => (
                    <option key={element} value={element}>
                      {element}
                    </option>
                  ))}
                </select>
                <i
                  className={
                    isPageIndexOpen
                      ? "fas fa-angle-down select-icon"
                      : "fas fa-angle-up select-icon"
                  }
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <span className="br-divider d-none d-sm-block mx-3"></span>
          <div className="pagination-arrows ml-auto ml-sm-0">
            <button
              data-testid="volta-pagina"
              className="br-button circle"
              type="button"
              aria-label="Voltar página"
              onClick={previousPage}
            >
              <i className="fas fa-angle-left" aria-hidden="true"></i>
            </button>
            <button
              data-testid="proxima-pagina"
              className="br-button circle"
              type="button"
              aria-label="Avançar página"
              onClick={nextPage}
            >
              <i className="fas fa-angle-right" aria-hidden="true"></i>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
