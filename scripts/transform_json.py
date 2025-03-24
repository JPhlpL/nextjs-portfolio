import json
from datetime import datetime
from pathlib import Path
import re

# Input and output file paths
input_file = Path("github_repos.json")
output_file = Path("github_repos_transformed.json")

# Load original JSON data
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

def to_title_case(slug):
    words = re.split(r"[-_]", slug)
    return " ".join(word.capitalize() for word in words)

def format_tags(topics):
    return ", ".join(topic.replace("-", " ").title() for topic in topics)

def convert_project(entry, index):
    title = to_title_case(entry["project"])
    publish_date = datetime.strptime(entry["date_created"], "%Y-%m-%dT%H:%M:%SZ").strftime("%B %d, %Y")
    topics = entry.get("topics", [])
    
    return {
        **entry,
        "ProjectHeader": {
            "title": title,
            "publishDate": publish_date,
            "tags": format_tags(topics) if topics else "General"
        },
        "ProjectImages": [
            {"id": 1, "img": "/images/project.jpg"},
            {"id": 2, "img": "/images/project.jpg"}
        ],
        "ProjectInfo": {
            "ClientHeading": "Client Information",
            "CompanyInfo": [
                {"id": 1, "title": "Name", "details": "JPhlpL"},
                {"id": 2, "title": "Website", "details": entry.get("website") or "https://example.com"}
            ],
            "ObjectivesHeading": "Project Objectives",
            "ObjectivesDetails": entry["description"][:120] + "..." if entry.get("description") else "No objective provided.",
            "Technologies": [
                {
                    "title": "Technologies Used",
                    "techs": [t.replace("-", " ").title() for t in topics] if topics else ["Not Specified"]
                }
            ],
            "SocialSharingHeading": "Share this project",
            "ProjectDetailsHeading": "Project Description",
            "ProjectDetails": [
                {"id": 1, "details": entry["description"][:100] + "..."} if entry.get("description") else {"id": 1, "details": "No description provided."},
                {"id": 2, "details": "Visit the GitHub repo for full source code."}
            ]
        }
    }

# Transform all entries
transformed_data = [convert_project(entry, idx) for idx, entry in enumerate(data)]

# Write to output JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(transformed_data, f, indent=2, ensure_ascii=False)

print(f"✅ Transformed JSON saved to: {output_file.resolve()}")
