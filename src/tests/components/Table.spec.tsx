/* eslint-disable testing-library/render-result-naming-convention */
import { render, fireEvent } from "@testing-library/react";
import CustomTable, { CustomTableRow } from "../../components/Table";

describe("CustomTable Component", () => {
  const rowsData = [
    {
      id: "1",
      name: "John",
      age: "30",
    },
    {
      id: "2",
      name: "Alice",
      age: "28",
    },
    {
      id: "3",
      name: "Bob",
      age: "35",
    },
    {
      id: "4",
      name: "Eve",
      age: "22",
    },
  ];

  test("renders CustomTable component", () => {
    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={2}
        totalPages={2}
        totalItems={4}
        columsTitle={["Name", "Age"]}
        onPageResize={() => { }}
        onPageSelect={() => { }}
        onNextPage={() => { }}
        onPreviousPage={() => { }}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow
            data={element}
            id={2}
            hideEditIcon={index === 2 ? true : false}
          />
        ))}
      </CustomTable>
    );

    // Check if the table title is rendered
    const tableTitle = screen.getByText("Test Table");
    expect(tableTitle).toBeInTheDocument();

    // Check if column titles are rendered
    const columnName = screen.getByText("Name");
    expect(columnName).toBeInTheDocument();
    const columnAge = screen.getByText("Age");
    expect(columnAge).toBeInTheDocument();
  });

  test("changes items per page", () => {
    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={2}
        totalItems={4}
        columsTitle={["Name", "Age"]}
        onPageResize={() => { }}
        onPageSelect={() => { }}
        onNextPage={() => { }}
        onPreviousPage={() => { }}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow data={element} id={2} />
        ))}
      </CustomTable>
    );

    const itemsPerPageSelect = screen.getAllByLabelText("Exibir lista");
    fireEvent.click(itemsPerPageSelect[0]);

    const itemsPerPageOption = screen.getAllByText("2");
    fireEvent.click(itemsPerPageOption[1]);

    // Check if items per page has changed
    const itemsPerPage = screen.getAllByLabelText("Exibir lista");
    expect(itemsPerPage[0]).toHaveValue("2");
  });

  test("pagination works", () => {
    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={2}
        totalPages={2}
        totalItems={4}
        columsTitle={["Name", "Age"]}
        onPageResize={() => { }}
        onPageSelect={() => { }}
        onNextPage={() => { }}
        onPreviousPage={() => { }}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow
            data={element}
            id={2}
            hideEditIcon={index === 2 ? true : false}
          />
        ))}
      </CustomTable>
    );

    // Go to the next page
    const nextPageButton = screen.getByLabelText("Avançar página");
    fireEvent.click(nextPageButton);

    // Check if the next page is displayed
    const pageRange = screen.getByText("3-4 de 4 itens");
    expect(pageRange).toBeInTheDocument();

    // Go to the previous page
    const previousPageButton = screen.getByLabelText("Voltar página");
    fireEvent.click(previousPageButton);
  });

  test("renders rows in the table", () => {
    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={2}
        totalPages={2}
        totalItems={4}
        columsTitle={["Name", "Age"]}
        onPageResize={() => { }}
        onPageSelect={() => { }}
        onNextPage={() => { }}
        onPreviousPage={() => { }}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow
            data={element}
            id={2}
            hideEditIcon={index === 2 ? true : false}
          />
        ))}
      </CustomTable>
    );

    // Check if data rows are rendered
    const nameRow = screen.getByText("John");
    const ageRow = screen.getByText("30");
    expect(nameRow).toBeInTheDocument();
    expect(ageRow).toBeInTheDocument();
  });

  test("set items per page", () => {
    const onPageResizeMock = jest.fn();

    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={2}
        columsTitle={["Name", "Age"]}
        totalPages={2}
        totalItems={4}
        onPageResize={onPageResizeMock}
        onPageSelect={() => { }}
        onNextPage={() => { }}
        onPreviousPage={() => { }}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow
            data={element}
            id={2}
            hideEditIcon={index === 2 ? true : false}
          />
        ))}
      </CustomTable>
    );

    const selectOptions = screen.getByTestId("items-per-page");
    fireEvent.change(selectOptions, { target: { value: '1' } });

    const pageRange = screen.getByText("1-1 de 4 itens");
    expect(pageRange).toBeInTheDocument();

    expect(onPageResizeMock).toHaveBeenCalled();

  });

  test("change page via arows button", () => {
    const onNextPageMock = jest.fn();
    const onPreviousPageMock = jest.fn();

    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={1}
        totalPages={4}
        totalItems={4}
        columsTitle={["Name", "Age"]}
        onNextPage={onNextPageMock}
        onPreviousPage={onPreviousPageMock}
        onPageResize={() => { }}
        onPageSelect={() => { }}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow
            data={element}
            id={2}
            hideEditIcon={index === 2 ? true : false}
            hideEyeIcon={true}
            hideTrashIcon={true}
          />
        ))}
      </CustomTable>
    );

    const buttonNext = screen.getByTestId("proxima-pagina");
    fireEvent.blur(buttonNext);
    fireEvent.focus(buttonNext);
    fireEvent.click(buttonNext);

    const nextPageRange = screen.getByText("2-2 de 4 itens");
    expect(nextPageRange).toBeInTheDocument();
    expect(onNextPageMock).toHaveBeenCalled();

    const buttonPrevious = screen.getByTestId("volta-pagina");
    fireEvent.blur(buttonPrevious);
    fireEvent.focus(buttonPrevious);
    fireEvent.click(buttonPrevious);

    const previousPageRange = screen.getByText("1-1 de 4 itens");
    expect(previousPageRange).toBeInTheDocument();
    expect(onPreviousPageMock).toHaveBeenCalled();

  });

  test("chage page via page select dropdown", () => {
    const onPageSelectMock = jest.fn();

    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={1}
        totalPages={4}
        totalItems={4}
        columsTitle={["Name", "Age"]}
        onNextPage={() => { }}
        onPreviousPage={() => { }}
        onPageResize={() => { }}
        onPageSelect={onPageSelectMock}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow
            data={element}
            id={2}
            hideEditIcon={true}
            hideEyeIcon={true}
            hideTrashIcon={true}
          />
        ))}
      </CustomTable>
    );

    const pageSelect = screen.getByTestId("drop-select-page");
    fireEvent.blur(pageSelect);
    fireEvent.focus(pageSelect);
    fireEvent.change(pageSelect, { target: { value: '4' } });


    const pageRange = screen.getByText("4-4 de 4 itens");
    expect(pageRange).toBeInTheDocument();
    expect(onPageSelectMock).toHaveBeenCalled();

  });

  test("click on table buttons", () => {
    const onEditButtonMock = jest.fn();
    const onViewButtonMock = jest.fn();
    const onTrashButtonMock = jest.fn();
    const onPlusButtonMock = jest.fn();
    const onLocationButtonMock = jest.fn();

    const id = 1;
    

    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={id}
        totalPages={4}
        totalItems={4}
        columsTitle={["Name", "Age"]}
        onPageResize={() => { }}
        onPageSelect={() => { }}
        onNextPage={() => { }}
        onPreviousPage={() => { }}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow
            data={element}
            id={1}
            hideEditIcon={false}
            hideEyeIcon={false}
            hideTrashIcon={false}
            hidePlusIcon={false}
            hideLocationIcon={false}
            onDeleteRow={onTrashButtonMock}
            onEditRow={onEditButtonMock}
            onDetailRow={onViewButtonMock}
            onPlusRow={onPlusButtonMock}
            onLocationRow={onLocationButtonMock}
          />
        ))}
      </CustomTable>
    )

    const buttonEdit = screen.getByTestId(`table-row-edit-${id}`)
    fireEvent.click(buttonEdit);
    expect(onEditButtonMock).toHaveBeenCalledWith(id);

    const buttonView = screen.getByTestId(`table-row-eye-${id}`)
    fireEvent.click(buttonView);
    expect(onViewButtonMock).toHaveBeenCalledWith(id);

    const buttonTrash = screen.getByTestId(`table-row-delete-${id}`)
    fireEvent.click(buttonTrash);
    expect(onTrashButtonMock).toHaveBeenCalledWith(id);

    const buttonPlus = screen.getByTestId(`table-row-plus-${id}`)
    fireEvent.click(buttonPlus);
    expect(onPlusButtonMock).toHaveBeenCalledWith(id);

    const buttonLocation = screen.getByTestId(`table-row-location-${id}`)
    fireEvent.click(buttonLocation);
    expect(onPlusButtonMock).toHaveBeenCalledWith(id);
  });

  test("Não passar pagina", () => {
    const onNextPageMock = jest.fn();
    const onPreviousPageMock = jest.fn();

    const screen = render(
      <CustomTable
        title="Test Table"
        initialItemsPerPage={4}
        totalPages={1}
        totalItems={4}
        columsTitle={["Name", "Age"]}
        onNextPage={onNextPageMock}
        onPreviousPage={onPreviousPageMock}
        onPageResize={() => { }}
        onPageSelect={() => { }}
      >
        {rowsData.map((element, index) => (
          <CustomTableRow
            data={element}
            id={2}
            hideEditIcon={index === 2 ? true : false}
            hideEyeIcon={true}
            hideTrashIcon={true}
          />
        ))}
      </CustomTable>
    );

    const buttonNext = screen.getByTestId("proxima-pagina");
    fireEvent.blur(buttonNext);
    fireEvent.focus(buttonNext);
    fireEvent.click(buttonNext);

    const nextPageRange = screen.getByText("1-4 de 4 itens");
    expect(nextPageRange).toBeInTheDocument();
    expect(onNextPageMock).not.toHaveBeenCalled();

    const buttonPrevious = screen.getByTestId("volta-pagina");
    fireEvent.blur(buttonPrevious);
    fireEvent.focus(buttonPrevious);
    fireEvent.click(buttonPrevious);

    const previousPageRange = screen.getByText("1-4 de 4 itens");
    expect(previousPageRange).toBeInTheDocument();
    expect(onPreviousPageMock).not.toHaveBeenCalled();

  });

});
