# Coding Challenge Tracker

A web application to track and manage coding challenges across different topics. Built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**, it allows users to add, view, update, and organize coding challenges efficiently.

---

## Features
- Add coding challenges under specific topics like Arrays, Strings, Graphs, Trees, Dynamic Programming, and Math.
- View a list of all challenges categorized by topic.
- Update or delete existing challenges.
- Responsive and user-friendly interface.

---

## Technologies Used
- **Frontend:** React.js, HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (or JSON file for local persistence)  
- **Libraries & Tools:** Axios, React Router  

---

## Project Structure

Coding-Challenge-Tracker/
│
├── backend/
│ ├── server.js # Server setup
│ ├── routes/ # API routes
│ ├── controllers/ # Controller logic
│ └── models/ # Data models
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable components (ChallengeList, AddChallenge)
│ │ ├── pages/ # Pages (Home, QuickChallenges)
│ │ ├── api.js # Axios API calls
│ │ └── App.js
│ └── public/
│ └── index.html
│
├── .gitignore
├── package.json
└── README.md


## Installation

### 1. Clone the repository
```bash
git clone https://github.com/gpavana/Coding-Challenge-Tracker.git
cd Coding-Challenge-Tracker
```

### 2. Setup Backend
```
cd backend
npm install
node server.js
```

Backend runs on http://localhost:5000.

### 3. Setup Frontend
```
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000.

### Usage

Open the application in a browser.

Select a topic to add a new coding challenge.

View all challenges under each topic.

Edit or delete challenges as needed.





