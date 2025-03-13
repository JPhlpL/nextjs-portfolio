import requests
import json
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='.env.local')

# Replace with your GitHub username
USERNAME = "JPhlpL"  # Change this

# Replace with your GitHub Personal Access Token (PAT)
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # Replace this with your token

# GitHub GraphQL API URL
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

# GraphQL Query for Contributions & Activity Overview
query = """
{
  user(login: "%s") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
      commitContributionsByRepository {
        repository {
          name
        }
        contributions {
          totalCount
        }
      }
      pullRequestContributions {
        totalCount
      }
      issueContributions {
        totalCount
      }
      pullRequestReviewContributions {
        totalCount
      }
      repositoryContributions {
        totalCount
      }
    }
  }
}
""" % USERNAME

# Headers with authentication
HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Content-Type": "application/json"
}

# Make the API request
response = requests.post(GITHUB_GRAPHQL_URL, json={"query": query}, headers=HEADERS)

# Check for response errors
if response.status_code != 200:
    print(f"Error fetching contributions: {response.status_code}")
    print("Response:", response.text)
    exit()

# Parse the JSON response
data = response.json()

# Extract contribution data
try:
    contributions_data = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]
    total_contributions = contributions_data["totalContributions"]

    # Organize contributions by year and month
    contributions_by_year = {}
    contributions_by_month = {}

    for week in contributions_data["weeks"]:
        for day in week["contributionDays"]:
            date = day["date"]
            count = day["contributionCount"]

            # Extract year and month
            year, month, _ = date.split("-")
            month_name = {
                "01": "January", "02": "February", "03": "March", "04": "April",
                "05": "May", "06": "June", "07": "July", "08": "August",
                "09": "September", "10": "October", "11": "November", "12": "December"
            }[month]

            # Update yearly contributions
            contributions_by_year.setdefault(year, 0)
            contributions_by_year[year] += count

            # Update monthly contributions
            contributions_by_month.setdefault(year, {})
            contributions_by_month[year].setdefault(month_name, 0)
            contributions_by_month[year][month_name] += count

    # Extract activity overview
    commit_contributions = sum(repo["contributions"]["totalCount"] for repo in data["data"]["user"]["contributionsCollection"]["commitContributionsByRepository"])
    pull_requests = data["data"]["user"]["contributionsCollection"]["pullRequestContributions"]["totalCount"]
    issues = data["data"]["user"]["contributionsCollection"]["issueContributions"]["totalCount"]
    code_reviews = data["data"]["user"]["contributionsCollection"]["pullRequestReviewContributions"]["totalCount"]
    repositories_contributed = data["data"]["user"]["contributionsCollection"]["repositoryContributions"]["totalCount"]

    activity_overview = {
        "total_contributions": total_contributions,
        "contributions_by_year": contributions_by_year,
        "contributions_by_month": contributions_by_month,
        "activity_overview": {
            "total_commits": commit_contributions,
            "pull_requests_opened": pull_requests,
            "issues_opened": issues,
            "code_reviews": code_reviews,
            "repositories_contributed_to": repositories_contributed
        }
    }

except KeyError:
    print("Error: Unexpected response structure.")
    print("Response:", data)
    exit()

# Save to JSON file
output_file = "github_contributions.json"
with open(output_file, "w", encoding="utf-8") as json_file:
    json.dump(activity_overview, json_file, indent=4)

print(f"GitHub contributions data saved to {output_file}")
