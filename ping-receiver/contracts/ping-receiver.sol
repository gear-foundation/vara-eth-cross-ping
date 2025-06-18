// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMessageQueueReceiver {
    function processVaraMessage(bytes32 sender, bytes calldata payload) external returns (bool);
}

contract PingReceiver is IMessageQueueReceiver {
    event PongEmitted(bytes32 sender);

    function processVaraMessage(bytes32 sender, bytes calldata) external override returns (bool) {
        emit PongEmitted(sender);
        return true;
    }
}