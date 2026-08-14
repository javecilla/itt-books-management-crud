# Books Management (CRUD) — Technical Interview Submission

This repository was built as a technical assessment for an internship application. It implements a simple books management system with role-based access (Teacher / Student).

## Spec

- Users log in using username and password.
- Two roles: **Teacher** and **Student**.
- **Teacher:** create books (title, description, cover image), assign books to students. A teacher cannot assign the same book to the same student more than once.
- **Student:** view books that have been assigned to them.

## Structure (monorepo)

```
apps/
├── api/     → NestJS backend (Prisma + PostgreSQL)
└── web/     → React frontend (MVVM structure)
```

## Activities completed

1. ERD — see `apps/api/prisma` schema and diagram
2. PostgreSQL database
3. Prisma schema and migration
4. NestJS backend API
5. React frontend (MVVM: models / viewmodels / views)
6. Pushed to GitHub

# ERD Diagram

Link to diagram:
![Link](https://lucid.app/lucidchart/8f36b9c7-ceb5-4d9c-9b86-5162b7faa4e0/edit?viewport_loc=1710%2C-138%2C2199%2C1165%2C0_0&invitationId=inv_991c1fc0-e594-43fc-a2e0-382bb5e9f070)

Preview:
![ERD Diagram](preview.webp)
