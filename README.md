# Agile Project Management Platform

Monorepo for a full-stack Agile project management tool with calendar and Kanban board views.

## Structure

- `/backend` — NestJS + TypeORM + PostgreSQL
- `/frontend` — React + Vite + TailwindCSS

## Scripts

- `npm run dev:backend` — Start backend (NestJS)
- `npm run dev:frontend` — Start frontend (Vite)
- `npm run start` — Start both concurrently
- `npm run seed` — Seed database with sample data

## TODO

- Complete Auth, Users, Projects, Tasks modules
- Implement real-time updates (Socket.IO)
- Add frontend auth, Kanban, and calendar logic
- Add role-based access and validation
