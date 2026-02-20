"""
Employee Stall Map Access Tool
================================
Browser-based automation using Playwright.
  Step 1 — Open the Employee Login page in Chromium
  Step 2 — Fill credentials and submit the form
  Step 3 — Read the JWT token from localStorage['token']
  Step 4 — Call /api/employee/stalls with the JWT
  Step 5 — Print and save the stall map data as JSON

Requirements:
    pip install playwright requests
    playwright install chromium
"""

import asyncio
import getpass
import json
import sys
import os

# ─── Dependency check ─────────────────────────────────────────────────────────
try:
    from playwright.async_api import async_playwright
except ImportError:
    print("[ERROR] Playwright not installed.")
    print("  Run:  pip install playwright")
    print("        playwright install chromium")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("[ERROR] requests not installed.")
    print("  Run:  pip install requests")
    sys.exit(1)

# ─── Default URLs ──────────────────────────────────────────────────────────────
# Frontend → serves the React app  (employee login page lives here)
DEFAULT_FRONTEND = "http://localhost:5173"
# Backend  → serves the Spring Boot REST API
DEFAULT_BACKEND  = "http://localhost:8080"
# ──────────────────────────────────────────────────────────────────────────────


async def browser_login_and_get_token(frontend_url: str, email: str, password: str, headless: bool) -> str | None:
    """Open the login page, submit credentials, return the JWT token string."""

    login_url = f"{frontend_url}/employee/login"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless)
        page = await browser.new_page()

        # ── Navigate ─────────────────────────────────────────────────────────
        print(f"\n[1] Opening: {login_url}")
        await page.goto(login_url, wait_until="networkidle")

        # ── Fill credentials ──────────────────────────────────────────────────
        print("[2] Filling credentials...")
        await page.fill('input[name="email"]',    email)
        await page.fill('input[name="password"]', password)

        # ── Submit & wait for navigation ─────────────────────────────────────
        print("[3] Submitting login form...")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/employee/dashboard", timeout=15_000)

        # ── Check for error alert ─────────────────────────────────────────────
        if '/employee/dashboard' not in page.url:
            alert = page.locator('[role="alert"]')
            if await alert.count() > 0:
                print(f"[ERROR] Server returned: {await alert.inner_text()}")
            else:
                print(f"[ERROR] Unexpected redirect to: {page.url}")
            await browser.close()
            return None

        print(f"[4] Logged in!  Redirect → {page.url}")

        # ── Read token from localStorage ──────────────────────────────────────
        # auth.service.js does: localStorage.setItem("token", response.data.token)
        token = await page.evaluate("localStorage.getItem('token')")
        await browser.close()

    if not token:
        print("[ERROR] Token not found in localStorage.")
        return None

    print(f"[5] Token retrieved: {token[:40]}... (truncated)")
    return token


def fetch_stalls(backend_url: str, token: str) -> list | None:
    """Call the stalls API with the JWT token and return the JSON data."""

    url = f"{backend_url}/api/employee/stalls"
    print(f"\n[6] Fetching stalls from: {url}")

    resp = requests.get(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type":  "application/json",
        },
        timeout=15,
    )

    if resp.status_code == 200:
        return resp.json()

    print(f"[ERROR] HTTP {resp.status_code}: {resp.text}")
    return None


def display_stalls(data: list):
    """Pretty-print stall data and show a summary table."""

    print("\n" + "═" * 60)
    print("  STALL MAP DATA")
    print("═" * 60)

    for stall in data:
        status = "RESERVED" if stall.get("reserved") else "AVAILABLE"
        print(f"  [{status:9}]  {stall.get('stallCode','?'):10}  "
              f"Floor: {stall.get('floorName','?'):15}  "
              f"Type: {stall.get('stallType','?')}")
        if stall.get("reserved"):
            print(f"              Vendor: {stall.get('vendorName','N/A')}  "
                  f"({stall.get('businessName','N/A')})  "
                  f"Payment: {stall.get('paymentStatus','N/A')}")

    print("═" * 60)
    reserved  = sum(1 for s in data if s.get("reserved"))
    available = len(data) - reserved
    print(f"  Total: {len(data)}  |  Reserved: {reserved}  |  Available: {available}")
    print("═" * 60)


def save_to_file(data: list, filename="stall_map_data.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)
    print(f"\n  Full data saved → {os.path.abspath(filename)}")


def main():
    print("╔══════════════════════════════════════════════╗")
    print("║      Employee Stall Map Access Tool          ║")
    print("╚══════════════════════════════════════════════╝")

    # ── URLs ──────────────────────────────────────────────────────────────────
    frontend = input(f"\nFrontend URL  (default: {DEFAULT_FRONTEND}): ").strip().rstrip("/") or DEFAULT_FRONTEND
    backend  = input(f"Backend URL   (default: {DEFAULT_BACKEND}): ").strip().rstrip("/")  or DEFAULT_BACKEND

    # ── Credentials ───────────────────────────────────────────────────────────
    print()
    email    = input("Employee Email:    ").strip()
    password = getpass.getpass("Employee Password: ")

    # ── Headless? ─────────────────────────────────────────────────────────────
    headless = input("\nHide browser window? (Y/n): ").strip().lower() != "n"

    # ── STEP 1-5: login via browser ───────────────────────────────────────────
    token = asyncio.run(browser_login_and_get_token(frontend, email, password, headless))
    if not token:
        sys.exit(1)

    # ── STEP 6: fetch stall data ──────────────────────────────────────────────
    data = fetch_stalls(backend, token)
    if not data:
        sys.exit(1)

    # ── STEP 7: display & save ────────────────────────────────────────────────
    display_stalls(data)
    save_to_file(data)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled.")
        sys.exit(0)
