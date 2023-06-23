// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Pizza {
    struct Memo {
        string name;
        string pizzaType;   // Type of pizza
        uint256 pizzaCount; // Number of pizzas
        string pizzaSize;
        uint256 timestamp;
        address from;
    }

    Memo[] memos;
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyPizza(
    string memory name,
    string memory pizzaType,
    uint256 pizzaCount,
    string memory pizzaSize
) public payable {
    uint256 totalCost = calculateTotalCost(pizzaCount, pizzaSize);
    require(msg.value >= totalCost , "Invalid payment amount");

    owner.transfer(totalCost);
    memos.push(
        Memo(
            name,
            pizzaType,
            pizzaCount,
            pizzaSize,
            block.timestamp,
            msg.sender
        )
    );
     if (msg.value > totalCost) {
        payable(msg.sender).transfer(msg.value - totalCost);
        }
}

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function calculateTotalCost(uint256 pizzaCount, string memory pizzaSize)
        private
        pure
        returns (uint256)
    {
        uint256 costPerPizza;

        if (compareStrings(pizzaSize, "Small")) {
            costPerPizza = 0.10 ether; // Assume small pizza costs 10 units
        } else if (compareStrings(pizzaSize, "Medium")) {
            costPerPizza = 0.15 ether; // Assume medium pizza costs 15 units
        } else if (compareStrings(pizzaSize, "Large")) {
            costPerPizza = 0.20 ether; // Assume large pizza costs 20 units
        }

        return costPerPizza * pizzaCount;
    }

    function compareStrings(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
