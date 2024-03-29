import { Web3 } from 'web3';
import ReputationABI from './abis/Reputation.json'

// Contract ABI and address
const CONTRACT_ABI = ReputationABI.abi;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

let web3;
let reputationContract;

// Initialize Web3 and create a contract instance
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    reputationContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
} else {
    console.error('MetaMask is not installed!');
}

export { web3, reputationContract };
