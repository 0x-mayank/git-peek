import { Command } from "commander";
import { login } from "./login.js";

const program = new Command();

program
    .name("git-peek")
    .description("a cli tool for github stats")
    .version("0.1.0")

program
    .command("login <token>")
    .description("login with github token")
    .action((token)=>{
        login(token);
    });

program
    .command("hello")
    .description('test command')
    .action(()=>{
        console.log("program is running");
    })

program.parse()
