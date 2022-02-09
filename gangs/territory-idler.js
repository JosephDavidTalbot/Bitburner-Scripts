/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
	while(true){
		if(ns.gang.getGangInformation().territory == 100) {
			ns.tprint("Territory war won! Time to make money hand-over-fist!");
			spawn("gangs/cash-grind.js");
		}
		await ns.sleep(10000);
	}
}