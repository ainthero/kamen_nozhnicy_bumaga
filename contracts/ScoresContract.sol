// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./KNBContract.sol";

contract ScoresContract {
    KNBContract public knbContract;

    mapping(address => uint) public scoresCount;

    constructor(address _knbContractAddress) {
        knbContract = KNBContract(_knbContractAddress);
    }

    function updateScores(address player1, address player2) external {
        address winner = knbContract.determineWinner(player1, player2);
        if(winner != address(0)) {
            scoresCount[winner]++;
        }
    }

    function getScore(address player) public view returns (uint) {
        return scoresCount[player];
    }
}
