import { Octokit } from "octokit";

export interface GithubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export const syncToGithub = async (config: GithubConfig, path: string, content: any, message: string) => {
  const octokit = new Octokit({ auth: config.token });
  
  try {
    // 1. Get the current file's SHA (required for update)
    let sha: string | undefined;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: path,
        ref: config.branch
      });
      if (!Array.isArray(data)) {
        sha = data.sha;
      }
    } catch (e) {
      console.log("File likely doesn't exist yet, will create.");
    }

    // 2. Create or Update the file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: path,
      message: message,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
      sha: sha,
      branch: config.branch
    });

    return { success: true };
  } catch (error: any) {
    console.error("GitHub Sync Error:", error);
    return { success: false, error: error.message };
  }
};
