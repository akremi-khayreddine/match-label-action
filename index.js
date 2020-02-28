const core = require('@actions/core')  
const { context } = require('@actions/github')
const { Octokit } = require('@octokit/rest')
const match = require('./match');

async function run() {
  try {
    const octokit = new Octokit({ auth: core.getInput('github_token') });
    const result = await octokit.pulls.get(
      {
        owner: context.repo.owner,
        pull_number: context.payload.pull_request.number,
        repo: context.repo.repo
      }
    );
    const pr = result.data;
    const labels = pr ? pr.labels : [];
    const labelNames = labels.map(label => label.name)
    const allowedLabels = match.parseAllowed(core.getInput('allowed'))
    const matchingLabel = match.findMatching(labelNames, allowedLabels)
    core.setOutput('match', matchingLabel)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()


