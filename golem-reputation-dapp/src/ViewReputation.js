import React, { useState } from 'react';
import { reputationContract } from './ethereum';

function ViewReputation() {
    const [userAddress, setUserAddress] = useState('');
    const [score, setScore] = useState('');

    const fetchReputation = async () => {
        try {
            const result = await reputationContract.methods.getReputation(userAddress).call();
            setScore(result);
        } catch (error) {
            console.error('Error fetching reputation score:', error);
        }
    };

    return (
        <div>
            <input type="text" value={userAddress} onChange={e => setUserAddress(e.target.value)} placeholder="User Address" />
            <button onClick={fetchReputation}>Get Reputation Score</button>
            {score && <p>Reputation Score: {score}</p>}
        </div>
    );
}

export default ViewReputation;
