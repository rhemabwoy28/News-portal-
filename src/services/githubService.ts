import { Octokit } from "octokit";

export interface GithubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export const syncToGithub = async (config: GithubConfig, path: string, content: any, message: string) => {
  const octokit = new Octokit({ auth: config.token });
  
  const performSync = async (retryStep = 0): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Get the current file's SHA (required for update)
      // We add a timestamp to bypass GitHub's API cache which often causes "does not match" errors
      let sha: string | undefined;
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner: config.owner,
          repo: config.repo,
          path: path,
          ref: config.branch,
          headers: {
            'If-None-Match': '', // Bypass ETag
            'Cache-Control': 'no-cache'
          }
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
      // If we get a mismatch error (409 or 422), retry once with a fresh SHA
      if (retryStep === 0 && (error.status === 409 || error.status === 422)) {
        console.warn("SHA mismatch detected, retrying with fresh state...");
        return performSync(1);
      }
      
      console.error("GitHub Sync Error:", error);
      return { success: false, error: error.message };
    }
  };

  return performSync();
};
