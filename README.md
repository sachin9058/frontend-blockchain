# Web3 Wallet Dashboard  

A decentralized Web3 application built with **Next.js**, **TypeScript**, and **TailwindCSS** that enables users to connect their crypto wallets, view token balances, and interact securely with blockchain networks in real-time.  



## ✨ Features Implemented  

- 🔐 **Wallet Integration**  
  - Connect / Disconnect wallet functionality (via MetaMask / other EVM-compatible wallets).  
  - Secure session management using **Clerk** authentication.  

- 💰 **Token Balance Display**  
  - Fetches and displays token balances for popular tokens like ETH, BTC, LINK, SOL, and more.  
  - Real-time updates using **on-chain data**.  

- 📡 **Real-Time Functionality**  
  - Live updates of balances via blockchain calls.  
  - Optimized with hooks for smooth user experience.  

- 🎨 **User Interface**  
  - Built with **Tailwind CSS** for a responsive, modern UI.  
  - Includes wallet dashboard with balances, connection status, and user-friendly controls.  

---

## 🔗 Oracles and External Integrations  

- ✅ **Price Oracles**  
  - Integrated with Chainlink to fetch **real-time token prices**.  

- ✅ **Authentication**  
  - Uses **Clerk** for secure user login and role-based access.  

---

## 🛠️ Tech Stack  

- **Framework**: Next.js (App Router, TypeScript)  
- **UI**: TailwindCSS + shadcn/ui components  
- **Blockchain**: Ethers.js / Web3.js (for wallet + balance fetching)  
- **Auth**: Clerk  
- **Oracles**: Chainlink  

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js (>= 18)  
- MetaMask or any Web3 wallet installed  

### Installation  

```bash
# Clone the repo
git clone https://github.com/your-username/web3-wallet-dashboard.git

# Navigate to project
cd web3-wallet-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
Open http://localhost:3000 to see the app.

🎥
Demo Video

https://github.com/user-attachments/assets/91075c9e-43e8-4bc8-a777-ca8928d759df

📌 Future Improvements
 Add transaction history tracking

 Support multi-chain balances (Polygon, BSC, etc.)

 Deploy smart contracts for staking / rewards

 Improve real-time updates with WebSockets

🧑‍💻 Author
Sachin Kumar


