const { v4: uuidv4 } = require('uuid');

const randomWeight = (weight = 0, unit='kg') => {
  return { unit,
  quantity: weight || Math.ceil(Math.random()*10) }
}

const getTruckWeight = (parcels) => {
  let truckWeight = 0;
  parcels.forEach(element => {
    truckWeight += element.weight.quantity;
  });
  return truckWeight;
}

const generateParcels = ({count = 10, weight = 0}) => {
  const parcels = [];
  for (let i = 0; i < count; i++) {
    parcels.push({
      id: uuidv4(),
      weight: randomWeight(weight),
    });
  }
  return parcels;
};

const formatWeight = (weight, unit = 'kg') => {
  return {quantity: weight, unit};
}

module.exports = {
  randomWeight,
  getTruckWeight,
  generateParcels,
  formatWeight
}