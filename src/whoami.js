import axios from "axios";
import chalk from "chalk";
import { getAuthenticatedUser } from "./api.js";

export async function whoami() {
  try {
    const user = await getAuthenticatedUser();

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
