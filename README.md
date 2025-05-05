# Student Query Chatbot

A comprehensive chatbot system designed to answer student queries about course details, faculty information, exam schedules, and department policies. The system combines a React frontend with a Django backend for natural language processing and knowledge management.

## Project Structure

The project is divided into two main parts:

1. **Frontend**: React application with TypeScript
2. **Backend**: Django REST API with NLP capabilities

## Features

- Natural language processing to understand and respond to student queries
- Knowledge base integration for academic information
- Chat history to track previous conversations
- Categorized quick question buttons for common queries
- Fallback mechanism to connect with human staff when needed
- Mobile-responsive design for access across all devices

## Setup Instructions

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```
   python manage.py migrate
   ```

4. Start the Django server:
   ```
   python manage.py runserver
   ```

## Development

- The frontend and backend can be run simultaneously
- Frontend communicates with the backend via a REST API

## Deployment

https://jocular-zuccutto-aa80cd.netlify.app/
