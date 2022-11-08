# klaytn-dapp-kit

Boiler plate code for signing and authentication. The repository has the structure and template to connect to multiple wallets using [web3modal](https://github.com/Yeonju-Kim/web3modal). 
  
1. **sign** 

Signing module has a frontend and backend boiler plate code with signing and authentication feature. Using this module you can, 
    - sign a message using the wallet.
	- verify the message from frontend
	- verify the message from backend

Refer to [README](sign/README.md) section for step by step instructions to sign and authenticate

2. **authenticate**
Authenticate module has a frontend and backend boiler plate code to a sign and verify a message using a nonce and JWT token. Frontend will sign the message using a random nonce and backend will verify the signature and generate a jwt token for the front end dapp to communicate with the backend. 
	- register the user address.
	- login 

Refer to [README](authenticate/README.md) section for step by step instructions to sign and authenticate

![Authentication Flow](https://github.com/klaytn/klaytn-dapp-kit/blob/dev/authenticate/docs/authentication_flow.png?raw=true)


	