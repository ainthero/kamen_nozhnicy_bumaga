// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KNBContract {
    enum Choice { None, Rock, Paper, Scissors }

    struct Player {
        bytes32 hashedChoice;
        Choice choice;
    }

    address public host;
    mapping(address => Player) public players;

    event PlayerCommitted(address player);
    event PlayerRevealed(address player, Choice choice);
    event GameResult(string result, address winner);

    constructor() {
        host = msg.sender;
    }

    modifier onlyHost {
        require(msg.sender == host, "Only the host can perform this action");
        _;
    }

    modifier onlyPlayers {
        require(msg.sender != host, "Only a player can perform this action");
        _;
    }

    function commitChoice(bytes32 _hashedChoice) external onlyPlayers {
        players[msg.sender].hashedChoice = _hashedChoice;
        players[msg.sender].choice = Choice.None;
        
        emit PlayerCommitted(msg.sender);
    }

    function revealChoice(Choice _choice, bytes32 _salt) external onlyPlayers {
        require(_choice != Choice.None, "You should make a valid choice");
        require(keccak256(abi.encodePacked(_choice, _salt)) == players[msg.sender].hashedChoice, "The revealed choice does not match with the committed one");
        
        players[msg.sender].choice = _choice;

        emit PlayerRevealed(msg.sender, _choice);
    }

    function determineWinner(address player1, address player2) external onlyHost {
        require(players[player1].choice != Choice.None && players[player2].choice != Choice.None, "Both players should have revealed their choices");

        if (players[player1].choice == players[player2].choice) {
            emit GameResult("It's a draw", address(0));
        } else if ((players[player1].choice == Choice.Rock && players[player2].choice == Choice.Scissors) || 
                   (players[player1].choice == Choice.Paper && players[player2].choice == Choice.Rock) || 
                   (players[player1].choice == Choice.Scissors && players[player2].choice == Choice.Paper)) {
            emit GameResult("Player1 wins", player1);
        } else {
            emit GameResult("Player2 wins", player2);
        }
    }
}
