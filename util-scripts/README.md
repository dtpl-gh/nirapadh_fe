# Utility Scripts

This directory contains helper scripts for project management and setup.

## Available Scripts

### setup-env.sh
Automatically creates and initializes environment configuration files.

**Usage:**
```bash
./util-scripts/setup-env.sh
```

**What it does:**
- Creates `.env.local` from `.env.example` (for local development)
- Creates `.env.docker` from `.env.example` (for Docker deployment)
- Provides instructions for customizing the files

**Output:**
```
✓ .env.local created
✓ .env.docker created
```

### clean.sh
Cleans up the project by removing build artifacts and reinstalling dependencies.

**Usage:**
```bash
./util-scripts/clean.sh
```

**What it does:**
- Removes duplicate documentation files
- Clears Next.js build cache (`.next/`)
- Removes `node_modules/` and `package-lock.json`
- Cleans temporary and log files
- Reinstalls dependencies with `npm install --legacy-peer-deps`

**Best for:**
- When you have build issues
- After pulling major changes
- When dependency conflicts occur
- Before committing to git

## Quick Commands

```bash
# Setup environment
./util-scripts/setup-env.sh

# Full project cleanup and reinstall
./util-scripts/clean.sh

# Combined: setup and clean
./util-scripts/setup-env.sh && ./util-scripts/clean.sh
```

## Notes

- Both scripts are executable and can be run from the project root
- They require bash shell (default on macOS and Linux)
- The `clean.sh` script will take a few minutes due to npm install
- Always commit your changes before running `clean.sh`

