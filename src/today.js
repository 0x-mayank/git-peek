import chalk from "chalk";
import { getAuthenticatedUser, getUserEvents, compareCommits } from "./api.js";

async function getCommitCount(owner, repo, before, after) {
  try {
    const comparison = await compareCommits(owner, repo, before, after);
    if (comparison && comparison.total_commits) {
      return comparison.total_commits;
    }
    return 1;
  } catch (error) {
    return 1;
  }
}

export async function today() {
  try {
    const user = await getAuthenticatedUser();
    const events = await getUserEvents(user.login);
    let commits = 0;
    let prs = 0;
    let issues = 0;
    let reposCreated = 0;
    const repos = new Set();
    
    if (!events || events.length === 0) {
      console.log(chalk.yellow("No recent events found."));
      return;
    }
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    for (const event of events) {
      const eventDate = new Date(event.created_at);
      const eventDateStr = eventDate.toISOString().split('T')[0];
      
      if (eventDateStr === todayStr) {
        repos.add(event.repo.name);
        
        if (event.type === "PushEvent") {
          const [owner, repo] = event.repo.name.split('/');
          const commitCount = await getCommitCount(
            owner,
            repo,
            event.payload.before,
            event.payload.head
          );
          commits += commitCount;
        }
        
        if (event.type === "CreateEvent") {
          if (event.payload?.ref_type === "repository") {
            reposCreated++;
            commits += 1; 
          } else if (event.payload?.ref_type === "branch" && 
                     (event.payload?.ref === "main" || event.payload?.ref === "master")) {
            commits += 1; 
          }
        }
        
        if (event.type === "PullRequestEvent" && event.payload?.action === "opened") {
          prs++;
        }
        
        if (event.type === "IssuesEvent" && event.payload?.action === "opened") {
          issues++;
        }
      }
    }
    
    console.log(chalk.bold.cyan("\nToday's GitHub Activity"));
    console.log(chalk.gray(`Date: ${new Date().toLocaleDateString('en-IN')}\n`));
    console.log(`Commits      : ${chalk.green(commits)}`);
    console.log(`PRs opened   : ${chalk.green(prs)}`);
    console.log(`Issues opened: ${chalk.green(issues)}`);
    if (reposCreated > 0) {
      console.log(`Repos created: ${chalk.green(reposCreated)}`);
    }
    console.log(`Active repos : ${repos.size ? chalk.yellow([...repos].join(", ")) : "none"}`);
    
  } catch (error) {
    console.error(chalk.red("Error fetching GitHub data:"), error.message);
  }
}