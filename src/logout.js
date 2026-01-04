import chalk from "chalk";
import { getConfig, clearConfig } from "./config.js";

export function logout() {
  const config = getConfig();

  if (!config || !config.token) {
    console.log(chalk.yellow("Already logged out"));
    return;
  }

  clearConfig();
  console.log(chalk.green("Logged out successfully"));
}
