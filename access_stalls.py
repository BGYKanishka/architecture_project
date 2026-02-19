
import requests
import getpass
import json
import sys

def main():
    print("=== Employee Stall Map Access Tool ===")
    
    # 1. Get Base URL
    default_url = "http://localhost:8080"
    base_url = input(f"Enter Backend Base URL (default: {default_url}): ").strip()
    if not base_url:
        base_url = default_url
    
    # Ensure no trailing slash
    base_url = base_url.rstrip('/')

    # 2. Get Credentials
    print("\nPlease enter employee credentials:")
    email = input("Email: ").strip()
    password = getpass.getpass("Password: ")

    # 3. Authenticate
    login_url = f"{base_url}/api/auth/signin"
    print(f"\nAttempting to login at {login_url}...")
    
    try:
        login_response = requests.post(
            login_url,
            json={"email": email, "password": password},
            headers={"Content-Type": "application/json"}
        )
        
        if login_response.status_code != 200:
            print(f"Login Failed! Status Code: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return

        login_data = login_response.json()
        token = login_data.get("token") or login_data.get("accessToken")
        
        if not token:
            print("Login successful but no token found in response.")
            print(f"Response keys: {login_data.keys()}")
            return
            
        print("Login Successful!")
        
    except requests.exceptions.RequestException as e:
        print(f"Error during login request: {e}")
        return

    # 4. Fetch Stall Data
    stalls_url = f"{base_url}/api/employee/stalls"
    print(f"\nFetching stall map data from {stalls_url}...")

    try:
        stalls_response = requests.get(
            stalls_url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )

        if stalls_response.status_code == 200:
            print("\n=== Stall Map Data ===")
            try:
                data = stalls_response.json()
                print(json.dumps(data, indent=2))
                print(f"\nTotal Stalls Retrieved: {len(data)}")
            except json.JSONDecodeError:
                print("Failed to decode JSON response.")
                print(stalls_response.text)
        else:
            print(f"Failed to fetch stalls! Status: {stalls_response.status_code}")
            print(f"Response: {stalls_response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Error during stalls request: {e}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled.")
        sys.exit(0)
