import axios from "axios";
import chalk from "chalk";
import { getConfig } from "./config.js";

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

api.interceptors.request.use((config) => {
  const saved = getConfig();

  if (!saved || !saved.token) {
    console.log(chalk.red("not logged in"));
    console.log(chalk.yellow("run: git-peek login <token>"));
    process.exit(1);
  }

  config.headers.Authorization = `Bearer ${saved.token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log(chalk.red("authentication failed"));
      console.log(chalk.yellow("your token may be invalid or expired"));
    } else if (err.response?.status === 403) {
      console.log(chalk.red("API rate limit exceeded"));
    } else {
      console.log(chalk.red("gitHub API error"));
    }
    process.exit(1);
  }
);

export async function getAuthenticatedUser() {
  const res = await api.get("/user");
  return res.data;
}

export async function getUserEvents(username) {
  const res = await api.get(`/users/${username}/events`);
  return res.data;
}

export async function getRepo(owner, repo) {
  const res = await api.get(`/repos/${owner}/${repo}`);
  return res.data;
}

export async function compareCommits(owner, repo, base, head) {
  try {
    const res = await api.get(`/repos/${owner}/${repo}/compare/${base}...${head}`);
    return res.data;
  } catch (error) {
    return null;
  }
}

export async function getOwnedRepos() {
  let page = 1;
  let repos = [];

  while (true) {
    const res = await api.get("/user/repos", {
      params: {
        visibility: "all",
        affiliation: "owner",
        per_page: 100,
        page
      }
    });

    if (res.data.length === 0) break;

    repos.push(...res.data);
    page++;
  }

  return repos;
}
