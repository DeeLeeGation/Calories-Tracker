from models import Food, LogEntry
from sqlalchemy.orm import Session
from sqlalchemy import select, func, case


def suggest_foods(db: Session, q: str, limit: int = 8) -> list[Food]:
    q = (q or "").strip()

    if not q:
        stmt = select(Food).order_by(Food.name.asc()).limit(limit)
        return list(db.scalars(stmt).all())

    qn = q.lower()

    score = case(
        (Food.name_norm.like(f"{qn}%"), 2),
        (Food.name_norm.like(f"%{qn}%"), 1),
        else_=0,
    )

    stmt = (
        select(Food)
        .where(score > 0)
        .order_by(score.desc(), Food.name.asc())
        .limit(limit)
    )

    return list(db.scalars(stmt).all())


def add_log(db: Session, date: str, food_id: int, grams: int) -> LogEntry:
    entry = LogEntry(date=date, food_id=food_id, grams=grams)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def list_logs_for_date(db: Session, date: str) -> list[LogEntry]:
    stmt = select(LogEntry).where(LogEntry.date == date).order_by(LogEntry.id.desc())
    return list(db.scalars(stmt).all())


def delete_log(db: Session, entry_id: int) -> bool:
    entry = db.get(LogEntry, entry_id)
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True
