# 🎾 Tennis Arena — 1v1

A browser-based **1v1 tennis game** built with React and FastAPI. Tennis Arena simulates a tennis match with game, set, tie-break, rally, player, statistics, and match-management logic handled by a dedicated Python backend.

## 🚀 Features

* 🎾 1v1 tennis gameplay
* 🏆 Tennis scoring system
* 🎯 Rally and point management
* 🔥 Match pressure and game-state handling
* 📊 Match and player statistics
* 🏅 Set and tie-break logic
* ⚡ Interactive React frontend
* 🐍 FastAPI backend
* 🔌 Frontend-backend API communication
* 💥 Confetti effects for important game events
* 📱 Browser-based gameplay

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* JavaScript / JSX
* Lucide React
* Canvas Confetti

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### Development Tools

* Git
* GitHub
* Python Virtual Environment
* npm

## 📁 Project Structure

```text
Tennis_Arena/
│
├── Frontend/
│   ├── src/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── Backend/
│   ├── engine/
│   │   ├── actions.py
│   │   ├── game.py
│   │   ├── match.py
│   │   ├── match_engine.py
│   │   ├── player.py
│   │   ├── point.py
│   │   ├── rally.py
│   │   ├── sets.py
│   │   ├── stats.py
│   │   ├── tiebreak.py
│   │   └── utils.py
│   │
│   ├── api.py
│   ├── controller.py
│   ├── game_controller.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── start.sh
│
├── .gitignore
└── README.md
```

## ⚙️ Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/AshuKumar0/Tennis_Arena.git
cd Tennis_Arena
```

### 2. Start the Backend

Open a terminal and navigate to the backend:

```bash
cd Backend
```

Create and activate a virtual environment if you don't already have one.

On Windows:

```powershell
python -m venv venv
venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn api:app --host 0.0.0.0 --port 8000
```

The backend will be available at:

```text
http://localhost:8000
```

FastAPI's interactive API documentation can be accessed at:

```text
http://localhost:8000/docs
```

### 3. Start the Frontend

Open another terminal and navigate to the frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local URL, typically:

```text
http://localhost:5173
```

Open that URL in your browser to play Tennis Arena.

## 🎮 How It Works

Tennis Arena separates the game into two major parts.

### Frontend

The React frontend provides the interactive browser experience and communicates with the backend through API requests.

It is responsible for:

* User interaction
* Game interface
* Match display
* Player controls
* Score presentation
* Statistics display
* Visual effects

### Backend

The FastAPI backend contains the core tennis game logic.

The engine handles concepts such as:

```text
Point
  ↓
Rally
  ↓
Game
  ↓
Set
  ↓
Tie-break
  ↓
Match
```

This separation keeps the gameplay logic independent from the user interface.

## 🧠 Game Engine

The backend contains a dedicated `engine` module responsible for managing the tennis match.

Some of the major components include:

| Module            | Responsibility              |
| ----------------- | --------------------------- |
| `point.py`        | Point-level game logic      |
| `rally.py`        | Rally management            |
| `game.py`         | Tennis game scoring         |
| `sets.py`         | Set management              |
| `tiebreak.py`     | Tie-break handling          |
| `match.py`        | Match-level state           |
| `match_engine.py` | Overall match processing    |
| `player.py`       | Player information          |
| `stats.py`        | Match/player statistics     |
| `pressure.py`     | Pressure-related game logic |
| `actions.py`      | Player/game actions         |
| `utils.py`        | Utility functions           |

## 🔌 Backend API

The backend is built using FastAPI and exposes API endpoints used by the frontend.

Once the backend is running, interactive API documentation is available at:

```text
http://localhost:8000/docs
```

This makes it easy to inspect and test the available API endpoints.

## 🔐 Environment Variables

Environment-specific configuration should be stored in `.env` files rather than committed to GitHub.

Example:

```text
Frontend/.env.example
```

The actual `.env` file should remain private.

## 🌐 Deployment

The project can be deployed using a separate frontend and backend service.

Recommended architecture:

```text
                   Internet
                      │
                      ▼
              ┌───────────────┐
              │    Frontend   │
              │ React + Vite  │
              └───────┬───────┘
                      │
                  API Requests
                      │
                      ▼
              ┌───────────────┐
              │    Backend    │
              │    FastAPI    │
              └───────────────┘
```

The frontend can be deployed as a static web application, while the FastAPI backend runs as a web service.

Deployment configuration will be added once the production deployment is completed.

## 📸 Screenshots

Screenshots and a live demo can be added here after deployment.

```text
Coming soon...
```

## 🔮 Future Improvements

Potential improvements include:

* 🌐 Online multiplayer
* 🏆 Tournament mode
* 👥 Player profiles
* 📈 Advanced statistics
* 🥇 Leaderboards
* 🎮 Improved game animations
* 🔊 Sound effects
* 📱 Better mobile support
* 🔐 User authentication
* ☁️ Persistent match history

## 👨‍💻 Author

**Ashu Kumar**

GitHub: [AshuKumar0](https://github.com/AshuKumar0)

## 📄 License

This project is currently intended as a personal/educational project.

A formal open-source license can be added in the future if the project is released under one.
