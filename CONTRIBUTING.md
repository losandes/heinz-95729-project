How to Contribute
=================

## Pull Requests

Generally we like to see pull requests that:

* Maintain the existing code style
* Are focused on a single change (i.e. avoid large refactoring or style adjustments in untouched * code if not the primary goal of the pull request)
* Have [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
* Have tests
* Don't decrease the current code coverage

## Git Strategy

An atomic commit driven git log/history is verbose and hard to understand. By rebasing, and squashing the commits that make up a PR into more meaningful commits, our log history will be:

* easier to understand
* easier to debug with tools like `git bisect`
* able to recognize units of work at the bug/feature level instead of at the authoring level
* easier to resolve conflicts
* able to use a "merge" strategy when merging PRs onto master

That being said, the "Squash and Merge" option in PRs tends to introduce a lot of effort for developers who are submitting PRs, and then building on them. While working on the OneDrive app, we found this produced an anti-pattern most of the time. So limit squashing to within PRs, rather than down to master. Examples follow.

#### Fetch from an appropriate origin

```Shell
git fetch
git checkout master
```

#### Create a bug/feature branch
`git checkout -b [BRANCH_NAME]`

#### Do your work
Consider writing "atomic" commits (a commit per unit of work) so it's easier to remember what you did at the end of this workflow

#### When you're ready to submit a PR, rebase from master

```Shell
git fetch
git rebase origin/master
```

#### Find the commit hash (SHA) for commit _before_ the first commit you made on this branch

```Shell
git log --online

# OR if seeing the author and time helps:
git log --pretty=format:'%C(yellow)%h %C(cyan)%an: %C(reset)%s%C(blue)%d %C(green)%cr%C(reset)'
```

In the following example, my first commit on this branch is: 09bab93, so the commit I'm looking for is, 907835a.

```
4b0d519 (HEAD -> features/init) Adds private:true to package.json
533eb56 Adds TypeScript config and linting rules
b8591b9 Adds ADR for screaming architecture
0441e8f Adds adr folder to the root-folders ADR
fdf0ffa Adds the src directory, and a README stub
9352acf Adds ADR for root folder organization
b9d5521 Adds ADR directory and README
9c0601b Adds package.lock
167e102 Adds gitignore
09bab93 Initializes the repo
907835a (origin/master, origin/HEAD, master) Configure checkpoint for app-onedrive repo
fe56cd3 Create README.md
```

#### Perform an interactive rebase to that commit
`git rebase -i [SHA]`

Leave the top entry as "pick", and change the rest of the "pick"'s to "squash". After you `:wq`, you will be given an opportunity to rewrite the commit message.

When you're done the following:
```
pick 09bab93 Initializes the repo
pick 167e102 Adds gitignore
pick 9c0601b Adds package.lock
pick b9d5521 Adds ADR directory and README
pick 9352acf Adds ADR for root folder organization
pick fdf0ffa Adds the src directory, and a README stub
pick 0441e8f Adds adr folder to the root-folders ADR
pick b8591b9 Adds ADR for screaming architecture
pick 533eb56 Adds TypeScript config and linting rules
pick 4b0d519 Adds private:true to package.json
# Rebase 907835a..4b0d519 onto 907835a (10 commands)
#
# Commands: ...
```

Would look like this:
```
pick 09bab93 Initializes the repo
squash 167e102 Adds gitignore
squash 9c0601b Adds package.lock
squash b9d5521 Adds ADR directory and README
squash 9352acf Adds ADR for root folder organization
squash fdf0ffa Adds the src directory, and a README stub
squash 0441e8f Adds adr folder to the root-folders ADR
squash b8591b9 Adds ADR for screaming architecture
squash 533eb56 Adds TypeScript config and linting rules
squash 4b0d519 Adds private:true to package.json
# Rebase 907835a..4b0d519 onto 907835a (10 commands)
#
# Commands: ...
```

After which you would be presented with a commit message editor populated with all of the commit messages that are being squashed together.

> If you want to prepare your commit message ahead of time, the following command will copy to the clipboard, the commit messages since a commit hash: `git log --pretty=format:'%n%C(red)## %s%C(reset)%n%b' -n $(git rev-list 907835a..HEAD --count --reverse) | pbcopy` where 907835a is the commit hash you would use in the above squashing.

#### Push

```Shell
git branch --set-upstream-to=origin/`git symbolic-ref --short HEAD`
git push

# You need to force push if you pushed previously
git push --force
```

#### If changes occur on master before pushing or merging to master, rebase again

```Shell
git fetch
git rebase origin/master
git push #? --force
```
