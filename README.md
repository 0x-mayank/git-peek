# git-peek

> View your GitHub activity directly from the terminal

A lightweight, secure CLI tool that displays your GitHub contributions, activity, and stats without opening a browser.


## Features

- **Secure authentication** with GitHub Personal Access Tokens
- **Daily activity tracking** - See today's commits, PRs, and issues
- **Weekly summaries** - 7-day activity overview
- **Monthly reports** - 30-day contribution history 
- **Local storage** - No external servers, your data stays private
- **Lightning fast** - Instant results from GitHub's API

## Installation
```bash
# Install globally via npm
npm install -g @0x-may/git-peek

# Or clone and install locally
git clone https://github.com/0x-mayank/git-peek.git
cd git-peek
npm install
npm link
```
## Getting Started

### 1. Generate a GitHub Token

1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Click **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
3. Click **Generate new token**
4. Give it a name (e.g., `git-peek-cli`)
5. Set expiration (30-90 days recommended)

#### Repository Access
- Select **All repositories** (recommended)
  - This applies to all current and future repositories you own
  - Also includes public repositories (read-only)

#### Required Permissions

Under **Repositories** tab, grant these **read-only** permissions:

- **Commit statuses** - Read-only
- **Contents** - Read-only  
  (Repository contents, commits, branches, downloads, releases, and merges)
- **Issues** - Read-only  
  (Issues and related comments, assignees, labels, and milestones)
- **Metadata** - Read-only (Required)  
  (Search repositories, list collaborators, and access repository metadata)
- **Pull requests** - Read-only  
  (Pull requests and related comments, assignees, labels, milestones, and merges)

Under **Account** tab:

- **Email addresses** - Read-only  
  (Manage a user's email addresses)
- **Followers** - Read-only  
  (A user's followers)
- **Profile** - Read and write  
  (Manage a user's profile settings)

**Do NOT grant:**
- Write access to repositories
- Admin access
- Workflow access
- Secrets access

7. Click **Generate token** and copy it immediately
8. **Important**: GitHub will not show this token again!


### 2. Login
```bash
git-peek login YOUR_TOKEN_HERE
```

You should see:
```
Logged in as your-username
```

## Usage

### Check Authentication
```bash
git-peek whoami
```
Shows your GitHub username, public repos, and follower count.

### Today's Activity
```bash
git-peek today
```
Displays:
- Commits made today
- Pull requests opened
- Issues created
- Active repositories

### Weekly Summary
```bash
git-peek week
```
Shows last 7 days of activity with:
- Daily breakdown
- Total commits, PRs, issues
- Active repositories

### Monthly Report
```bash
git-peek month
```
30-day activity overview with:
- Active days count
- Total contributions
- Repository activity

### Logout
```bash
git-peek logout
```
Removes stored token and logs you out.

## Example Output
```
Today's GitHub Activity
Date: 4/1/2026

Commits      : 5
PRs opened   : 2
Issues opened: 1
Active repos : git-peek, my-project
```

## How It Works

- **Authentication**: Uses GitHub Personal Access Tokens (no username/password)
- **Storage**: Token stored locally in `~/.git-peek/config.json`
- **API**: Leverages GitHub REST API for recent activity
- **Privacy**: No external servers, all data fetched directly from GitHub
- **Security**: Read-only access, token can be revoked anytime

## Security

- Token stored only on your machine
- No telemetry or tracking
- No backend servers
- Read-only GitHub access
- Token revocable anytime from GitHub settings

## Important Notes

### Activity Tracking vs. Exact Commits

`git-peek` shows **GitHub activity**, not exact commit counts:

- Uses GitHub Events API (limited to ~90 days of history)
- Counts push events, which may differ from actual commits
- Best for recent activity tracking (today, week, month)
- Yearly stats may be incomplete due to API limitations

For exact contribution data, refer to your [GitHub contribution graph](https://github.com).

## Technical Details

**Built with:**
- Node.js
- Axios (HTTP client)
- Chalk (terminal styling)
- GitHub REST API

**Requirements:**
- Node.js >= 14.0.0
- GitHub Personal Access Token

## Author

**Mayank**
- GitHub: [@0x-mayank](https://github.com/0x-mayank)

## Show Your Support

Give a ⭐️ if this project helped you!

## Feedback

Found a bug or have a feature request? [Open an issue](https://github.com/0x-mayank/git-peek/issues)!

---

Made with ❤️ by mayank.