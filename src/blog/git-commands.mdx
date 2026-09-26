---
title: Most Useful Git Commands
pubDate: 2026-03-14
description:
  "A practical reference for the git commands I use the most. From stash tricks
  and interactive rebase to worktrees, bisect, and recovery with reflog."
tags: ["tools"]
snippet:
  language: "bash"
  code: |
    git log --oneline --graph --all
    git stash
    git rebase -i HEAD~3
    git bisect start
---

Git is one of those tools you use every day, but most people only scratch the
surface. Here are the commands I find myself reaching for the most.

## The Essentials

### git log --oneline --graph --all

The default `git log` output is verbose. This combination gives you a compact,
visual history of all branches.

```bash
git log --oneline --graph --all
```

You can alias this to something short like `git lg` by adding it to your
`.gitconfig`:

```bash
git config --global alias.lg "log --oneline --graph --all"
```

### git diff --staged

Before committing, I always check what is actually staged. `git diff` alone
shows unstaged changes, but `--staged` shows exactly what will go into the next
commit.

```bash
git diff --staged
```

### git stash

When you need to quickly switch context without committing half-done work,
`stash` saves your working directory and index state.

```bash
git stash
git checkout other-branch
# do some work
git checkout -
git stash pop
```

#### Naming stashes

By default stashes get a generic name based on the branch and commit. Use `-m`
to give them a meaningful description so you can identify them later.

```bash
git stash push -m "wip: auth refactor"
git stash list
# stash@{0}: On main: wip: auth refactor
```

#### Stashing specific files

You do not have to stash everything. Use `push` with file paths to stash only
certain files.

```bash
# stash only specific files
git stash push -m "just the config" src/config.ts src/env.ts

# stash only staged changes (leaves unstaged changes in the working tree)
git stash push --staged -m "staged only"
```

#### Stashing untracked files

By default `git stash` only saves tracked files. Use `-u` to include untracked
files, or `-a` to also include ignored files.

```bash
# include untracked files
git stash push -u -m "with new files"

# include untracked AND ignored files
git stash push -a -m "everything"
```

#### Stashing interactively

Use `-p` (patch) to interactively choose which hunks to stash, similar to
`git add -p`.

```bash
git stash push -p -m "partial changes"
```

#### Listing and inspecting stashes

```bash
# list all stashes
git stash list

# show the diff of a specific stash
git stash show stash@{1}

# show the full diff with file contents
git stash show -p stash@{1}
```

#### Applying and removing stashes

```bash
# apply the most recent stash and remove it from the list
git stash pop

# apply without removing (keeps the stash for reuse)
git stash apply

# apply a specific stash
git stash apply stash@{2}

# drop a specific stash
git stash drop stash@{1}

# clear all stashes
git stash clear
```

#### Creating a branch from a stash

If your stashed changes conflict with work done since the stash was created, you
can apply the stash onto a new branch starting from the commit where the stash
was originally made.

```bash
git stash branch new-feature-branch stash@{0}
```

## Rewriting History

### git rebase -i HEAD~n

Interactive rebase is the most powerful command for cleaning up commits before
pushing. You can squash, reorder, reword, or drop commits.

```bash
git rebase -i HEAD~3
```

This opens your editor with the last 3 commits. Common operations:

- **squash**: merge a commit into the previous one
- **reword**: change the commit message
- **drop**: remove the commit entirely

### git commit --amend

Quick fix for the last commit, whether you forgot a file or made a typo in the
message.

```bash
git add forgotten-file.ts
git commit --amend
```

Use `--no-edit` if you only want to add files without changing the message.

## Debugging

### git bisect

When a bug was introduced somewhere in the history and you have no idea where,
`bisect` performs a binary search through your commits.

```bash
git bisect start
git bisect bad          # current commit is broken
git bisect good v1.0.0  # this tag was working
# git checks out a middle commit, you test it
git bisect good         # or git bisect bad
# repeat until git finds the first bad commit
git bisect reset
```

### git blame -L start,end file

Shows who last modified each line. The `-L` flag lets you focus on a specific
range instead of the entire file.

```bash
git blame -L 10,30 src/auth/login.ts
```

### git log -S "search_term"

