[![CI](https://github.com/solarlime/help-desk/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/solarlime/help-desk/actions/workflows/main.yml)

# Help desk - Simple Ticket System

### What:

Based on [Items list](https://github.com/solarlime/items-list).
It's a simple help desk with a list of tickets. This branch contains a stable version of the project.

This app is my first serious project. Originally it was written without any framework and did all changes with manipulating DOM. Code used classes for storing global values and was quite complicated, so I decided to rewrite it.

### Features:
- Possible to create, update, and delete tickets
- Stores data in MongoDB
- Uses a [server](https://github.com/solarlime/crud-mongo-server) to access data
- 🆕 Uses a global state provided by Zustand
- 🆕 Rendered with React
- 🆕 Uses optimistic updates for a smooth user experience
- 🆕 Groups changes into batches for better performance
- 🆕 Sends batches:
    - after a period of inactivity if there are changes
    - regularly if there are changes and activity is permanent
    - immediately if the user leaves the page
- Readable on mobiles, even on small screens
- Supports all modern browsers on desktop, Android & iOS 12+
- Tested with Playwright ([previously](https://github.com/solarlime/help-desk/tree/legacy/) used Puppeteer)

Try it on [Vercel](https://help-desk.solarlime.dev/)!
