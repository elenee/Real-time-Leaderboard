# Real-Time Leaderboard System

A backend service for managing real-time leaderboards across multiple games. Built as part of the [roadmap.sh Real-Time Leaderboard project](https://roadmap.sh/projects/realtime-leaderboard-system).

## Tech Stack

- **NestJS** — backend framework
- **MongoDB** — persistent storage for users, games, and score history
- **Redis** — sorted sets for real-time leaderboard management
- **WebSockets** (Socket.io) — real-time leaderboard updates
- **JWT** — authentication with access and refresh tokens
- **Docker** — containerized deployment

## Features

- User registration and login with JWT authentication
- Role-based access control (admin/user)
- Refresh token support
- Score submission with Redis sorted sets
- Per-game leaderboard with user rankings
- Global leaderboard across all games
- Top players report by time period
- Real-time leaderboard updates via WebSockets
- Rate limiting on sensitive endpoints
- Admin seeding on startup

## Running with Docker

```bash
docker compose up --build
```

This starts three containers: the NestJS app, MongoDB, and Redis.

The app will be available at `http://localhost:3000`.

## Running Locally

```bash
npm install
npm run start:dev
```

Make sure Redis and MongoDB are running locally and your `.env` file is configured.

## Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/leaderboard_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@admin.com
ADMIN_USER=admin
ADMIN_PASSW=admin123
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and get tokens |
| GET | /auth/me | Get current user |
| POST | /auth/refresh | Refresh access token |

### Scores
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /scores | Submit a score |
| GET | /scores | Get all scores |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /leaderboard/global | Global leaderboard across all games |
| GET | /leaderboard/:gameId | Per-game leaderboard |
| GET | /leaderboard/:gameId/report | Top players report by date range |

### Games
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /games | Create a game (admin) |
| GET | /games | Get all games |
| GET | /games/:id | Get game by ID |
| PATCH | /games/:id | Update game (admin) |
| DELETE | /games/:id | Delete game (admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get all users |
| GET | /users/:id | Get user by ID |
| PATCH | /users| Update own account |
| DELETE | /users | Delete own account |

## WebSocket Events

Connect to `ws://localhost:3000` and listen to `leaderboard:<gameId>` to receive real-time leaderboard updates when scores are submitted.

## Seeding Test Data

Make sure the app is running, then:

```bash
npm run seed
```
