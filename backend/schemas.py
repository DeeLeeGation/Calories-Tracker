from pydantic import BaseModel, Field


class FoodCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    kcal_per_100g: int = Field(ge=0, le=2000)
    protein_per_100g: int | None = Field(default=None, ge=0, le=300)
    fat_per_100g: int | None = Field(default=None, ge=0, le=300)
    carbs_per_100g: int | None = Field(default=None, ge=0, le=300)


class FoodOut(BaseModel):
    id: int
    name: str
    kcal_per_100g: int
    protein_per_100g: int | None = None
    fat_per_100g: int | None = None
    carbs_per_100g: int | None = None

    class Config:
        from_attributes = True


class LogCreate(BaseModel):
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    food_id: int
    grams: int = Field(ge=0, le=5000)


class LogOut(BaseModel):
    id: int
    date: str
    grams: int
    food: FoodOut
    kcal_total: int

    class Config:
        from_attributes = True


class DaySummary(BaseModel):
    date: str
    kcal_total: int
    protein_total: int
    fat_total: int
    carbs_total: int
