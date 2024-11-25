# Contributing Guidelines

`backstage-plugin-synergy` is [MIT licensed](LICENSE) and accepts contributions via
GitHub pull requests. This document outlines some of the conventions on
development workflow, commit message formatting, contact points, and other
resources to make it easier to get your contribution accepted.

Contributions are welcome, and they are greatly appreciated! Every little bit helps, and credit will always be given. ❤️

## Support Channels

The official support channels, for both users and contributors, are:

- GitHub [issues](https://github.com/jiteshy/backstage-plugin-synergy/issues)

## How to Contribute

Pull Requests (PRs) are the main and exclusive way to contribute to the project.

## Local setup

### Create a fork

Fork and then clone the repository:

```sh
git clone git@github.com:your_github_username/backstage-plugin-synergy.git
cd backstage-plugin-synergy
git remote add upstream https://github.com/jiteshy/backstage-plugin-synergy.git
git fetch upstream
```

### Install dependencies

```sh
yarn install
```

### Run the plugins locally

A standalone development version of both the frontend and backend plugins are included in this repository.
They can be started as follows:

```sh
yarn dev # starts both the frontend and the backend in parallel
yarn start # starts the frontend only
yarn start-backend # starts the backend only
```

## Making Changes

Start by creating a new branch for your changes:

```sh
git checkout main
git fetch upstream
git rebase upstream/main
git checkout -b feat: new-feature
```

Make your changes, then ensure that `yarn lint`, `yarn tsc` and `yarn test` still pass. If you're satisfied with your changes, push them to your fork.

```sh
git push origin feat: new-feature
```

Then use the GitHub UI to open a pull request.

Your changes are much more likely to be approved if you:

- add tests for new functionality
- commit messages should follow [conventional commit message](https://www.conventionalcommits.org/en/v1.0.0/) format
- maintain backward compatibility
- more information available at [docs](docs)
