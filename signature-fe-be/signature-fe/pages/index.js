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
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [web3Instance, setWeb3Instance] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verifiedUi, setVerifiedUi] = useState();
  const [verifiedBackend, setVerifiedBackend] = useState();
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
    setIsFeatureActive(false);
    setWeb3Instance(null);
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
    setIsFeatureActive(true);
    setWeb3Instance(web3);
  }

  const connect = async () => {
    if(!(connectButtonLabel == 'Connect')) {
      return false;
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
        return;
      }

      if(! (await checkNetwork())) {
        toast({
          title: 'Error',
          description: "Please select Baobab network",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return;
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
      
    } catch(err) {
      console.error("connection error "+ err.message || err);
      toast({
        title: 'Error',
        description: "connection error "+ err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const signMessage = async () => {
    if(!message) return toast({
      title: 'Error',
      description: "Please provide valid message",
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
    
    let _signature = await window.ethereum.request({ method: 'personal_sign', 
      params: [address, message] });
    setSignedMessage(_signature);
    toast({
      title: 'Status',
      description: "Messsage Signed successfully",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const verifyMessageFromUi = () => {
    let _address = web3Instance.eth.accounts.recover(message, signedMessage)
    if(_address == address) {
      setVerifiedUi("Verified from UI & Signed by "+_address);
      toast({
        title: 'Status',
        description: "Verified message",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      setVerifiedUi("Not Verified");
      toast({
        title: 'Status',
        description: "Not Verified",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const verifyMessageFromBackend = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, message, signedMessage })
    };
    fetch('http://localhost:3001/signatures/verify', requestOptions)
        .then(response => response.json())
        .then(data => {
          if(data.success) {
            toast({
              title: 'Status',
              description: "Verified message",
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
          } else {
            toast({
              title: 'Status',
              description: "Not Verified",
              status: 'error',
              duration: 3000,
              isClosable: true,
            })
          }
          setVerifiedBackend(data.message);
        }).catch(err => {
          toast({
            title: 'Status',
            description: "Not Verified",
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        });
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
                <div className="Nav__network" id="connectButton" onClick={connect} style={{ cursor: 'pointer' }}>
                  {connectButtonLabel}
                </div>
              </div>
            </header>
            <div className="KlaytnPage__main">
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
              </div>
              { isFeatureActive == true && <div className="KlaytnPage__content" id="feature">
                <div className="Dropdown KlaytnPage__dropdown">
                  <div className="Dropdown__title">Sign & Verify Message</div>
                </div>
                <div className="KlaytnPage__txExample">
                  <h2 className="KlaytnPage__txExampleTitle">Sign & Verify Message</h2>
                  <div className="ValueTransferFD">
                    <h3>Signer</h3>
                    <div className="Input">
                      <input id="from" type="text" name="from" disabled placeholder="Signer" className="Input__input" autoComplete="off" value={address} />
                    </div>
                    <div className="Input">
                      <input id="message" onChange={(evt) => setMessage(evt.target.value)} type="text" name="from" placeholder="message" className="Input__input" autoComplete="off" value={message}/>
                    </div>
                    <button className="Button" onClick={signMessage}>
                      <span>Sign Message</span>
                    </button>
                    { signedMessage &&
                      <div className="BytecodeExample">
                        <h3>signature</h3>
                        <div className="BytecodeExample__code">{signedMessage}</div>
                      </div>
                    }
                    <div className="FeeDelegation">
                      <h3>Verify Message from UI</h3>
                      <button className="Button" onClick={verifyMessageFromUi}>
                        <span>Verify from UI</span>
                      </button>
                      { verifiedUi && <div className="TxResult">
                        <h3>Verification Status</h3>
                        <div className="Input">
                          <input id="deployedContract" disabled type="text" placeholder="" className="Input__input" autoComplete="off" value={verifiedUi}/>
                        </div>
                      </div>
                      }
                    </div>
                    
                    <div className="FeeDelegation">
                      <h3>Verify Message from Backend</h3>
                      <button className="Button" onClick={verifyMessageFromBackend}>
                        <span>Verify from Backend</span>
                      </button>
                      { verifiedBackend && <div className="TxResult">
                        <h3>Verification Status</h3>
                        <div className="Input">
                          <input id="deployedContract" disabled type="text" placeholder="" className="Input__input" autoComplete="off" value={verifiedBackend}/>
                        </div>
                      </div>
                      }
                    </div>
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
