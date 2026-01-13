from sqlalchemy.orm import Session
from models import Food


def food(
    name: str,
    kcal: int,
    protein: int | None = None,
    fat: int | None = None,
    carbs: int | None = None,
) -> Food:
    return Food(
        name=name,
        name_norm=name.lower(),
        kcal_per_100g=kcal,
        protein_per_100g=protein,
        fat_per_100g=fat,
        carbs_per_100g=carbs,
    )


SEED_FOODS: list[Food] = [
    food("Молоко 2.5%", 52, 3, 3, 5),
    food("Молоко 1.5%", 44, 3, 2, 5),
    food("Творог 5%", 121, 17, 5, 3),
    food("Яйцо куриное", 157, 13, 11, 1),
    food("Куриная грудка", 165, 31, 4, 0),
]


def run_seed(db: Session) -> None:
    if db.query(Food).count() > 0:
        return
    db.add_all(SEED_FOODS)
    db.commit()
