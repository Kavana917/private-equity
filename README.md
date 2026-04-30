# TS Agentic Private Equity Platform

This project implements the initial PE platform baseline using the IT Risk app as a reference architecture only.

## Reference assets

- IT Risk reference repository is stored in `refs/IT-Risk-App`.
- It is used for UI and architecture guidance only, not imported into runtime.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:
   - `npm install`

## Run UI and API

- Frontend (Vite): `npm run dev`
- API server: `npm run server:dev`

Set `VITE_API_BASE_URL` in `.env` if your API runs on a non-default URL.

## Database commands

- Create tables: `npm run db:create`
- Seed sample data: `npm run db:seed`
- Drop tables: `npm run db:drop`

The `/admin/sample-data` page provides equivalent actions through API buttons:
- Create Tables
- Delete Tables
- See Data
