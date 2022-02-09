/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0];
	var loopTime = ns.args[1];
	while(true){
		var hackTime = ns.getHackTime(target);
		await ns.sleep(loopTime-hackTime);
		hack(target);
	}
}