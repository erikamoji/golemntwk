require("dotenv").config();
const { Web3 } = require("web3");

const ReputationABI = require("./Reputation.json");

const web3 = new Web3.providers.WebsocketProvider(
  process.env.WEB3_PROVIDER_URL
);

const CONTRACT_ABI = ReputationABI;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const reputationContract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
);

// Function to calculate the new reputation score
async function calculateNewScore(userAddress) {
  let totalScore = 0;
  try {
    const feedbacks = await reputationContract.methods
      .getFeedbacks(userAddress)
      .call();
    feedbacks.forEach((feedback) => {
      totalScore += parseInt(feedback.score);
    });
    return feedbacks.length > 0 ? Math.round(totalScore / feedbacks.length) : 0; // Avoid division by zero
  } catch (error) {
    console.error("Error fetching feedback:", error);
  }
}

// Function to update the reputation score on-chain
async function updateReputationScore(userAddress, newScore) {
  const adminAccount = web3.eth.accounts.privateKeyToAccount(
    process.env.ADMIN_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(adminAccount);

  const data = reputationContract.methods
    .setReputation(userAddress, newScore)
    .encodeABI();
  const transactionParameters = {
    to: CONTRACT_ADDRESS,
    from: adminAccount.address,
    data,
    gas: web3.utils.toHex(200000),
    gasPrice: web3.utils.toHex(web3.utils.toWei("30", "gwei")),
  };

  try {
    const receipt = await web3.eth.sendTransaction(transactionParameters);
    console.log(
      `Reputation score updated for ${userAddress}: ${receipt.transactionHash}`
    );
  } catch (error) {
    console.error(
      `Failed to update reputation score for ${userAddress}: ${error}`
    );
  }
}

// Event listener for new feedback
reputationContract.events.FeedbackAdded(
  {
    fromBlock: "latest",
  },
  async function (error, event) {
    if (error) {
      console.error("Error on event", error);
      return;
    }

    const { user } = event.returnValues;
    console.log(`New feedback for user: ${user}`);

    // Calculate and update reputation score
    const newScore = await calculateNewScore(user);
    if (newScore !== null) {
      // Ensure score calculation was successful
      await updateReputationScore(user, newScore);
    }
  }
);
