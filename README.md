# Mobile Shop Manager (Phase 1: Devices + Customers)

## What this is
An Electron + React desktop app with a local SQLite database.
No database to install - SQLite is just a file, created automatically
the first time you run the app.

## How to run on your laptop

1. Make sure you have Node.js installed (v18 or newer): https://nodejs.org

2. Open a terminal in this folder and install dependencies:
   npm install

   Note: better-sqlite3 compiles a small native module on install.
   If this fails, you likely need build tools:
     - Windows: run `npm install --global windows-build-tools` (as admin), or
       install "Desktop development with C++" via Visual Studio Build Tools.
     - Mac: run `xcode-select --install`

3. Run it in development mode (hot reload for React):
   npm run dev

   This starts the Vite dev server AND opens the Electron window together.

4. To build a real installable .exe / .dmg later:
   npm run package

   This will produce an installer in the `dist` or `release` folder
   that you can hand to a shop owner - they just double click it,
   no terminal, no Node, no database setup needed on their end.

## Where is the data stored?
SQLite file `shop.db` is created automatically in:
  - Windows: %APPDATA%/Mobile Shop Manager/shop.db
  - Mac: ~/Library/Application Support/Mobile Shop Manager/shop.db

## Project structure
- src/main/        -> Electron "backend" (like your Express layer), DB logic
- src/preload/      -> Secure bridge between backend and React UI
- src/renderer/     -> React frontend (this part will feel just like MERN)

## What's next (not built yet)
- Sales (link a device to a customer when sold)
- Loans / installments
- Workers + salary
- Income/expense dashboards
- Cloud sync + WhatsApp reminders