Searches through commit diffs for a string. Useful when you need to find when a
function or variable was added or removed.

```bash
git log -S "validateToken" --oneline
```

## Working with Remotes

### git fetch --prune

Fetches updates from the remote and removes references to branches that no
longer exist on the remote.

```bash
git fetch --prune
```

### git push -u origin branch-name

The `-u` flag sets the upstream tracking reference. After this, you can just use
`git push` and `git pull` without specifying the remote and branch.

```bash
git push -u origin feature/new-auth
```

### git pull --rebase

Instead of creating a merge commit every time you pull, rebase puts your local
commits on top of the remote changes, keeping a linear history.

```bash
git pull --rebase
```

You can make this the default behavior:

```bash
git config --global pull.rebase true
```

## Recovery

### git reflog

The safety net. `reflog` records every change to `HEAD`, even ones that
`git log` does not show. If you accidentally reset, rebase, or delete something,
you can usually recover it.

```bash
git reflog
git checkout HEAD@{3}
```

### git cherry-pick

Applies a specific commit from another branch onto your current branch. Useful
when you need one particular fix without merging an entire branch.

```bash
git cherry-pick abc1234
```

### git branch from a commit

You can create a new branch starting from any commit in the history. This is
useful when you realize an older commit would be a better starting point for a
fix or feature, or when you need to recover work from a specific point in time.

```bash
# create a branch from a specific commit hash
git branch hotfix/login abc1234

# create and switch to it in one step
git checkout -b hotfix/login abc1234

# same thing using the newer switch command
git switch -c hotfix/login abc1234
```

You can also use references like tags, `HEAD~n`, or branch names instead of a
commit hash:

```bash
# branch from 3 commits ago
git switch -c experiment HEAD~3

# branch from a tag
git switch -c patch-v2 v2.0.0
```

### git restore --source origin/branch file

Restores a file to the version that exists on the remote. Useful when you have
made local changes to a file and want to discard them in favor of the remote
state.

```bash
# restore a single file to the remote main version
git restore --source origin/main -- src/auth/login.ts

# restore multiple files
git restore --source origin/main -- src/auth/login.ts src/auth/utils.ts
```

Make sure to `git fetch` first so your remote references are up to date:

```bash
git fetch origin
git restore --source origin/main -- path/to/file
```

## Worktrees

A worktree lets you check out multiple branches of the same repository at the
same time, each in its own directory on disk. Instead of stashing or committing
unfinished work to switch branches, you create a new worktree and work on both
branches simultaneously. Every worktree shares the same `.git` data, so there is
no duplication of history or objects.

This is especially useful when you need to review a pull request while working
on a feature, reproduce a bug on `main` without losing your current state, or
run tests on one branch while developing on another.

### git worktree add

Creates a new worktree linked to your repository. You can specify an existing
branch or create a new one.

```bash
# check out an existing branch in a new directory
git worktree add ../hotfix-auth hotfix/auth

# create a new branch and check it out in a new directory
git worktree add -b feature/new-api ../new-api
```

Each worktree is a regular directory with a working tree. You can `cd` into it,
run builds, tests, and commits independently.

### git worktree list

Shows all worktrees linked to the repository.

```bash
git worktree list
```

Output looks like:

```text
/home/user/project         abc1234 [main]
/home/user/hotfix-auth     def5678 [hotfix/auth]
/home/user/new-api         ghi9012 [feature/new-api]
```

### git worktree remove

Removes a worktree when you are done with it. The branch is kept, only the
directory is cleaned up.

```bash
git worktree remove ../hotfix-auth
```

If the worktree has uncommitted changes, git will refuse to remove it unless you
pass `--force`.

### git worktree prune

Cleans up stale worktree references, for example when a worktree directory was
deleted manually instead of using `git worktree remove`.

```bash
git worktree prune
```

## Useful Aliases

Here are the aliases I keep in my `.gitconfig`:

```ini
[alias]
  st = status -sb
  lg = log --oneline --graph --all --decorate
  co = checkout
  br = branch -vv
  unstage = reset HEAD --
  last = log -1 HEAD --stat
```

These save keystrokes and make the output more readable. The small investment of
setting them up pays off every day.
