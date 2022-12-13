# FeeDelegation using web3modal for Baobab network

Steps to run the application
`cd feedelegation`

1. **Setup Application**
    - `yarn install`
    - Rename .env.example and update privatekey/publickey details of any account from metamask or kaikas wallet for fee payer containing test klay coins
    - `yarn start`
    - Open application in browser `http://localhost:3000`
2. Fee Delegates a contract deployment with a deployer from wallet connected to Baobab from UI and fee payer from Backend
3. Fee Delegation
	a) Deployer Signature from UI
	b) Fee Payer Signature and Transaction submission from Backend
