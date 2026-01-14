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
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000

### Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev

Open http://localhost:3000


## Roadmap
- [ ] Combobox with keyboard navigation
- [ ] Size mode (Grams/pieces)
- [ ] Autosearch if food not added
- [ ] Telegram bot client
