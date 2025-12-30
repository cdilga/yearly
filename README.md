# yearly

Visualise how many days you have in a year

## 🌐 Live Deployment

🚀 **Production**: [https://yearly.dilger.dev](https://yearly.dilger.dev)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/cdilga/yearly.git
cd yearly

# Install dependencies
npm install

# Run locally
npm run dev
```

## 📦 Deployment

This project automatically deploys to Cloudflare Workers when you push to the main branch.

### Manual Deployment
```bash
npm run deploy
```

## 🛠️ Development

### Local Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Environment Variables
- `CLOUDFLARE_API_TOKEN`: Used for deployment (set in GitHub Secrets)

## 📝 Requirements

An app which shows you the remaining days left of the year, with the already filled in ones coloured differently than the ones remaining. Updates daily wherever you are and runs client side.
Should colour in half dots for minute level accuracy. Fully beautify and responsive site with gorgeous animations absolutely everywhere. On load, everything.
![Image](https://github.com/user-attachments/assets/72f28070-ba0e-4a5f-b900-d78c43ffe1f2)

## 🤖 Created with Claude

This project was automatically generated using [the-ultimate-bootstrap](https://github.com/cdilga/the-ultimate-bootstrap).
