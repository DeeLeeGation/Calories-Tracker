from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base



class Food(Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), index=True)

    name_norm: Mapped[str] = mapped_column(String(200), index=True)

    kcal_per_100g: Mapped[int] = mapped_column(Integer)
    protein_per_100g: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fat_per_100g: Mapped[int | None] = mapped_column(Integer, nullable=True)
    carbs_per_100g: Mapped[int | None] = mapped_column(Integer, nullable=True)


class LogEntry(Base):
    __tablename__ = "log_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    date: Mapped[str] = mapped_column(String(10), index=True)  # YYYY-MM-DD
    food_id: Mapped[int] = mapped_column(ForeignKey("foods.id"), index=True)
    grams: Mapped[int] = mapped_column(Integer)

    food: Mapped["Food"] = relationship("Food")
