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

export async function week() {
  try {
    const user = await getAuthenticatedUser();
    const events = await getUserEvents(user.login);
    
    if (!events || events.length === 0) {
      console.log(chalk.yellow("No recent events found."));
      return;
    }
    
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyStats[dateStr] = {
        commits: 0,
        prs: 0,
        issues: 0,
        reposCreated: 0,
        repos: new Set()
      };
    }
    
    for (const event of events) {
      const eventDate = new Date(event.created_at);
      const eventDateStr = eventDate.toISOString().split('T')[0];
      
      if (eventDate < sevenDaysAgo) continue;
      if (!dailyStats[eventDateStr]) continue;
      
      dailyStats[eventDateStr].repos.add(event.repo.name);
      
      if (event.type === "PushEvent") {
        const [owner, repo] = event.repo.name.split('/');
        const commitCount = await getCommitCount(
          owner,
          repo,
          event.payload.before,
          event.payload.head
        );
        dailyStats[eventDateStr].commits += commitCount;
      }

      if (event.type === "CreateEvent") {
        if (event.payload?.ref_type === "repository") {
          dailyStats[eventDateStr].reposCreated++;
          dailyStats[eventDateStr].commits += 1;
        } else if (event.payload?.ref_type === "branch" && 
                   (event.payload?.ref === "main" || event.payload?.ref === "master")) {
          dailyStats[eventDateStr].commits += 1;
        }
      }
      
      if (event.type === "PullRequestEvent" && event.payload?.action === "opened") {
        dailyStats[eventDateStr].prs++;
      }
      
      if (event.type === "IssuesEvent" && event.payload?.action === "opened") {
        dailyStats[eventDateStr].issues++;
      }
    }
    
    let totalCommits = 0;
    let totalPRs = 0;
    let totalIssues = 0;
    let totalReposCreated = 0;
    const allRepos = new Set();
    
    console.log(chalk.bold.cyan("\nLast 7 Days GitHub Activity\n"));
    
    const sortedDates = Object.keys(dailyStats).sort().reverse();
    
    for (const dateStr of sortedDates) {
      const stats = dailyStats[dateStr];
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
      const formattedDate = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      
      totalCommits += stats.commits;
      totalPRs += stats.prs;
      totalIssues += stats.issues;
      totalReposCreated += stats.reposCreated;
      stats.repos.forEach(repo => allRepos.add(repo));
      
      const isToday = dateStr === now.toISOString().split('T')[0];
      const dateLabel = isToday ? chalk.green.bold(`${dayName}, ${formattedDate} (Today)`) : chalk.gray(`${dayName}, ${formattedDate}`);
      
      console.log(dateLabel);
      
      if (stats.commits > 0 || stats.prs > 0 || stats.issues > 0 || stats.reposCreated > 0) {
        const activities = [];
        if (stats.commits > 0) activities.push(`${stats.commits} commits`);
        if (stats.prs > 0) activities.push(`${stats.prs} PRs`);
        if (stats.issues > 0) activities.push(`${stats.issues} issues`);
        if (stats.reposCreated > 0) activities.push(`${stats.reposCreated} repos created`);
        
        console.log(`  ${chalk.yellow('->')} ${activities.join(', ')}`);
        if (stats.repos.size > 0) {
          console.log(`  ${chalk.dim('Repos:')} ${chalk.cyan([...stats.repos].join(', '))}`);
        }
      } else {
        console.log(`  ${chalk.dim('No activity')}`);
      }
      console.log();
    }
    
    console.log(chalk.bold.cyan('Weekly Summary'));
    console.log(`Total commits : ${chalk.green(totalCommits)}`);
    console.log(`Total PRs     : ${chalk.green(totalPRs)}`);
    console.log(`Total issues  : ${chalk.green(totalIssues)}`);
    if (totalReposCreated > 0) {
      console.log(`Repos created : ${chalk.green(totalReposCreated)}`);
    }
    console.log(`Active repos  : ${allRepos.size ? chalk.yellow([...allRepos].join(', ')) : 'none'}`);
    
  } catch (error) {
    console.error(chalk.red("Error fetching GitHub data:"), error.message);
  }
}