# FocusRoomLite

A simple online study room where you can stay focused together.  
Includes Pomodoro sessions, shared notes, and an integrated AI assistant to support your workflow.


## Setup

Frontend .env:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

Backend .env:
```
PORT=3001
NEXTAUTH_SECRET=your_secret_key
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
```

## Running Locally

1. Start MongoDB (locally or ensure Atlas is accessible).
2. In backend folder:
    ```bash
    npm install
    npm run dev
    ```
3. In frontend folder:
    ```bash
    npm install
    npm run dev
    ```
4. Access frontend at `http://localhost:3000`.

## Features
1. Pomodoro Timer: Stay focused with a built-in pomodoro timer.
2. Notes Section: Note down important points during your study sessions.
3. AI Assistant: Get help with study material using the integrated AI assistant.
4. Room Management: Create and join study rooms with unique IDs.
5. User Authentication: Secure login using Google OAuth.
6. To-Do List: Manage your tasks efficiently

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.