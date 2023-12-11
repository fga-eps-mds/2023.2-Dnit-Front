import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "../../components/Modal/index";

describe("Modal Component", () => {
  test("Renders Modal component with default class and children", () => {
    render(
      <Modal className="modal-container" closeModal={() => {}}>
        <div>Modal Content</div>
      </Modal>
    ); 

    const modalOverlay = screen.getByTestId("overlay");
    expect(modalOverlay).toHaveClass("overlay modal-container");

    const modalContent = screen.getByText("Modal Content");
    expect(modalContent).toBeInTheDocument();
  });

  test("Renders Modal component with a custom class", () => {
    render(
      <Modal className="custom" closeModal={() => {}}>
        <div>Custom Modal Content</div>
      </Modal>
    );

    const modalOverlay = screen.getByTestId("overlay");
    expect(modalOverlay).toHaveClass("overlay custom");
  });

  test('Close Modal when overlay is clicked', () => {
    const closeModalMock = jest.fn();
    const { getByTestId } = render(
      <Modal className="test-class" closeModal={closeModalMock}>
        <div>Conteúdo do Modal</div>
      </Modal>
    );

    const overlay = getByTestId('overlay');
    fireEvent.click(overlay); 
    expect(closeModalMock).toHaveBeenCalledWith(false); 
  });

  test('Dont close Modal when overlay is not clicked', () => {
    const closeModalMock = jest.fn();
    const { getByTestId } = render(
      <Modal className="test-class" closeModal={closeModalMock}>
        <div>Conteúdo do Modal</div>
      </Modal>
    );

    const modalContent = getByTestId('overlay').firstChild; 
    if (modalContent) {
      fireEvent.mouseDown(modalContent);
    }
    expect(closeModalMock).not.toHaveBeenCalled();
  });

});
