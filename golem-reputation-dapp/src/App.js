import React from 'react';
import './App.css';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import AddFeedback from './AddFeedback'; // Assuming you've created this component
import ViewReputation from './ViewReputation'; // Assuming you've created this component

function App() {
    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    const web3 = new Web3(window.ethereum);
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setWeb3(web3);
                    setAccounts(accounts);
                } catch (error) {
                    console.error("Could not connect to wallet:", error);
                }
            } else {
                alert('Please install MetaMask!');
            }
        };
        init();
    }, []);

    return (
        <div className="App">
            <main>
                {web3 && accounts.length > 0 ? (
                    <div>
                        <AddFeedback web3={web3} accounts={accounts} />
                        <ViewReputation web3={web3} />
                    </div>
                ) : (
                    <p>Please connect to MetaMask.</p>
                )}
            </main>
        </div>
    );
}

export default App;
