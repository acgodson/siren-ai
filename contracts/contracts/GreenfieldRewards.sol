// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenfieldRewards is Ownable(msg.sender) {
    IERC20 public rewardToken;
    uint256 public lastCounter;
    uint256 public constant BASE_REWARD_POINTS = 5;
    uint256 public currentWeek;

    struct UserInfo {
        mapping(uint256 => uint256) weeklyPoints;
        mapping(uint256 => uint256) weeklyRewards;
        mapping(uint256 => bool) claimed;
    }

    struct WeekInfo {
        uint256 totalPoints;
        uint256 totalRewards;
        bool rewardsDistributed;
    }

    mapping(address => UserInfo) private userInfo;
    mapping(uint256 => WeekInfo) public weekInfo;

    event PointsAssigned(address indexed user, uint256 week, uint256 points);
    event RewardsClaimed(address indexed user, uint256 week, uint256 amount);
    event RewardsDistributed(uint256 week, uint256 totalRewards);

    constructor(IERC20 _rewardToken) {
        rewardToken = _rewardToken;
        currentWeek = 1;
    }

    function assignPoints(address user) external onlyOwner {
        UserInfo storage userInf = userInfo[user];
        WeekInfo storage weekInf = weekInfo[currentWeek];

        userInf.weeklyPoints[currentWeek] += BASE_REWARD_POINTS;
        weekInf.totalPoints += BASE_REWARD_POINTS;
        lastCounter++;

        emit PointsAssigned(user, currentWeek, BASE_REWARD_POINTS);
    }

    function distributeRewards(uint256 week) external onlyOwner {
        require(week <= currentWeek, "Cannot distribute future rewards");
        require(
            !weekInfo[week].rewardsDistributed,
            "Rewards already distributed for this week"
        );

        uint256 rewardsToDistribute = rewardToken.balanceOf(address(this)) -
            getTotalUnclaimedRewards();
        require(rewardsToDistribute > 0, "No rewards to distribute");

        weekInfo[week].totalRewards = rewardsToDistribute;
        weekInfo[week].rewardsDistributed = true;

        emit RewardsDistributed(week, rewardsToDistribute);
    }

    function claimRewards(uint256 week) external {
        require(week <= currentWeek, "Cannot claim future rewards");
        require(
            weekInfo[week].rewardsDistributed,
            "Rewards not yet distributed for this week"
        );
        require(
            !userInfo[msg.sender].claimed[week],
            "Rewards already claimed for this week"
        );

        uint256 userPoints = userInfo[msg.sender].weeklyPoints[week];
        require(userPoints > 0, "No points earned this week");

        uint256 userRewards = (userPoints * weekInfo[week].totalRewards) /
            weekInfo[week].totalPoints;
        userInfo[msg.sender].weeklyRewards[week] = userRewards;
        userInfo[msg.sender].claimed[week] = true;

        require(
            rewardToken.transfer(msg.sender, userRewards),
            "Reward transfer failed"
        );

        emit RewardsClaimed(msg.sender, week, userRewards);
    }

    function advanceWeek() external onlyOwner {
        currentWeek++;
    }

    function getUserStats(address user, uint256 week)
        external
        view
        returns (
            uint256 points,
            uint256 rewards,
            bool claimed
        )
    {
        UserInfo storage userInf = userInfo[user];
        return (
            userInf.weeklyPoints[week],
            userInf.weeklyRewards[week],
            userInf.claimed[week]
        );
    }

    function getWeekStats(uint256 week)
        external
        view
        returns (
            uint256 totalPoints,
            uint256 totalRewards,
            bool rewardsDistributed
        )
    {
        WeekInfo storage weekInf = weekInfo[week];
        return (
            weekInf.totalPoints,
            weekInf.totalRewards,
            weekInf.rewardsDistributed
        );
    }

    function getTotalUnclaimedRewards() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 1; i <= currentWeek; i++) {
            if (weekInfo[i].rewardsDistributed) {
                total += weekInfo[i].totalRewards;
            }
        }
        return total;
    }

    function getUniqueObjectName() external view returns (string memory) {
        return string(abi.encodePacked("siren_", uint2str(lastCounter)));
    }

    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        str = string(bstr);
    }
}
