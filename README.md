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
3. Start the API:
   - `cd backend && npm run dev`
4. Start the storefront:
   - `cd frontend && npm run dev`
5. Start the admin:
   - `cd admin && npm run dev`

## Important Notes

- Uploaded files are stored in `backend/uploads/` and served by the API at `/uploads/...`.
- Sequelize schema sync is opt-in. Set `DB_SYNC=true` only for local development when you explicitly want model sync.
- Production should use real SQL migrations instead of relying on Sequelize sync.

## Quality Gates

- Backend: `npm run lint` and `npm test`
- Frontend: `npm run lint` and `npm run build`
- Admin: `npm run lint` and `npm run build`
