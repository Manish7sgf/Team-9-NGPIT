/**
 * GitHub API service.
 * Fetches repo metadata, language breakdown, and README in parallel.
 * Works without GITHUB_TOKEN (60 req/hr unauthenticated).
 * With GITHUB_TOKEN: 5000 req/hr.
 */

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  const headers = { Accept: "application/vnd.github.v3+json" };
  if (token && token !== "your_personal_github_token") {
    headers.Authorization = `token ${token}`;
  }
  return headers;
}

export const githubService = {
  /**
   * Fetch repo data, languages, and README in parallel.
   * Uses Promise.allSettled so a missing README never breaks the whole call.
   *
   * @param {string} owner - GitHub username or org
   * @param {string} repo  - Repository name
   * @returns {{ repoData, languages, readme }}
   * @throws Error if repo is not found or not accessible (404/403)
   */
  async fetchRepoData(owner, repo) {
    const base = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = getHeaders();

    const [repoRes, languagesRes, readmeRes] = await Promise.allSettled([
      fetch(base, { headers }),
      fetch(`${base}/languages`, { headers }),
      fetch(`${base}/readme`, { headers }),
    ]);

    // Handle repo fetch — this is the critical one
    if (repoRes.status === "rejected") {
      throw new Error("Failed to reach GitHub API. Check your network.");
    }

    const repoResponse = repoRes.value;

    // Check rate limit header
    const rateRemaining = repoResponse.headers.get("X-RateLimit-Remaining");
    if (rateRemaining !== null && parseInt(rateRemaining, 10) === 0) {
      const err = new Error("GitHub API rate limit reached. Try again in 1 hour.");
      err.status = 429;
      throw err;
    }

    if (repoResponse.status === 404) {
      const err = new Error("Repository not accessible. Make sure it is public.");
      err.status = 400;
      throw err;
    }

    if (repoResponse.status === 403) {
      const err = new Error("GitHub access denied. Repository may be private.");
      err.status = 400;
      throw err;
    }

    if (!repoResponse.ok) {
      const err = new Error(`GitHub API error: ${repoResponse.status}`);
      err.status = 502;
      throw err;
    }

    const repoData = await repoResponse.json();

    // Languages — degrade gracefully if this fails
    const languages =
      languagesRes.status === "fulfilled" && languagesRes.value.ok
        ? await languagesRes.value.json()
        : {};

    // README — base64 decode, truncate to 2000 chars to stay within token budget
    let readme = "";
    if (readmeRes.status === "fulfilled" && readmeRes.value.ok) {
      const readmeJson = await readmeRes.value.json();
      if (readmeJson.content) {
        readme = Buffer.from(readmeJson.content, "base64")
          .toString("utf-8")
          .slice(0, 2000);
      }
    }

    return { repoData, languages, readme };
  },
};
