require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const hre = require("hardhat");
const ipfsAPI = require("ipfs-api");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ipfs = ipfsAPI(process.env.IPFS_HOST, process.env.IPFS_PORT, { protocol: 'http' });

  const durationInMinutes = 15;
  const candidateNames = ["Superman", "Spider-Man", "Wonder Woman"];
  const candidateParties = ["Justice Party", "Web Slingers Party", "Amazon Warriors Party"];

  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy(durationInMinutes, candidateNames, candidateParties);

  console.log("VotingContract deployed to:", votingContract.address);

  const directoryPath = "public/ipfsData";
  const filesToUpload = ["contract_metadata.json", "election_guidelines.txt", "event_logs.txt"];

  const uploadedFiles = [];
  for (const fileName of filesToUpload) {
    const filePath = path.join(directoryPath, fileName);
    const fileContent = fs.readFileSync(filePath);
    const ipfsHash = await ipfs.add(Buffer.from(fileContent));
    uploadedFiles.push({
      fileName: fileName,
      ipfsHashCID: ipfsHash[0].hash
    });

    console.log(`File ${fileName} uploaded with IPFS hash: ${ipfsHash[0].hash}`);
  }

  await votingContract.setFiles(uploadedFiles);
  console.log("Files IPFS CID hashes stored in VotingContract.");
}

main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
