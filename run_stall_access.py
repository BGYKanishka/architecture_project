import requests
import json

EMAIL = "emp1@example.com"
PASSWORD = "password123"
BASE_URL = "http://localhost:8080"

print("=== Employee Stall Map Access Tool ===")
print(f"Logging in as: {EMAIL}")

# Step 1: Login
login_url = f"{BASE_URL}/api/auth/signin"
try:
    login_response = requests.post(
        login_url,
        json={"email": EMAIL, "password": PASSWORD},
        headers={"Content-Type": "application/json"}
    )
    print(f"Login Status Code: {login_response.status_code}")
    if login_response.status_code != 200:
        print(f"Login Failed! Response: {login_response.text}")
        exit(1)

    login_data = login_response.json()
    token = login_data.get("token") or login_data.get("accessToken") or login_data.get("jwt")

    if not token:
        print(f"No token found. Response keys: {list(login_data.keys())}")
        print(f"Full response: {json.dumps(login_data, indent=2)}")
        exit(1)

    print("Login Successful! Token acquired.")

except Exception as e:
    print(f"Login error: {e}")
    exit(1)

# Step 2: Fetch Stall Map
stalls_url = f"{BASE_URL}/api/employee/stalls"
print(f"\nFetching stall data from {stalls_url}...")
try:
    stalls_response = requests.get(
        stalls_url,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    )
    print(f"Stalls Status Code: {stalls_response.status_code}")
    if stalls_response.status_code == 200:
        data = stalls_response.json()
        print("\n=== STALL MAP DATA ===")
        print(json.dumps(data, indent=2))
        print(f"\nTotal Stalls Retrieved: {len(data) if isinstance(data, list) else 'N/A'}")
    else:
        print(f"Failed to fetch stalls! Response: {stalls_response.text}")
except Exception as e:
    print(f"Stalls fetch error: {e}")
