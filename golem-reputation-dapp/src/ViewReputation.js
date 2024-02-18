import React, { useState } from "react";
import { reputationContract } from "./ethereum";

function ViewReputation() {
  const [userAddress, setUserAddress] = useState("");
  const [score, setScore] = useState(null); // Changed from '' to null for clarity
  const isValidAddress = (userAddress) =>
    /^0x[a-fA-F0-9]{40}$/.test(userAddress);

  const fetchReputation = async () => {
    if (!isValidAddress(userAddress)) {
      alert("Please enter a valid Ethereum address.");
      return;
    }
    try {
      const result = await reputationContract.methods
        .getReputation(userAddress)
        .call();
      // Logging the fetched score for debugging
      console.log(`Fetched reputation score:`, result);

      // Convert result to string for display
      const scoreStr = result.toString(); // Converts BigInt or BN to a string
      setScore(scoreStr); // Update state with string for React to render
    } catch (error) {
      console.error("Error fetching reputation score:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        placeholder="User Address"
      />
      <button onClick={fetchReputation}>Get Reputation Score</button>
      {score !== "" && <p>Reputation Score: {score}</p>}
    </div>
  );
}

export default ViewReputation;
