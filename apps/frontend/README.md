# Commands used for setup

```bash
# create this nextjs project
npx create-next-app@latest
# install dependencies (tech stack setup)
npm install axios
npm i @tanstack/react-query
npm i -D @tanstack/eslint-plugin-query
npx shadcn@latest init -d
# adding components from shadcn, e.g.
npx shadcn@latest add button
```

# Techstack

Techstack as used in this articel:
https://javascript.plainenglish.io/my-tech-stack-for-building-web-apps-today-43398556bb4d

- React & Next.js
- React Query & Axios
- Tailwind CSS & shadcn/ui

# Adding a new UI component from shadcn to the frontend

In the following example the [Alert component](https://ui.shadcn.com/docs/components/alert) will be added to the frontend project.

```
cd apps/frontend
pnpm dlx shadcn@latest add alert
```
