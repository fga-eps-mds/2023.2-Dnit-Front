import { formataCustoLogistico, numeroCustoLogistico } from "../utils/utils";

describe("formataCustoLogistico", () => {
  it('deve retornar "$" para distâncias menores ou iguais a 250', () => {
    expect(formataCustoLogistico(250)).toBe("$");
  });

  it('deve retornar "$$" para distâncias maiores que 250 e menores ou iguais a 500', () => {
    expect(formataCustoLogistico(300)).toBe("$$");
  });

  it('deve retornar "$$$" para distâncias maiores que 500 e menores ou iguais a 1000', () => {
    expect(formataCustoLogistico(600)).toBe("$$$");
  });

  it('deve retornar "$$$$" para distâncias maiores que 1000', () => {
    expect(formataCustoLogistico(1500)).toBe("$$$$");
  });
});

describe("numeroCustoLogistico", () => {
  it("deve retornar 1 para distâncias menores ou iguais a 250", () => {
    expect(numeroCustoLogistico(250)).toBe(1);
  });

  it("deve retornar 2 para distâncias maiores que 250 e menores ou iguais a 500", () => {
    expect(numeroCustoLogistico(300)).toBe(2);
  });

  it("deve retornar 3 para distâncias maiores que 500 e menores ou iguais a 1000", () => {
    expect(numeroCustoLogistico(600)).toBe(3);
  });

  it("deve retornar 4 para distâncias maiores que 1000", () => {
    expect(numeroCustoLogistico(1500)).toBe(4);
  });
});
