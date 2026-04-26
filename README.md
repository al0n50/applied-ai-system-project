# Rentability: Party Equipment Scheduling & AI Assistant

## ℹ️ Original Project Context
**Base Project:** Rentability (Modules 1-3)
**Original Goal:** A T3 Stack scheduling app for businesses to keep track of and manage their party equipment rental services.

## 🤖 Project 4 Extension: AI Equipment Assistant
**Rentability AI Agent** is a backend Python microservice added to this project. It acts as an intelligent assistant for event planners and equipment rental managers. It uses a **Retrieval-Augmented Generation (RAG)** system to fetch specific equipment handling rules (like popcorn machine cleaning or chair delivery fees) from a mock database before answering client questions.

### 🏗️ Architecture Overview
*(See `assets/system_architecture.png` for the visual data flow)*
1. **Input:** Client submits a plain-text query.
2. **Retrieval (RAG):** The system scans the `RENTAL_KNOWLEDGE_BASE` for relevant policy data.
3. **Generation:** The AI generates a response strictly grounded in the retrieved context.
4. **Evaluation:** A Confidence Scorer evaluates the output. If the score is too low, the system triggers a safe fallback response to prevent hallucinating fake rental policies, and logs the failure.

### ⚙️ How to Run the AI Agent (Project 4)
1. Open your terminal in the project root directory.
2. Run the script: `python ai_agent.py` (or `python3 ai_agent.py`).
3. Check the `rentability_ai_logs.log` file generated to view system activity guardrails.

### 💬 Sample Interactions
* **Input:** "How do I clean the popcorn machine before I return it?"
* **Output:** "Based on Rentability equipment guidelines: Commercial popcorn machines must be wiped down with a damp cloth after use. Do NOT submerge the kettle in water..."
* **Reliability Score:** 0.95

* **Input:** "Can I rent a bounce house for next Tuesday?"
* **Output:** "I cannot find a specific policy regarding that equipment or service. Please contact the rental manager directly."
* **Reliability Score:** 0.85

### 🧠 Design Decisions & Testing Summary
* **Design:** I built this as a standalone Python microservice rather than directly integrating it into the Rentability Next.js frontend. This modular approach separates the heavy AI processing logic from the UI. I implemented a confidence scoring function to give the system nuanced guardrails.
* **Testing:** Automated testing revealed that while the system successfully blocks hallucinations, its retrieval engine can be overly rigid. For example, it easily caught the "bounce house" out-of-scope request, but it highlights the need for semantic search rather than strict keyword matching in the future.

### 💡 Reflection
This project taught me that building an AI system is less about the model itself and more about the data pipeline surrounding it. Implementing the guardrails showed me how quickly an LLM can fail if it isn't strictly tethered to a reliable knowledge base, especially in a business context where hallucinating a refund policy could cost money.

https://www.loom.com/share/bf8f90ef05994bb2950523a6f0eac1d6


---

## 💻 Original Project: Local Development Setup (T3 Stack)

### Requirements

- Node.js 18+ (LTS recommended) — install: https://nodejs.org/
- pnpm 8+ — install: run `npm install -g pnpm@latest-10` after installing Node.js
- Docker (with Docker Desktop / Docker Compose) — install: https://www.docker.com/get-started and Compose docs: https://docs.docker.com/compose/install/
- A `.env` file created from `.env.example` (ensure `AUTH_SECRET` and any database vars like `DATABASE_URL` are set)

Optional checks:

- node -v
- pnpm -v
- docker --version

Quick tip:

- Copy the example env: `cp .env.example .env` and edit the values before running the app.

### Running Locally

1. run `pnpm install` to install dependencies
2. run `./start-database.sh` to run a docker container for PostgresSQL
3. run `pnpm db:push` to apply the current schema to the database.
4. create a `.env` file using `.env.example` as a template and fill in needed values (currently just AUTH_SECRET)
5. run `pnpm db:reset && pnpm db:push && pnpm db:seed` to reset & seed the database (run only `pnpm db:push && pnpm db:seed` starting from empty db)
6. run `pnpm dev` to run locally

### Common Troubleshooting

- “Database connection refused”: ensure Docker is running and `DATABASE_URL` points to the expected host/port.
- “AUTH_SECRET missing”: copy `.env.example` and set AUTH_SECRET before starting.

### Developer tooling & tips

- Recommended VS Code extensions: ESLint, Prettier, Tailwind CSS IntelliSense, PostgreSQL

## Create T3 App 

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

### What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)

### Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

### How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.