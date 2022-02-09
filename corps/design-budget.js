/** @param {NS} ns **/
export async function main(ns) {
	for(var i=0; i<20; i++){
		var budget = Math.pow(10,i);
		var desMult = 1 + Math.pow(budget, 0.1) / 100;
		ns.tprint("A budget of $"+budget.toLocaleString()+" will yield a design multiplier of "+desMult);
	}
}