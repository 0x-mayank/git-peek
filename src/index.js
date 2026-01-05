import { Command } from "commander";
import { login } from "./login.js";
import { whoami } from "./whoami.js";
import { logout } from "./logout.js";
import { today } from "./today.js";
import { week } from "./week.js";
import { month } from "./month.js";

const program = new Command();

program
    .name("git-peek")
    .description("a cli tool for github stats")
    .version("1.0.0")

program
    .command("login <token>")
    .description("login with github token")
    .action((token)=>{
        login(token);
    });

program
  .command("whoami")
  .description("show the currently logged-in gitHub user")
  .action(()=>{
    whoami();
  });

program
  .command("logout")
  .description("logout and remove saved gitHub credentials")
  .action(()=>logout());

program
  .command("today")
  .description("Show today’s GitHub activity")
  .action(today);

program.parse()
