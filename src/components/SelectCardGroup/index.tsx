import { useState } from "react";
import "./styles.css";

export interface SelectCardProps {
  readonly cardData: SelectCardData;
  readonly selected?: boolean;
  readonly isSmallCard: boolean;
  readonly onClick: (id: number) => void;
}

export interface SelectCardGroupProps {
  readonly cardsData: SelectCardData[];
  readonly isSmallCard?: boolean;
  readonly onClick: (id: number) => void;
}

export interface SelectCardData {
  readonly id: number;
  readonly title: string;
  readonly info: string[];
}

export default function SelectCardGroup({
  cardsData,
  isSmallCard = false,
  onClick,
}: SelectCardGroupProps) {
  const [selectedCard, setSelectedCard] = useState(cardsData[0].id);

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
    onClick(cardId);
  };

  return (
    <div className="select-cards-group">
      {cardsData.map((card) => (
        <SelectCard
          key={card.id}
          cardData={card}
          selected={selectedCard === card.id}
          onClick={handleCardClick}
          isSmallCard={isSmallCard}
        />
      ))}
    </div>
  );
}

export function SelectCard({
  cardData,
  selected = false,
  isSmallCard = false,
  onClick,
}: SelectCardProps) {
  return (
    <div
      className={selected ? "select-card selected" : "select-card"}
      onClick={() => onClick(cardData.id)}
      onKeyDown={(event) => {}}
    >
      <p className={isSmallCard ? "card-title-sm" : "card-title"}>
        {cardData.title}
      </p>
      <div className="card-info">
        {cardData.info.map((item) => (
          <span
            className={isSmallCard ? "card-info-item-sm" : "card-info-item"}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
