import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Web3 from 'web3';
import { useState, useEffect, useContext } from 'react' 
import { useToast } from '@chakra-ui/react'
import Web3Modal from "web3modal";

export default function Home() {
  const [address, setAddress] = useState("Login with Metamask Wallet :)");
  const [balance, setBalance] = useState(0);
  const [connectButtonLabel, setConnectButtonLabel] = useState("Connect");
  const [web3Instance, setWeb3Instance] = useState();
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toast = useToast()
  const targetNetworkId = '0x3e9';

  const checkNetwork = async () => {
    if(window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if(currentChainId == targetNetworkId) return true;
      return false;
    }
  }

  const reset = async () => {
    setAddress('');
    setBalance('0');
    setConnectButtonLabel("Connect");
    setWeb3Instance(null);
    setIsLoggedIn(false);
  }

  const reload = async () => {
    const providerOptions = {};
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions
    });
    const provider = await web3Modal.connect();

    let web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    let _address = accounts[0];
    let _balance = await web3.eth.getBalance(_address);
    _balance = web3.utils.fromWei(_balance, "ether");

    setAddress(_address);
    setBalance(_balance.toString());
    setConnectButtonLabel("Baobab Network");
    setWeb3Instance(web3);
  }

  const connect = async () => {
    if(!(connectButtonLabel == 'Connect')) {
      return true;
    }
    try {
      if(window && window.ethereum) {
        await window.ethereum.enable();
      } else {
        toast({
          title: 'Error',
          description: "Not able to find Metamask. Please install",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return false;
      }

      if(! (await checkNetwork())) {
        toast({
          title: 'Error',
          description: "Please select Baobab network",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return false;
      } else {
        toast({
          title: 'Connected',
          description: "Connected to Baobab network",
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      await reload();

      window.ethereum.on('accountsChanged', async (_accounts) => {
        setAddress(_accounts[0]);
        let _balance = await web3.eth.getBalance(_accounts[0]);
        _balance = web3.utils.fromWei(_balance, "ether");
        setBalance(_balance.toString());
      });

      window.ethereum.on('networkChanged', (networkId) => {
        if(networkId == targetNetworkId) {
          reload();
        } else {
          reset();
        }
      })

      return true;
      
    } catch(err) {
      console.error("connection error "+ err.message || err);
      toast({
        title: 'Error',
        description: "connection error "+ err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return false;
    }
  }

  const register = async () => {
    let connected = (connectButtonLabel != "Connect")
    if(connected == true) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      };
      fetch('http://localhost:3001/auth/register', requestOptions)
          .then(response => response.json())
          .then(data => {
            toast({
              title: 'Registered',
              description: "Registered successfully",
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
          }).catch(err => {
            toast({
              title: 'Error',
              description: "Problem while registering",
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
          });
    } else {
      toast({
        title: 'Error',
        description: "Please connect and register with metamask",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const login = async () => {
    let connected = (connectButtonLabel != "Connect")
    if(connected == true) {
      let result = await requestNonce();
      if(result.success == false) {
        throw new Error("Problem while generating nonce");
      }
      let signature = await signMessage(result.data.nonce);
      debugger;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address, signature: signature })
      };
      fetch('http://localhost:3001/auth/login', requestOptions)
        .then(response => response.json())
        .then(data => {
          debugger;
          if(data.success) {
            toast({
              title: 'Login Status',
              description: "Logged-in successfully",
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            setIsLoggedIn(true);
          } else {
            toast({
              title: 'Login Status',
              description: "Login failure "+data.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
          }
          
        }).catch(err => {
          toast({
            title: 'Login Status',
            description: "Problem while loggin in"+err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }); 
    } else {
      toast({
        title: 'Error',
        description: "Please connect and login with metamask",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    
  }

  const requestNonce = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: address })
    };
    return await fetch('http://localhost:3001/auth/nonce', requestOptions)
              .then(response => response.json())
  }

  const signMessage = async (_nonce) => {
    _nonce = `Nonce : ${_nonce}`
    if(!_nonce) return toast({
      title: 'Error',
      description: "Please provide valid message",
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
    
    let _signature = await window.ethereum.request({ method: 'personal_sign', 
      params: [address, _nonce] });
    toast({
      title: 'Status',
      description: "Messsage Signed successfully",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    return _signature;
  }

  return (
    <div>
      <div id="root">
        <div className="App">
          <div className="KlaytnPage">
            <header className="Nav">
              <div className="Nav__inner">
                <h1 className="Nav__logo">
                  <a href="/">
                    <img src="logo.png" alt="Klaytn Snap Tutorial"/>
                  </a>
                </h1>
                <div className="Nav__network" style={{cursor: 'pointer'}} id="connectButton" onClick={connect}>
                  {connectButtonLabel}
                </div>
              </div>
            </header>
            <div className="KlaytnPage__main">
              { isLoggedIn == false ?
              <div className="WalletInfo">
                <h2 className="WalletInfo__title">Authentication</h2>
                <div className="WalletInfo__infoBox">
                  { showLogin == true ? <>
                      <div className="WalletInfo__info">
                        <span className="WalletInfo__label">Login</span>
                      <button className="Button" onClick={login} style={{cursor: 'pointer'}}>
                        <img src=""/>
                        <span>Login With Metamask</span>
                      </button>
                    </div>
                    <span className="WalletInfo__label" onClick={() => setShowLogin(false)} style={{textAlign: 'right', paddingRight: '30px', cursor: 'pointer'}}>
                      Not Registered ?
                    </span>
                  </> :
                  <>
                    <div className="WalletInfo__info">
                        <span className="WalletInfo__label">Register</span>
                      <button className="Button" onClick={register} style={{cursor: 'pointer'}}>
                        <img src=""/>
                        <span>Register With Metamask</span>
                      </button>
                    </div>
                    <span className="WalletInfo__label" onClick={() => setShowLogin(true)} style={{textAlign: 'right', paddingRight: '30px', cursor: 'pointer'}}>
                      Registered Already ?
                    </span>
                  </>}
                </div>
                <p className="WalletInfo__faucet">If you need small amount of Klay for testing. <a className="WalletInfo__link" href="https://baobab.wallet.klaytn.foundation/faucet" target="_blank" rel="noreferrer noopener">Run Klay Faucet</a>
                </p>
              </div> :
              <div className="WalletInfo">
                <h2 className="WalletInfo__title">Wallet Information</h2>
                <div className="WalletInfo__infoBox">
                  <div className="WalletInfo__info">
                    <span className="WalletInfo__label">Wallet Address</span><span id="addressSpan">{address}</span>
                  </div>
                  <div className="WalletInfo__info">
                    <span className="WalletInfo__label">Balance</span>
                    <span className="WalletInfo__balance" id="balanceSpan">{balance}</span>
                    <span className="WalletInfo__unit">KLAY</span>
                  </div>
                </div>
                <p className="WalletInfo__faucet">If you need small amount of Klay for testing. <a className="WalletInfo__link" href="https://baobab.wallet.klaytn.foundation/faucet" target="_blank" rel="noreferrer noopener">Run Klay Faucet</a>
                </p>
              </div> }
              { isLoggedIn == true && <div className="KlaytnPage__content" id="feature">
                <div className="Dropdown KlaytnPage__dropdown">
                  <div className="Dropdown__title">Successfully Logged In</div>
                </div>
                <div className="KlaytnPage__txExample">
                  <div className="ValueTransferFD">
                    <button className="Button" onClick={reset}>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div> }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
