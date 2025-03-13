import requests
import json
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='.env.local')

# Replace with your GitHub username
USERNAME = "JPhlpL"  # Change this

# Replace with your GitHub Personal Access Token (PAT)
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # Replace this with your token

# GitHub API base URL
BASE_URL = "https://api.github.com"

# Headers with authentication
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}

# Fetch public repositories (filtered for source repositories)
repos_url = f"{BASE_URL}/users/{USERNAME}/repos?per_page=100&visibility=public"
repos_response = requests.get(repos_url, headers=HEADERS)

# Check if request was successful
if repos_response.status_code == 403:  # Rate limit exceeded
    print("Error: API rate limit exceeded. Please try again later or use authentication.")
    exit()
elif repos_response.status_code != 200:
    print(f"Error: Unable to fetch repositories. Status Code: {repos_response.status_code}")
    print("Response:", repos_response.text)
    exit()

# Try to parse JSON
try:
    repos_data = repos_response.json()
except json.JSONDecodeError:
    print("Error: Received invalid JSON response from GitHub API.")
    exit()

# Ensure repos_data is a list
if not isinstance(repos_data, list):
    print("Error: Unexpected API response structure.")
    print("Response:", repos_data)
    exit()

# Prepare data storage
repo_list = []

# Process each repository
for repo in repos_data:
    if not isinstance(repo, dict):  # Ensure repo is a dictionary
        continue

    if repo.get("fork"):  # Exclude forked repositories
        continue

    repo_name = repo.get("name", "N/A")
    description = repo.get("description", "No description provided.")
    language = repo.get("language", "N/A")
    created_at = repo.get("created_at", "N/A")
    stars = repo.get("stargazers_count", 0)
    website = repo.get("homepage", "No website provided")
    topics = repo.get("topics", [])
    repo_url = repo.get("html_url", "No link available")  # Get repo link

    # Append to list
    repo_list.append({
        "project": repo_name,
        "description": description,
        "language": language,
        "date_created": created_at,
        "stars": stars,
        "website": website,
        "topics": topics,  # List of topics (tags)
        "repository_link": repo_url  # GitHub repository link
    })

# Sort repositories by stars (highest to lowest)
repo_list = sorted(repo_list, key=lambda x: x["stars"], reverse=True)

# Save to JSON file
output_file = "github_repos.json"
with open(output_file, "w", encoding="utf-8") as json_file:
    json.dump(repo_list, json_file, indent=4)

print(f"Data saved to {output_file}")
