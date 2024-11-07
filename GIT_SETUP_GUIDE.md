# Git Setup Guide

This guide will help you set up Git with VSCode and GitHub, avoiding common pitfalls and errors.

## Prerequisites

1. Install VSCode: https://code.visualstudio.com/
2. Install GitHub Desktop: https://desktop.github.com/
3. Create GitHub account: https://github.com/signup

## Initial Setup

### 1. Configure Git Globally

```bash
# Set your username
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"
```

### 2. Install Git Extensions in VSCode

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for and install:
   - "Git History"
   - "GitLens"
   - "GitHub Pull Requests and Issues"

## Creating a New Repository

### Method 1: Starting from Local Project

1. Initialize Git:
```bash
git init
```

2. Create .gitignore (important for Node.js/Angular projects):
```
node_modules/
.env
.angular/
dist/
```

3. Add and commit files:
```bash
git add .
git commit -m "Initial commit"
```

4. Create repository on GitHub:
   - Go to github.com
   - Click "New repository"
   - Name your repository
   - Dont initialize with README
   - Copy the repository URL

5. Connect and push:
```bash
git remote add origin https://github.com/username/repository.git
git branch -M main
git push -u origin main
```

### Method 2: Using GitHub Desktop

1. Open GitHub Desktop
2. File -> New Repository
3. Fill in the details:
   - Name
   - Description
   - Local path
   - Choose .gitignore template (Node)
4. Click "Create Repository"

## Branch Management

### Setting Up Development Branch

```bash
# Create and switch to develop branch
git checkout -b develop

# Push develop branch to remote
git push -u origin develop
```

### Working with Branches

```bash
# Create feature branch
git checkout -b feature/your-feature develop

# Push feature branch
git push -u origin feature/your-feature

# Merge feature to develop
git checkout develop
git merge feature/your-feature
git push origin develop
```

## Undoing Changes in VSCode

### 1. Using VSCode Interface

- Ctrl+Z: Undo last change
- Ctrl+Shift+Z: Redo last change
- Source Control panel (Ctrl+Shift+G):
  - Discard changes in files
  - Revert commits
  - View file history

### 2. Using Git Commands

```bash
# Discard uncommitted changes in specific file
git checkout -- filename

# Undo last commit but keep changes
git reset HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1

# Create new commit that undoes a specific commit
git revert <commit-hash>
```

## Troubleshooting

### 1. Push Rejected
If push is rejected due to remote changes:
```bash
git pull origin branch-name
# Resolve conflicts if any
git push origin branch-name
```

### 2. Force Push (use carefully)
If you need to overwrite remote history:
```bash
git push -f origin branch-name
```

### 3. Repository Issues
If repository gets into a bad state:
```bash
# Remove git tracking
rm -rf .git

# Reinitialize repository
git init
git add .
git commit -m "Fresh start"
git remote add origin https://github.com/username/repository.git
git push -f origin main
```

## Best Practices

1. Always work in feature branches
2. Commit frequently with clear messages
3. Pull before pushing to avoid conflicts
4. Use meaningful commit messages
5. Keep .gitignore updated
6. Regular pushes to backup your work

## Using GitHub Desktop

1. For visual management:
   - Easy branch switching
   - Visual commit history
   - Simple push/pull operations
   - Clear difference viewing
   - Easy conflict resolution

2. Regular workflow:
   - Create branch
   - Make changes
   - Review changes
   - Commit
   - Push to GitHub
   - Create pull request
