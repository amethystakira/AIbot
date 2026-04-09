# Simple AI Chatbot

A beginner-friendly AI chatbot web app built with HTML, CSS, and JavaScript, with a backend function so the OpenRouter API key stays out of the browser.

## Features

- Clean modern chat interface
- User and bot message bubbles
- Scrollable conversation history
- Typing indicator
- OpenRouter API integration
- Basic error handling
- Responsive layout for desktop and mobile
- Netlify-ready environment variable setup for the API key

## Files

- `index.html` - app structure
- `style.css` - chatbot styling
- `script.js` - frontend chat logic
- `netlify/functions/chat.js` - Netlify Function for OpenRouter requests
- `netlify.toml` - Netlify config

## Local Setup

1. Create a `.env` file in the project root.
2. Copy the contents of `.env.example`.
3. Add your real OpenRouter API key:

```env
OPENROUTER_API_KEY=your_real_key_here
OPENROUTER_MODEL=openrouter/auto
HOST=127.0.0.1
PORT=3000
```

4. Start the local app:

```bash
npm start
```

5. Open:

`http://127.0.0.1:3000`

## Netlify Deployment

1. Connect the GitHub repo to Netlify
2. In Netlify, open:
   Site configuration -> Environment variables
3. Add this variable:

`OPENROUTER_API_KEY` = your real OpenRouter API key

4. Optional:

`OPENROUTER_MODEL` = `openrouter/auto`

5. Deploy the site

The frontend calls:

`/.netlify/functions/chat`

and Netlify runs the backend function securely with your environment variables.

## How It Works

- The browser sends chat messages to `/.netlify/functions/chat`
- The backend function reads the API key from environment variables
- The function sends the request to OpenRouter
- The AI reply is returned back to the chat UI

## Important Note

- `.env` is ignored by git so your API key does not get committed
- If a key was previously hardcoded or exposed, rotate it in OpenRouter before using the new setup
