# Version Control Workflow in VSCode

## Before Making Code Changes

### Method 1: Using VSCode Source Control

1. Open Source Control panel (Ctrl+Shift+G)
2. Click the branch icon in the bottom left corner
3. Select "Create new branch from..."
4. Name your branch (use conventions):
   - `feature/new-feature`
   - `bugfix/issue-description`
   - `enhancement/description`
5. Select "develop" as the source branch

### Method 2: Using VSCode Terminal

```bash
# Make sure youre up to date
git checkout develop
git pull origin develop

# Create new feature branch
git checkout -b feature/your-feature-name
```

### Method 3: Using GitHub Desktop

1. Open GitHub Desktop
2. Click Current Branch dropdown
3. Click "New Branch"
4. Name your branch
5. Select "develop" as source
6. Click "Create Branch"

## After Creating Branch

1. Verify your branch:
   - Look at VSCode status bar (bottom left)
   - Should show your new branch name

2. Create a checkpoint (optional):
```bash
git add .
git commit -m "chore: initial checkpoint before changes"
```

3. Now safe to make code changes

## Best Practices

1. Always create new branch before changes
2. Use descriptive branch names
3. Branch from develop, not main
4. Pull latest changes before branching
5. One feature/fix per branch

## Quick Commands

```bash
# Check current branch
git branch --show-current

# List all branches
git branch -a

# Switch to existing branch
git checkout branch-name

# Undo changes if needed
git checkout -- filename
```

## Version Tagging (for releases)

```bash
# Create new version tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Push tags to remote
git push origin --tags
```
