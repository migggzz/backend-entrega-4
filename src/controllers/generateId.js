
function generateID() {
    let counter = carts.length;
    if (counter ==0) {
        return 1;
    } else {
        return (carts[counter-1].id)+1;
    }
  }

  function generateId() {
    let counter = products.length;
    if (counter ==0) {
        return 1;
    } else {
        return (products[counter-1].id)+1;
    }
  }

  module.exports = generateID;
    module.exports = generateId;