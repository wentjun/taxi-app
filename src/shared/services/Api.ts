const getTaxiList = (taxiCount: string) => {
  return fetch(`https://qa-interview-test.qa.splytech.io/api/drivers?latitude=51.5049375&longitude=-0.0964509&count=${taxiCount}`)
    .then(response => response.json());
};

export {
  getTaxiList
};
