# Simple AI Chatbot

A beginner-friendly AI chatbot web app built with HTML, CSS, and JavaScript.

## Features

- Clean modern chat interface
- User and bot message bubbles
- Scrollable conversation history
- Typing indicator
- OpenRouter API integration
- Basic error handling
- Responsive layout for desktop and mobile

## Files

- `index.html` - app structure
- `style.css` - chatbot styling
- `script.js` - chat logic and OpenRouter API request

## How To Use

1. Open `script.js`
2. Replace:

```js
const OPENROUTER_API_KEY = "YOUR_API_KEY";
```

with your real OpenRouter API key.

3. Open `index.html` in your browser
4. Type a message and click `Send`

## OpenRouter Request

The app sends a `POST` request to:

`https://openrouter.ai/api/v1/chat/completions`

It uses this model by default:

`openrouter/auto`

## Important Note

This project stores the API key in frontend JavaScript for simplicity, which is fine for learning and quick demos but not safe for production use.

For a production app, move the API request to a backend so your API key is not exposed in the browser.
