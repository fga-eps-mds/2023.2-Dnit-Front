import "./styles.css";

export interface SelectSchoolProps {
  readonly schoolId: number;
  readonly schoolName: string;
  readonly schoolUf: string;
  readonly schoolStudents: number;
  readonly isSelected?: boolean;
  readonly isDisabled?: boolean;
  readonly onClick: (id: number) => void;
}

export default function SelectSchoolCard({
  schoolId,
  schoolName,
  schoolStudents,
  schoolUf,
  isSelected = false,
  isDisabled = false,
  onClick,
}: SelectSchoolProps) {
  return (
    <div
      className={
        isDisabled
          ? "select-school-card disabled"
          : isSelected
          ? "select-school-card selected"
          : "select-school-card"
      }
      onClick={() => onClick(schoolId)}
      onKeyDown={(event) => {}}
    >
      <span className="card-text school-name">Nome: {schoolName}</span>
      <span className="card-text">UF: {schoolUf}</span>
      <span className="card-text">Qtd Alunos: {schoolStudents}</span>
    </div>
  );
}
