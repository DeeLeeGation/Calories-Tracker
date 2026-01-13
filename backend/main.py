from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from schemas import FoodOut, FoodCreate
from models import Food
from db import Base, engine, get_db, SessionLocal
from schemas import FoodOut, LogCreate, LogOut, DaySummary
import crud
from seed import run_seed
from sqlalchemy import select
from models import Food
from settings import settings


app = FastAPI(title="Calories API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()


@app.post("/foods", response_model=FoodOut)
def foods_create(payload: FoodCreate, db: Session = Depends(get_db)):
    food = Food(
        name=payload.name.strip(),
        name_norm=payload.name.strip().lower(),
        kcal_per_100g=payload.kcal_per_100g,
        protein_per_100g=payload.protein_per_100g,
        fat_per_100g=payload.fat_per_100g,
        carbs_per_100g=payload.carbs_per_100g,
    )
    db.add(food)
    db.commit()
    db.refresh(food)
    return food


@app.get("/foods")
def foods_all(db: Session = Depends(get_db)):
    rows = db.execute(select(Food).order_by(Food.id.asc())).scalars().all()
    return [
        {"id": f.id, "name": f.name, "name_norm": getattr(f, "name_norm", None)}
        for f in rows
    ]


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/foods/suggest", response_model=list[FoodOut])
def foods_suggest(
    q: str = Query(default="", max_length=80), db: Session = Depends(get_db)
):
    return crud.suggest_foods(db, q=q, limit=8)


@app.post("/log", response_model=LogOut)
def log_add(payload: LogCreate, db: Session = Depends(get_db)):
    entry = crud.add_log(
        db, date=payload.date, food_id=payload.food_id, grams=payload.grams
    )
    db.refresh(entry)
    kcal_total = (entry.grams * entry.food.kcal_per_100g) // 100
    return {
        "id": entry.id,
        "date": entry.date,
        "grams": entry.grams,
        "food": entry.food,
        "kcal_total": kcal_total,
    }


@app.get("/log", response_model=list[LogOut])
def log_list(
    date: str = Query(pattern=r"^\d{4}-\d{2}-\d{2}$"), db: Session = Depends(get_db)
):
    entries = crud.list_logs_for_date(db, date=date)
    out: list[dict] = []
    for e in entries:
        out.append(
            {
                "id": e.id,
                "date": e.date,
                "grams": e.grams,
                "food": e.food,
                "kcal_total": (e.grams * e.food.kcal_per_100g) // 100,
            }
        )
    return out


@app.delete("/log/{entry_id}")
def log_delete(entry_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_log(db, entry_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


@app.get("/summary/day", response_model=DaySummary)
def summary_day(
    date: str = Query(pattern=r"^\d{4}-\d{2}-\d{2}$"), db: Session = Depends(get_db)
):
    entries = crud.list_logs_for_date(db, date=date)

    kcal = 0
    p = 0
    f = 0
    c = 0

    for e in entries:
        kcal += (e.grams * e.food.kcal_per_100g) // 100
        if e.food.protein_per_100g is not None:
            p += (e.grams * e.food.protein_per_100g) // 100
        if e.food.fat_per_100g is not None:
            f += (e.grams * e.food.fat_per_100g) // 100
        if e.food.carbs_per_100g is not None:
            c += (e.grams * e.food.carbs_per_100g) // 100

    return {
        "date": date,
        "kcal_total": kcal,
        "protein_total": p,
        "fat_total": f,
        "carbs_total": c,
    }
