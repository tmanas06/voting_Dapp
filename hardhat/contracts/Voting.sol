// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 numberOfVotes;
    }

    Candidate[] public Candidates;
    address public owner;
    mapping(address => bool) public voters;
    address[] public ListOfvoters;
    uint256 public votingStart;
    uint256 public votingEnd;
    bool public electionStarted;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not authorized");
        _;
    }

    modifier electionOngoing() {
        require(electionStarted, "Election not started");
        _;
    }

    event ElectionStarted(uint256 start, uint256 end);

    constructor() {
        owner = msg.sender;
    }

    function startElection(string[] memory _candidates, uint256 _votingDuration) public onlyOwner {
        require(!electionStarted, "Election started");

        delete Candidates;

        for (uint256 i = 0; i < _candidates.length; i++) {
            Candidates.push(Candidate(i, _candidates[i], 0));
        }

        electionStarted = true;
        votingStart = block.timestamp;
        votingEnd = votingStart + (_votingDuration * 1 minutes);

        emit ElectionStarted(votingStart, votingEnd);
    }

    function addCandidate(string memory _name) public onlyOwner electionOngoing {
        Candidates.push(Candidate({id: Candidates.length, name: _name, numberOfVotes: 0}));
    }

    function voterStatus(address _voter) public view electionOngoing returns (bool) {
        return voters[_voter];
    }

    function voteTo(uint256 _id) public electionOngoing {
        require(voterStatus(msg.sender), "Already voted");
        Candidates[_id].numberOfVotes++;
        voters[msg.sender] = true;
        ListOfvoters.push(msg.sender);
    }

    function retrieveVotes() public view returns (Candidate[] memory) {
        return Candidates;
    }

    function electionTime() public view returns (uint256) {
        return (votingEnd > block.timestamp) ? votingEnd - block.timestamp : 0;
    }

    function checkElectionPeriod() public returns (bool) {
        if (electionTime() > 0) {
            return true;
        }
        electionStarted = false;
        return false;
    }

    function resetAllVoterStatus() public onlyOwner {
        for (uint256 i = 0; i < ListOfvoters.length; i++) {
            voters[ListOfvoters[i]] = false;
        }
        delete ListOfvoters;
    }
}
