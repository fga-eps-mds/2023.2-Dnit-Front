import React, { useEffect, useState } from "react";
import "./styles.css";

type MonthSelectProps = {
  onMonthSelected: (data: string) => void;
  valueSelected?: string;
  disabled: boolean;
};

const MonthSelect = ({
  onMonthSelected,
  disabled,
  valueSelected = "",
}: MonthSelectProps) => {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    onMonthSelected(e.target.value);
  };

  useEffect(() => {
    setSelectedMonth(valueSelected);
  }, [valueSelected]);

  return (
    <div className="custom-select">
      <select value={selectedMonth} onChange={handleChange} disabled={disabled}>
        <option value="">Selecione...</option>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelect;
