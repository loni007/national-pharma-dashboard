# National Pharma Dashboard Backend

## Overview

The National Pharma Dashboard Backend is a RESTful API developed using Node.js and Express.js for managing pharmaceutical warehouse operations.

The system provides functionality for:

- Inventory Management
- Supplier Management
- Shipment Management
- Prescription Analytics
- Demand Forecasting
- Analytics and Reporting

The backend follows a layered architecture consisting of Routes, Controllers, and Services.

---

## Technologies Used

* Node.js
* Express.js
* Jest
* JavaScript

---

## Installation

Clone the repository and navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## Running the Server

Start the backend server:

```bash
npm start
```

The API will run on:

```text
http://localhost:3000
```

---

## Running Unit Tests

Execute:

```bash
npm test
```

The project includes unit tests for:

* Inventory Services
* Supplier Services
* Shipment Services

---

## Project Structure

```text
backend
│
├── src
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── app.js
│   └── server.js
│
├── tests
│
├── package.json
└── README.md
```

---

## API Endpoints

### Inventory

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /inventory     |
| POST   | /inventory     |
| PUT    | /inventory/:id |
| DELETE | /inventory/:id |

### Suppliers

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /suppliers     |
| POST   | /suppliers     |
| PUT    | /suppliers/:id |
| DELETE | /suppliers/:id |

### Shipments

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /shipments     |
| GET    | /shipments/:id |
| POST   | /shipments     |
| PUT    | /shipments/:id |
| DELETE | /shipments/:id |

### Analytics

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | /analytics/dashboard      |
| GET    | /analytics/predictions    |
| GET    | /analytics/trends         |
| GET    | /analytics/reports        |
| GET    | /analytics/low-stock-risk |

---

## Database Integration

The current backend implementation uses in-memory data structures for development, testing, and API demonstration purposes.

The production database design targets PostgreSQL and is maintained separately in the project database module.

Future integration will connect the backend services to PostgreSQL tables and analytical views, including:

- prescriptions
- prescription_items
- medications
- medication_classes
- facilities
- regions
- demand_forecasts
- anomaly_alerts

The analytics layer will consume database views such as:

- v_daily_demand
- v_regional_demand_summary
- v_medication_demand_summary
- v_active_alerts

This approach allows the frontend dashboard to retrieve real-time prescription analytics, medicine demand forecasts, and public health alerts directly from the PostgreSQL database.

## Team Project

This backend is part of the AI-Powered Pharmaceutical Warehouse Management System developed as a Software Engineering course project.
