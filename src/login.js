import axios from "axios";
import chalk from "chalk";
import { saveConfig } from "./config.js";

export async function login(token) {
    if(!token){
        console.log(chalk.red("token required"));
        process.exit(1);
    }

    try {
        const res = await axios.get("https://api.github.com/user",{
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        const user= res.data.login;
        saveConfig({ token, user });
        console.log(chalk.green(`logged in as ${user}`));
    } catch (error){
        console.log(chalk.red("login failed, try again"));
        process.exit(1);
    }
}