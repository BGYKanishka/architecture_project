# Employee Stall Map Access Tool

Browser-based automation that logs into the Employee Login page and retrieves stall map data.

## Prerequisites

```bash
pip install playwright requests
playwright install chromium
```

## How to Run

```bash
python employee_stall_access.py
```

| Prompt | Example value |
|---|---|
| Frontend URL | `http://localhost:5173` or `https://yourapp.com` |
| Backend URL | `http://localhost:8080` or `https://api.yourapp.com` |
| Employee Email | `employee@test.com` |
| Employee Password | *(hidden)* |
| Hide browser window | `Y` (headless) / `n` (watch it run) |

## Steps the Script Performs

| # | What happens |
|---|---|
| 1 | Opens Chromium → navigates to `FRONTEND_URL/employee/login` |
| 2 | Fills `email` and `password` fields |
| 3 | Clicks **Login** button |
| 4 | Waits for redirect to `/employee/dashboard` |
| 5 | Reads `localStorage['token']` (set by `auth.service.js`) |
| 6 | Calls `BACKEND_URL/api/employee/stalls` with `Bearer` token |
| 7 | Prints a summary table + saves full JSON to `stall_map_data.json` |

## Stall Data Fields Returned

```
stallId, stallCode, stallType, stallSize, price, floorName, reserved
vendorName, vendorEmail, vendorContact, businessName     ← (reserved stalls only)
paymentStatus, paymentAmount, paymentDate, paymentMethod ← (reserved stalls only)
```

## First-Time Setup — Create an Employee User

The database **must** have a `users` row with `role = 'EMPLOYEE'`.

**Easiest way — use the signup endpoint:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Staff Name\",\"email\":\"employee@test.com\",\"password\":\"yourpassword\",\"role\":\"employee\"}"
```

> The password is **BCrypt-hashed automatically** when using the signup endpoint.
> Do not insert a plain-text password directly into the database.
