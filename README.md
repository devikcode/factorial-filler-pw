# Factorial Timesheet Automation

Automate filling your Factorial HR timesheets using Playwright.

## How It Works

1. **Login**: Authenticates with your Factorial credentials
2. **Scan**: Finds all days with the specified hour deficit (e.g., -8h)
3. **Alert**: ⚠️ Warns you about any days with different deficits for manual review
4. **Fill**: For each day found:
   - Adds first work shift (default: 09:00-13:00)
   - Adds break (default: 13:00-14:00)
   - Adds second work shift (default: 14:00-18:00)
5. **Project**: Assigns the configured project to all shifts (if `FACTORIAL_PROJECT_NAME` is set)

## Configuration

You can customize the schedule and other settings via environment variables in `.env`:

## Prerequisites

- Node.js (v18 or higher recommended)
- A Factorial HR account

## Installation

1. Clone the repository:
```bash
# HTTPS (recommended)
git clone https://github.com/devikcode/factorial-filler-pw.git

# SSH (if you have keys configured)
git clone git@github.com:devikcode/factorial-filler-pw.git

cd factorial-pw
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Configure your credentials:
```bash
cp env.example .env
```

Edit `.env` with your Factorial credentials:
```env
FACTORIAL_EMAIL="your-email@example.com"
FACTORIAL_PASSWORD="your-password"
FACTORIAL_PROJECT_NAME="Your Project Name"  # Optional

# Optional: Specify month and year to fill (defaults to current month/year)
# FACTORIAL_MONTH=12
# FACTORIAL_YEAR=2025

# Optional: Customize work schedule (defaults shown below)
# SHIFT_ONE_START_TIME="09:00"
# SHIFT_ONE_END_TIME="13:00"
# BREAK_START_TIME="13:00"
# BREAK_END_TIME="14:00"
# SHIFT_TWO_START_TIME="14:00"
# SHIFT_TWO_END_TIME="18:00"
```

**Notes**: 
- If you don't specify `FACTORIAL_MONTH` and `FACTORIAL_YEAR`, the script will automatically use the current month and year
- If you don't specify the schedule times, the default times shown above will be used

## Usage

Execute in headless mode:
```bash
npm run pw
```

Run with browser visible:
```bash
npm run pw:headed
```

**Login fails:**
- Check your credentials in `.env`
- Make sure your Factorial account is active

**Elements not found:**
- Factorial may have updated their UI - you may need to update selectors in `Actions.ts`
