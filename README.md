# Property Rental Manager

A full-stack rental platform for discovering properties, managing listings, and handling rental requests. It includes separate user, property owner, and administrator workflows, with AI-assisted property discovery and listing tools.

## Features

- **Role-based accounts:** user, owner, and admin access with protected pages and API routes.
- **Property discovery:** browse and filter verified rental listings, view listing details, and browse property photos in a carousel.
- **Owner workspace:** create and manage listings, review rental requests, and track property and rental activity.
- **Admin workspace:** manage users, categories, listings, verification, platform analytics, and property reports.
- **Rental requests:** users can apply for a property and track request status; owners can approve or reject requests.
- **AI assistance:** generate listing descriptions, analyze a renter’s search in natural language, recommend properties, and summarize listings.
- **Image handling:** newly uploaded property and profile photos are stored in MongoDB GridFS and streamed from `/uploads/<id>`. Older filename-based records are served from `server/src/uploads`; missing legacy files need to be uploaded again.
- **Responsive interface:** React pages styled with Tailwind CSS utility classes.

## Tech stack

- **Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router, Axios, React Icons
- **Backend:** Node.js, Express 5, Mongoose, MongoDB
- **Authentication:** JSON Web Tokens and bcrypt
- **AI:** Google Gemini via the Google GenAI SDK
- **Uploads:** Multer and MongoDB GridFS

## Requirements

- Node.js `20.19+` or `22.12+`
- npm
- A MongoDB database (local MongoDB or MongoDB Atlas)
- A Gemini API key for AI features

## Run locally

The frontend and backend run as separate applications. Open two terminal windows from the project directory.

### 1. Configure the backend

Create `server/.env` with the following values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/property-rental-manager
JWT_SECRET_KEY=replace-with-a-long-random-secret
GEMINI_API_KEY=your-gemini-api-key
```

Use your own MongoDB connection string and Gemini API key. Keep `.env` files private; do not commit credentials.

Install dependencies and start the API:

```bash
cd server
npm install
npm run dev
```

The API root is available at `http://localhost:5000/` and returns a small service response when the server is running.

### 2. Configure and start the frontend

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:5000
```

Then install dependencies and run Vite:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Available scripts

### Client (`client/`)

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production frontend into `client/dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint on the frontend source |

### Server (`server/`)

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |

## Main API areas

The Express API mounts these route groups:

- `/users` — registration, login, profiles, and user administration
- `/properties` — property listings and property images
- `/categories` — property categories
- `/rental-requests` — rental applications and owner decisions
- `/ai` — description generation, requirement analysis, recommendations, and summaries
- `/admin` — dashboard data, listing and owner verification, and administrative request data
- `/reports` — reports submitted for property listings
- `/uploads` — stored property and profile images

Most endpoints require a bearer token. Access is restricted by account role where appropriate.

## Deployment notes

Deploy the frontend and API as separate services. Set `VITE_BASE_URL` to the deployed API origin when building the frontend. Configure `PORT`, `MONGO_URI`, and `JWT_SECRET_KEY` on the API service; configure `GEMINI_API_KEY` to enable AI features. Ensure the API can connect to MongoDB so GridFS-backed images and database features work.

## Project layout

```text
client/   React frontend and Vite configuration
server/   Express API, MongoDB models, routes, and controllers
```

## License

No license is currently specified for this repository.
