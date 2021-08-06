import Web3 from 'web3'
const ethUtil = require('ethereumjs-util');

export const checkSumAddress = (ethAddress) => ethUtil.toChecksumAddress(ethAddress);

export const getWeb3 = () => {
  var web3 = new Web3(window.ethereum);
  return web3
}

export const isMetamask = () => {
  return (window.ethereum && window.ethereum.isMetaMask)
}

export const isConnected = () => {
  return window.isConnected()
}

export const handleAccountChange = (callback) => {
  if (!window || !window.ethereum) return
  window.ethereum.on('accountsChanged', (accounts) => {
    // Handle the new accounts, or lack thereof.
    // "accounts" will always be an array, but it can be empty.
    callback(accounts[0])
  });
}

export const handleChainChange = (callback) => {
  if (!window || !window.ethereum) return
  window.ethereum.on('chainChanged', (chainId) => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    chainId = parseInt(chainId, 16); // hex to int
    callback(chainId)
  });
}

export const getChainId = async (callback) => {
  try {
    if (!window || !window.ethereum) return
    let chainId = await window.ethereum.request({ method: 'eth_chainId' })
    if (callback) callback(chainId)
    return chainId
  } catch (err) {
    console.log('Failed to get chainId', err)
  }
}

export const getEthAddress = async () => {
  if (!window || !window.ethereum) return
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  let account = accounts[0]
  return checkSumAddress(account)
}

export const registerWallet = async () => {
  if (!isMetamask()) return

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  } catch (err) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log('Please connect to MetaMask.');
    } else {
      console.error(error);
    }
  }

  return await getEthAddress()
}

export const requestPermission = async () => {
  try {
    if (!window || !window.ethereum) return
    let permissions = await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    })

    const didGetPermission = permissions.find(
      (permission) => permission.parentCapability === 'eth_accounts'
    );
    return didGetPermission
  } catch (error) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log('Permissions needed to continue.');
    } else {
      console.error(error);
    }
  }
}

export const sendTransaction = async ({ from, to, gas, gasPrice, value, data }) => {
  try {
    if (!window || !window.ethereum) return
    let transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to ,
          data,
          gas: gas ? gas.toString(16): null,
          gasPrice: gasPrice ? gasPrice.toString(16) : null,
          value: value ? value.toString(16) : null
        },
      ],
    })
    return transactionHash
  } catch (err) {
    console.log(err)
  }
}

export const getSignedMessage = async (ethAddress, authMsg) => {
  try {
    if (!window || !window.ethereum) return
    authMsg.domain.chainId = parseInt(authMsg.domain.chainId)
    return await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [ethAddress, JSON.stringify(authMsg)],
    });
  } catch (err) {
    console.log("Failed getSignedMessage", err)
  }
}