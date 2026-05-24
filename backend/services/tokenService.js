const { ethers } = require("ethers");

const tokenAbi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)",
];

const transferCCT = async (toAddress, rewardAmount) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.POLYGON_AMOY_RPC_URL
    );

    const wallet = new ethers.Wallet(
      process.env.BACKEND_WALLET_PRIVATE_KEY,
      provider
    );

    const tokenContract = new ethers.Contract(
      process.env.CCT_TOKEN_ADDRESS,
      tokenAbi,
      wallet
    );

    const decimals = await tokenContract.decimals();

    const amount = ethers.parseUnits(
      String(rewardAmount),
      decimals
    );

    const tx = await tokenContract.transfer(toAddress, amount);

    await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error("Token transfer failed:", error);
    throw new Error("CCT token transfer failed");
  }
};

module.exports = transferCCT;