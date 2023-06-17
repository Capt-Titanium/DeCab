// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract deCab {
    struct ride {
        uint rideId;
        string origin;
        string destination;
        uint departuretime;
        uint fare;
        uint seats;
    }

    mapping(uint => address) public rideowner;
    mapping(uint => mapping(uint => address)) public rideToRider;
    uint8 public ridecount = 0;
    ride[] public rideList;
    event rideCreated(
        uint rideId,
        string origin,
        string destination,
        uint departuretime,
        uint fare,
        uint seats
    );
    event rideBooked(uint rideId, uint seats, address passenger);

    function createride(
        string memory _origin,
        string memory _destination,
        uint _departuretime,
        uint8 _fare,
        uint8 _seats
    ) public {
        rideList.push(
            ride(
                ridecount,
                _origin,
                _destination,
                _departuretime,
                _fare,
                _seats
            )
        );
        rideowner[ridecount] = msg.sender;
        emit rideCreated(
            ridecount,
            _origin,
            _destination,
            _departuretime,
            _fare,
            _seats
        );
        ridecount++;
    }

    function bookRide(uint rideId) public {
        rideToRider[rideId][rideList[rideId].seats] = msg.sender;
        rideList[rideId].seats -= 1;
        emit rideBooked(rideId, rideList[rideId].seats, msg.sender);
    }
}
