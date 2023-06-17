export const newRide = async (
  signer,
  contract,
  origin,
  destination,
  departureTime,
  fare,
  seats
) => {
  try {
    const tx = await contract.createride(
      origin,
      destination,
      departureTime,
      fare,
      seats
    );
    await tx.wait();
  } catch (err) {
    console.error(err);
  }
};

export const searchRide = async (
  signer,
  contract,
  _origin,
  _destination,
  departureTime,
  _seats
) => {
  try {
    let rides = [];
    const rideCount = contract.rideCount();
    for (let i = 0; i < rideCount; i++) {
      let ride = await contract.rides(i);
      if (
        ride.origin === _origin &&
        ride.destination === _destination &&
        ride.seats >= _seats &&
        ride.departuretime <= departureTime
      ) {
        rides.push(ride);
      }
    }
    if (rides.length) {
      let optimalRide = 0;
      let lowestFare = 10000;
      for (let i = 0; i < rides.length; i++) {
        if (rides[i].fare <= lowestFare) {
          lowestFare = rides[i].fare;
          optimalRide = i;
        }
      }
      await contract.bookRide(optimalRide);
      return { id: optimalRide, fare: parseInt(lowestFare, 10) };
    }
    return rides;
  } catch (err) {
    console.error(err);
  }
};
