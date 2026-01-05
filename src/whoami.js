import chalk from "chalk";
import { getAuthenticatedUser, getOwnedRepos } from "./api.js";

export async function whoami() {
  try {
    const user = await getAuthenticatedUser();
    const repos = await getOwnedRepos();

    let publicRepos = 0;
    let privateRepos = 0;

    for (const repo of repos) {
      if (repo.private) privateRepos++;
      else publicRepos++;
    }

    const totalRepos = publicRepos + privateRepos;
    console.log(`Username      : ${chalk.yellow(user.login)}`);
    console.log(`Public repos  : ${chalk.green(publicRepos)}`);
    console.log(`Private repos : ${chalk.green(privateRepos)}`);
    console.log(`Total repos   : ${chalk.green(totalRepos)}`);
    console.log(`Followers     : ${chalk.green(user.followers)}`);
  }
  catch (err) {
    console.log(chalk.red("failed to fetch user info"));
    console.log(chalk.yellow("your token may be invalid or expired"));
  }
}
