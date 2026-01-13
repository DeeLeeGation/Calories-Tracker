# Calorie Tracker (Next.js + FastAPI + SQLite)

Small pet project: add foods (with optional macros), autocomplete, log daily intake.




## Stack
Frontend: Next.js (App Router) + TypeScript + Chakra UI  
Backend: FastAPI + SQLAlchemy  
DB: SQLite

## Run locally

### Backend
cd backend
python -m venv .venv
## Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

### Frontend
cd frontend
npm install
# create frontend/.env.local with:
# NEXT_PUBLIC_CAL_API_BASE=http://localhost:8000
npm run dev

Open http://localhost:3000


## Roadmap
- [ ] Combobox with keyboard navigation
- [ ] Size mode (Grams/pieces)
- [ ] Autosearch if food not added
- [ ] Telegram bot client
