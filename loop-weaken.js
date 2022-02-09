/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0];
	var loopTime = ns.args[1];
	while(true){
		var weakenTime = ns.getWeakenTime(target);
		await ns.sleep(loopTime-weakenTime);
		weaken(target);
	}
}