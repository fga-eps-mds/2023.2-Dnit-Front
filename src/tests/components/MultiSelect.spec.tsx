/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { render, waitFor, act } from "@testing-library/react";
import server from "../mock/servicosAPI";
import MultiSelect from "../../components/MultiSelect";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const testItems = [
    {
        id: "1",
        rotulo: "a"
    },
    {
        id: "2",
        rotulo: "b"
    },
    {
        id: "3",
        rotulo: "c"
    },
    {
        id: "4",
        rotulo: "d"
    }
]

describe("Testes para o componente MultiSelect", () => {
    
    it("Deve renderizar o componente", () => {
        const screen = render(
            <MultiSelect 
                items={testItems}
                onChange={(_id) => {}}
                value={[testItems[0].id, testItems[1].id]}
                label="MultiSelect"
            />
        )

        expect(screen.getByText("MultiSelect")).toBeInTheDocument();
    })

    it("Deve renderizar o componente com a opção todos", () => {
        const screen = render(
            <MultiSelect 
                items={testItems}
                onChange={(_id) => {}}
                value={[testItems[0].id, testItems[1].id]}
                label="MultiSelect"
                filtrarTodos={true}
            />
        )

        expect(screen.getByText("MultiSelect")).toBeInTheDocument();
    })

    it("Deve abrir o dropdown", () => {
        const screen = render(
            <MultiSelect 
                items={testItems}
                onChange={(_id) => {}}
                value={[testItems[0].id, testItems[1].id]}
                label="MultiSelect"
            />
        )

        act(() => {
            screen.getByTestId("MultiSelectcustomSelect").click()
            screen.getByTestId("MultiSelectcustomSelect").click()
        })
    })

    it("Deve abrir o dropdown e clicar em algum item (todos habilitado)", async () => {
        const screen = render(
            <MultiSelect 
                items={testItems}
                onChange={(_id) => {}}
                value={[testItems[0].id, testItems[1].id]}
                label="MultiSelect"
                filtrarTodos={true}
            />
        )

        act(() => {
            screen.getByTestId("MultiSelectcustomSelect").click()
        })

        const item = screen.getByTestId("cbs2")
        await waitFor(expect(item).toBeInTheDocument)
        act(() => {
            item.click()
        })
    })

    it("Deve abrir o dropdown e clicar em algum item (todos não habilitado)", async () => {
        const screen = render(
            <MultiSelect 
                items={testItems}
                onChange={(_id) => {}}
                value={[]}
                label="MultiSelect"
            />
        )

        act(() => {
            screen.getByTestId("MultiSelectcustomSelect").click()
        })

        const item = screen.getByTestId("cbs2")
        await waitFor(expect(item).toBeInTheDocument)
        act(() => {
            item.click()
        })
    })

    it("Deve abrir o dropdown e clicar em selecionar tudo", async () => {
        const screen = render(
            <MultiSelect 
                items={testItems}
                onChange={(_id) => {}}
                value={[testItems[0].id, testItems[1].id]}
                label="MultiSelect"
                filtrarTodos={true}
            />
        )
            
        act(() => {
            screen.getByTestId("MultiSelectcustomSelect").click()
        })

        const item = screen.getByTestId("cbs0")
        await waitFor(expect(item).toBeInTheDocument)
        act(() => {
            item.click()
        })
    })

    it("Deve abrir o dropdown e clicar em todos para deselecionar", async () => {
        const screen = render(
            <MultiSelect 
                items={testItems}
                onChange={(_id) => {}}
                value={[testItems[0].id, testItems[1].id, testItems[2].id, testItems[3].id]}
                label="MultiSelect"
                filtrarTodos={true}
            />
        )
            
        act(() => {
            screen.getByTestId("MultiSelectcustomSelect").click()
        })

        const item = screen.getByTestId("cbs0")
        await waitFor(expect(item).toBeInTheDocument)

        act(() => {
            item.click()
        })
    })
})