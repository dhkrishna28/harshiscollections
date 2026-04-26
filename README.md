# Harshis Collections

Monorepo for the Harshis Collections ecommerce platform:

- `backend`: Express + Sequelize REST API
- `frontend`: customer storefront
- `admin`: admin dashboard

## Local Setup

1. Install dependencies in each app:
   - `cd backend && npm install`
   - `cd frontend && npm install`
   - `cd admin && npm install`
2. Create backend env values. See `backend/.env.example`.
   - For localhost, create `backend/.env` from the example and keep production envs unchanged.
3. Optional storefront env for local API calls:
   - Create `frontend/.env.development` with `VITE_API_BASE_URL=/api`
   - This keeps frontend API requests relative in dev so Vite can proxy them to the local backend.
4. Start the API:
   - `cd backend && npm run dev`
5. Start the storefront:
   - `cd frontend && npm run dev`
6. Start the admin:
   - `cd admin && npm run dev`

## Important Notes

- Uploaded files are stored in `backend/uploads/` and served by the API at `/uploads/...`.
- Sequelize schema sync is opt-in. Set `DB_SYNC=true` only for local development when you explicitly want model sync.
- Production should use real SQL migrations instead of relying on Sequelize sync.
- Local dev defaults are `http://127.0.0.1:3000` for the storefront and `http://localhost:3001` for the backend API.

## Quality Gates

- Backend: `npm run lint` and `npm test`
- Frontend: `npm run lint` and `npm run build`
- Admin: `npm run lint` and `npm run build`
