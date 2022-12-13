# klaytn-dapp-kit

Boiler plate code for signing and authentication. The repository has the structure and template to connect to multiple wallets using [web3modal](https://github.com/klaytn/klaytn-web3modal). 
  
1. **sign** 
Signing module has a frontend and backend boiler plate code with signing and authentication feature. Using this module you can, 
    - sign a message using the wallet.
	- verify the message from frontend
	- verify the message from backend

Refer to [README](sign/README.md) section for step by step instructions to sign and authenticate

2. **authenticate**
Authenticate module has a frontend and backend boiler plate code to sign, verify a message using a nonce and JWT token. Frontend will sign the message using response generated nonce .Backend will verify the signature and generate a jwt token for the front end dapp to communicate with the backend. 
	- register and login user address

Refer to [README](authenticate/README.md) section for step by step instructions to sign and authenticate

![Authentication Flow](authenticate/docs/authentication_flow.png)

3. **fee delegation**
Fee Delegation has a frontend and backend boiler plate code to sign with deployer and fee payer. Frontend will sign the transaction with deployer kaikas account .Backend will send the transaction from fee payer for the signed transaction of deployer from frontend. 
	- sample contract deployment with deployer and fee payer

Refer to [README](feedelegation/README.md) section for step by step instructions to perform transaction with deployer and feepayer

## Want to Contribute to Klaytn Dapp Kit? <a id="want-to-contribute"></a>

In line with our commitment to decentralization, all Klaytn codebase and its documentations are completely open source. Klaytn always welcomes your contribution. Anyone can view, edit, fix its contents and make suggestions. You can either create a pull request on GitHub or create a enhancement request. Make sure to check our [Contributor License Agreement (CLA)](https://gist.github.com/e78f99e1c527225637e269cff1bc7e49) first and there are also a few guidelines our contributors would check out before contributing:

- [Contribution Guide](./CONTRIBUTING.md)
- [License](./LICENSE)
- [Code of Conducts](./code-of-conduct.md)