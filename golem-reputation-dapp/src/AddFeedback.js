import React, { useState } from 'react';
import { reputationContract } from './ethereum';

function AddFeedback() {
    const [userAddress, setUserAddress] = useState('');
    const [score, setScore] = useState('');
    const [comment, setComment] = useState('');

    const submitFeedback = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0]; // Use the first account

            await reputationContract.methods.addFeedback(userAddress, score, comment).send({ from: account });
            console.log('Feedback submitted successfully');
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div>
            <input type="text" value={userAddress} onChange={e => setUserAddress(e.target.value)} placeholder="User Address" />
            <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="Score" />
            <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" />
            <button onClick={submitFeedback}>Submit Feedback</button>
        </div>
    );
}

export default AddFeedback;
