import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  const token = core.getInput("github-token", { required: true });
  const client = new github.GitHub(token);

  const labelNames = await getPullRequestLabelNames(client);

  core.setOutput("labelNames", labelNames);
}

async function getPullRequestLabelNames(
  client: github.GitHub
): Promise<string[]> {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const commit_sha = github.context.sha;

  const response = await client.repos.listPullRequestsAssociatedWithCommit({
    owner,
    repo,
    commit_sha,
  });

  const pr = response.data.length > 0 && response.data[0];
  return pr ? pr.labels.map((label) => label.name) : [];
}

run().catch((err) => {
  core.setFailed(err.message);
});
