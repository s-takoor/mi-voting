// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
  // Contract owner and voting status variables
  address public owner;
  bool public votingOpen;
  uint256 public votingEndTime;
  uint8 public totalRegisteredVoters;

  // Structs for voters, candidates, and files
  struct Voter {
    bool isRegistered;
    bool hasVoted;
    uint8 votedCandidateId;
    bool hasClaimedVote;
  }

  struct Candidate {
    string name;
    string party;
    uint256 voteCount;
    string ipfsHashReference;
  }

  struct File {
    string fileName;
    string ipfsHashCID;
  }

  // Arrays to store candidates and files
  File[] public files;

  mapping(address => Voter) public voters;
  Candidate[] public candidates;

  // Events to track important contract actions
  event CandidateAdded(uint8 indexed candidateId, string name, string party);
  event VoterRegistered(address indexed voter);
  event VoteCast(address indexed voter, uint8 candidateId);
  event VotingClosed();

  // Modifiers
  modifier onlyRegisteredVoter() {
    require(voters[msg.sender].isRegistered, "You are not registered as a voter");
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function");
    _;
  }

  modifier onlyRegisteredAndOpen() {
    require(voters[msg.sender].isRegistered, "You are not registered as a voter");
    require(votingOpen, "Voting is closed");
    _;
  }

  modifier votingIsOpen() {
    require(votingOpen, "Voting is closed");
    require(block.timestamp <= votingEndTime, "Voting has ended");
    _;
  }

  // Constructor to initialise contract and add initial candidates
  constructor(
    uint256 _durationInMinutes,
    string[] memory _candidateNames,
    string[] memory _candidateParties
  ) {
    owner = msg.sender;
    votingOpen = true;
    votingEndTime = block.timestamp + (_durationInMinutes * 1 minutes);

    // Ensure at least one candidate is provided during deployment
    require(_candidateNames.length > 0, "At least one candidate is required");

    // Add initial candidates during contract deployment
    for (uint8 i = 0; i < _candidateNames.length; i++) {
      candidates.push(Candidate({
        name: _candidateNames[i],
        party: _candidateParties[i],
        voteCount: 0,
        ipfsHashReference: ""
      }));
      emit CandidateAdded(i, _candidateNames[i], _candidateParties[i]);
    }
  }

  // Function to add a new candidate by the contract owner
  function addCandidate(string memory _name, string memory _party, string memory _ipfsHashReference) external onlyOwner {
    require(bytes(_name).length > 0, "Candidate name cannot be empty");
    require(bytes(_party).length > 0, "Candidate party cannot be empty");

    // Check if a candidate with the same name and party already exists
    for (uint8 i = 0; i < candidates.length; i++) {
      require(
        keccak256(abi.encodePacked(candidates[i].name, candidates[i].party)) !=
        keccak256(abi.encodePacked(_name, _party)),
        "Candidate with the same name and party already exists"
      );
    }

    // Add the new candidate
    candidates.push(Candidate({
      name: _name,
      party: _party,
      voteCount: 0,
      ipfsHashReference: _ipfsHashReference
    }));
    emit CandidateAdded(uint8(candidates.length - 1), _name, _party);
  }

  // Function to register voter
  function registerVoter(address _voterAddress) external {
    require(!voters[_voterAddress].isRegistered, "Voter is already registered");

    voters[msg.sender].isRegistered = true;
    totalRegisteredVoters++;

    emit VoterRegistered(msg.sender);
  }

  // Function to cast vote
  function castVote(uint8 candidateId) external onlyRegisteredVoter votingIsOpen {
    require(msg.sender != owner, "Owners are not allowed to vote");
    require(!voters[msg.sender].hasVoted, "You have already voted");
    require(candidateId < candidates.length, "Invalid candidate ID");

    voters[msg.sender].hasVoted = true;
    voters[msg.sender].votedCandidateId= candidateId;
    candidates[candidateId].voteCount++;

    emit VoteCast(msg.sender, candidateId);
  }

  // Function to close voting
  function closeVoting() external onlyOwner {
    require(votingOpen, "Voting is closed");
    votingOpen = false;
    emit VotingClosed();
  }

  // Function to get candidate count
  function getCandidateCount() external view returns (uint256) {
    return candidates.length;
  }

  // Function to get candidate details
  function getCandidateDetails(uint8 candidateId) external view returns (string memory, string memory, uint256, string memory) {
    require(candidateId < candidates.length, "Invalid candidate ID");
    Candidate memory candidate = candidates[candidateId];
    return (candidate.name, candidate.party, candidate.voteCount, candidate.ipfsHashReference);
  }

  // Function to set candidates, accessible only by owner
  function setCandidates(Candidate[] memory _candidates) external onlyOwner onlyRegisteredAndOpen {
    for (uint8 i = 0; i < _candidates.length; i++) {
      candidates.push(_candidates[i]);
      emit CandidateAdded(uint8(candidates.length - 1), _candidates[i].name, _candidates[i].party);
    }
  }

  // Function to set IPFS file data, accessible only by owner
  function setFiles(File[] memory _files) external onlyOwner {
    for (uint256 i = 0; i < _files.length; i++) {
      files.push(_files[i]);
    }
  }

  // Receive function to accept Ether
  receive() external payable {}

  // Fallback function to accept Ether
  fallback() external payable {}
}



