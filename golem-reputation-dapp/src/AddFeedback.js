import React, { useState, useEffect } from 'react'; // import useEffect
import { reputationContract, web3 } from './ethereum';

function AddFeedback() {
    const [userAddress, setUserAddress] = useState('');
    const [score, setScore] = useState('');
    const [comment, setComment] = useState('');
    const [currentAccount, setCurrentAccount] = useState(null); // State to track the current account

    // Function to get the current account
    const getCurrentAccount = async () => {
        const accounts = await web3.eth.getAccounts(); // Get all accounts
        setCurrentAccount(accounts[0]); // Set the first account as the current account
    };

    useEffect(() => {
        getCurrentAccount(); // Get the current account when the component mounts

        // Listen for account changes
        window.ethereum.on('accountsChanged', function (accounts) {
            setCurrentAccount(accounts[0]); // Update the current account if the user changes it in MetaMask
        });
    }, []);

    const submitFeedback = async () => {
        try {
            await reputationContract.methods.addFeedback(userAddress, score, comment).send({ from: currentAccount });
            console.log('Feedback submitted successfully');
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div>
            <input type="text" value={userAddress} onChange={e => setUserAddress(e.target.value)} placeholder="User Address" />
            <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="Score (between 0 and 100)" />
            <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" />
            <button onClick={submitFeedback}>Submit Feedback</button>
        </div>
    );
}

export default AddFeedback;
