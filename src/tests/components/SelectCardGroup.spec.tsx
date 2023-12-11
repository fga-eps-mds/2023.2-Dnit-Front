import { fireEvent, render } from "@testing-library/react";
import SelectCardGroup from "../../components/SelectCardGroup";

afterEach(jest.clearAllMocks);

const cardsTest = [
  { id: 0, title: "titulo 0", info: ["texto"] },
  { id: 1, title: "titulo 1", info: ["texto 1"] },
  { id: 2, title: "titulo 2", info: ["texto 2"] },
];

describe("Testes para o componente SelectCardGroup", () => {
  test("Deve renderizar o componente de card", () => {
    const screen = render(
      <div>
        <SelectCardGroup cardsData={cardsTest} onClick={() => {}} />
      </div>
    );

    expect(screen.getByText("titulo 0")).toBeInTheDocument();
  });

  test("Deve renderizar o componente de card pequeno", () => {
    const screen = render(
      <div>
        <SelectCardGroup
          cardsData={cardsTest}
          onClick={() => {}}
          isSmallCard={true}
        />
      </div>
    );

    expect(screen.getByText("titulo 0")).toBeInTheDocument();
  });

  test("Deve clicar no card", () => {
    const onCardClickMock = jest.fn();

    const screen = render(
      <div>
        <SelectCardGroup cardsData={cardsTest} onClick={onCardClickMock} />
      </div>
    );

    const botao = screen.getByText("titulo 0");
    fireEvent.click(botao);

    expect(onCardClickMock).toHaveBeenCalled();
  });
});
