// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockVote {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    address public admin;
    bool public isElectionActive;

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint256 public candidatesCount;

    event VotedEvent(uint256 indexed candidateId, address voter);
    event ElectionStateChanged(bool isActive);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        isElectionActive = false;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function setElectionState(bool _isActive) public onlyAdmin {
        isElectionActive = _isActive;
        emit ElectionStateChanged(_isActive);
    }

    function vote(uint256 _candidateId) public {
        require(isElectionActive, "Election is not currently active");
        require(!hasVoted[msg.sender], "Voter has already cast their ballot");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate selection");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VotedEvent(_candidateId, msg.sender);
    }

    function getCandidateVoteCount(uint256 _candidateId) public view returns (uint256) {
        return candidates[_candidateId].voteCount;
    }
}
