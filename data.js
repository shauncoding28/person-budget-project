let envelopes = [{ id: 1, name: "Honey", amount: 30 }, { id: 2, name: "Jam", amount: 20 }]; //global variable - add envelopes as needed
let nextId = 3;


let totalBudget = envelopes.reduce((total, env) => {
    total += env.amount;
    return total;
}, 0);

module.exports = { envelopes, nextId, totalBudget };