import axios from "axios";
import chalk from "chalk";
import { getConfig } from "./config.js";

export async function whoami() {
  const config = getConfig();

  if (!config || !config.token) {
    console.log(chalk.red("not logged in"));
    console.log(chalk.yellow("run: git-peek login <token>"));
    return;
  }

  try {
    const res = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });

    const user = res.data;

    console.log(chalk.green("Logged in"));
    console.log(`Username : ${user.login}`);
    console.log(`Public repos : ${user.public_repos}`);
    console.log(`Followers : ${user.followers}`);
  } 
  catch (err) {
    console.log(chalk.red("failed to fetch user info"));
    console.log(chalk.yellow("your token may be invalid or expired"));
  }
}
