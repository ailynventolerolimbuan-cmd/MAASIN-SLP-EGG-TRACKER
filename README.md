# Maasin SLP Egg Sales Tracker

A lightweight, browser-based sales management system for Maasin SLP egg sales. It records each tray sale, displays transaction history, and calculates the combined sales amount.

## Features

- Record trays sold, price per tray, sale date, and an optional customer name.
- View all recorded sales in an organized table.
- Automatically calculate each sale's amount and the overall total.
- Store sales locally in the browser so records remain after refreshing or reopening the page.
- Use a responsive layout that adapts to desktop, tablet, and mobile screens.
- Display clear validation and success messages.

## System Overview

The tracker is a client-side web application:

- `index.html` provides the sales form, summary, and sales table.
- `style.css` provides the green-and-pink responsive interface.
- `script.js` validates entries, stores records, renders the table, and calculates totals.
- Browser `localStorage` keeps data on the current device and browser. No server or database is required.

## Data Recorded

Each sale contains:

| Field | Description | Required |
| --- | --- | --- |
| Trays sold | Number of egg trays in the sale | Yes |
| Price per tray | Selling price of one tray | Yes |
| Sale date | Date of the transaction | Yes |
| Customer name | Optional buyer name | No |

The sale total is calculated with the following formula:

`Trays sold x Price per tray`

## System Requirements

- A modern browser with JavaScript and `localStorage` enabled
- A text editor for development, such as Visual Studio Code
- No package installation or internet connection is required
- Compatible with Windows, macOS, Linux, Android, and iOS

## Run the App

1. Open `index.html` in a web browser.
2. Enter the sale details and select **Save sale**.
3. Use the sales table to review transactions and the summary section to view total income.

Alternatively, use the Live Server extension in VS Code:

1. Right-click `index.html`.
2. Select **Open with Live Server**.

## Data and Privacy

- Sales remain in the browser profile where they were entered.
- Records are not sent to a remote server.
- Clearing browser storage or using another device/browser may remove or hide existing records.
- Browser storage is suitable for a simple local tracker, not a shared or high-security accounting system.

## Project Files

- `index.html` - Page structure, form, summary, and sales table
- `style.css` - Layout, colors, responsive behavior, and accessibility states
- `script.js` - Data validation, local storage, totals, and table rendering
- `README.md` - System documentation
- `PROMPT_LOG.md` - Record of development prompts
