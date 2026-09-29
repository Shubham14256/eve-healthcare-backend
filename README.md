```markdown
# 🏥 EVE Healthcare - Diagnostic Booking Backend

> A robust, production-ready backend service for diagnostic test bookings and simulated payments, built for the EVE Healthcare SDE Intern assignment. 

This project prioritizes **System Design, Data Integrity, and Clean Architecture** over simply getting things to work.

---

## 🚀 Tech Stack
* **Runtime & Framework:** Node.js, Express.js, TypeScript
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Security & Validation:** Zod (Schema Validation), JWT, Helmet, Express-Rate-Limit
* **Infrastructure:** Docker, Docker Compose

---

## 🏗️ Architectural Decisions & Engineering Practices

To ensure the codebase remains maintainable as it scales, I implemented a strict **4-Tier Architecture** (Separation of Concerns):

1. **Routes:** Maps HTTP methods to specific controller functions.
2. **Controllers:** Handles HTTP request/response cycle, extracts parameters, and manages status codes.
3. **Services:** Contains the core business logic (The "Brain" of the operation).
4. **Repositories:** Strictly handles direct database interactions using Prisma.

### 🛡️ Handling Edge Cases & Concurrency (The Hard Parts)

1. **Race Conditions & Concurrency (Row-Level Locking):**
   * *Problem:* What if two users try to book the exact same limited test slot at the exact same millisecond?
   * *Solution:* Implemented `SELECT ... FOR UPDATE` via Prisma `$queryRaw` in the repository layer. This applies a row-level lock on the specific diagnostic test during the transaction, preventing race conditions and ensuring data consistency.

2. **Strict Webhook Idempotency:**
   * *Problem:* Network issues often cause payment gateways to send the same 'SUCCESS' webhook multiple times.
   * *Solution:* The webhook endpoint first checks the existing booking state. If a booking is already marked as `CONFIRMED` or `CANCELLED`, it gracefully ignores the duplicate event and returns a `200 OK` (so the provider stops retrying) without corrupting the state.

3. **State Machine Security:**
   * Bookings follow a strict state transition: `PENDING` ➔ `CONFIRMED` / `CANCELLED`. The service layer explicitly blocks invalid transitions (e.g., trying to cancel an already confirmed booking).

### ✨ Bonus Engineering Implemented
* **Dockerized Environment:** The entire app (Node Server + PostgreSQL) runs via a single `docker-compose up` command.
* **Pagination:** Added `skip` and `take` logic for the Admin booking retrieval endpoint (`/api/bookings?page=1&limit=10`) to prevent memory overload.
* **Rate Limiting:** Integrated `express-rate-limit` to protect endpoints from brute-force/DDoS attacks.
* **Structured Logging:** Integrated `morgan` for detailed HTTP request monitoring in the console.

---

## 🏃‍♂️ How to Run the Project Locally (Using Docker)

You do not need to install Node.js or PostgreSQL on your machine. Docker handles everything.

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-link-here>
   cd eve-booking-backend

```

2. **Spin up the application:**
```bash
docker-compose up --build

```


*Note: This will automatically build the Node image, pull PostgreSQL, generate Prisma clients, and expose the server on `http://localhost:8000`.*

---

## 🔌 API Endpoints Summary

*(Note: You can view and test all the configured API endpoints directly via my published Postman Workspace here: **[EVE Healthcare API Workspace](https://shubhamsolat36-8727116.postman.co/workspace/Shubham-solat's-Workspace~ba315648-32a8-4f82-8743-437f1302e596/documentation/A2A1CE92E5Caf9875B161C9B)**)*

### Auth

* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login and receive JWT

### Tests & Centres

* `GET /api/centres` - Get all diagnostic centres
* `GET /api/tests` - Get all available tests

### Bookings (Protected)

* `POST /api/bookings` - Create a new booking (Initializes in PENDING state)
* `GET /api/bookings/my-bookings` - Fetch current user's bookings
* `GET /api/bookings?page=1&limit=10` - Fetch all bookings (Admin/Pagination)

### Payments

* `POST /api/payments/simulate` - Simulates a payment gateway response
* `POST /api/payments/webhook` - Idempotent webhook listener for status updates

---

## 🗄️ Database Schema Overview (PostgreSQL)

* **User:** `id`, `name`, `email`, `password`, `role`
* **DiagnosticCentre:** `id`, `name`, `location`
* **Test:** `id`, `name`, `price`, `centreId` (Relation)
* **Booking:** `id`, `userId`, `testId`, `status` (Enum), `date`

---

## 🔮 What I would improve with more time (Future Scope & Scalability)

As an engineer, I believe a system is never truly "finished." If this were a real production service, here is my roadmap for scaling and optimization:

1. **Microservices Architecture & AI Integration:**
* I deliberately chose **Node.js** for this core service because of its non-blocking I/O, which is perfect for high-concurrency booking APIs and fast network calls.
* However, for future AI features (e.g., automated diagnostic report analysis or smart appointment scheduling), I would introduce **Python as a separate microservice**. This ensures we use the right tool for the job without bloating the Node.js API, allowing us to scale the heavy AI/ML workloads independently.


2. **Event-Driven Queues, WhatsApp Automation & AI Report Explainer:**
* Instead of processing webhooks synchronously, I would implement an event-driven architecture using **Message Queues (RabbitMQ/BullMQ)**. This allows the API to return a `200 OK` in milliseconds, while a background worker safely updates the database and triggers the **Meta WhatsApp Cloud API**.
* **Smart Queue Management:** To prevent overcrowding at diagnostic centres, the system would dynamically calculate patient wait times. Patients would receive live WhatsApp updates with their exact queue number and estimated visit time, eliminating unnecessary waiting.
* **The AI Touch:** Once a test is completed, the background worker would use an **LLM (AI Agent)** to analyze the complex diagnostic PDF report and send a simplified, easy-to-understand summary of the medical results directly to the patient's WhatsApp, improving the overall healthcare experience.


3. **Cost Optimization & Resource Scaling:**
* **Connection Pooling:** Implement `pgBouncer` to manage database connections efficiently, reducing the compute load on PostgreSQL and preventing server crashes during traffic spikes.
* **Serverless Functions:** Move periodic cleanup tasks (like deleting old "FAILED" bookings) to AWS Lambda or serverless cron jobs so we only pay for compute when it actually runs.
* **Caching:** Integrate **Redis** to cache frequently accessed, rarely changing data (like the list of Diagnostic Centres and Tests). This drastically reduces database query costs and latency.


4. **Comprehensive Testing:**
* Implement `Jest` and `Supertest` for automated unit and integration testing across the CI/CD pipeline.



---

*Built with passion and engineering discipline for the EVE Healthcare team.*

```



```
