/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0];
	var loopTime = ns.args[1];
	while(true){
		var growTime = ns.getGrowTime(target);
		await ns.sleep(loopTime-growTime);
		grow(target);
	}
}