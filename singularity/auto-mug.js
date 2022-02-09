/** @param {NS} ns **/
export async function main(ns) {
	/*if(ns.args[0] == null){
		ns.tprint("Please input how many minutes you wish to run this for.");
	} else {
		var timer = ns.args[0] * 60 * 1000;
		while(timer > 0){
			if(!ns.isBusy()){
				ns.commitCrime("Mug someone");
			}
			await ns.sleep(100);
			timer -= 100;
		}
	}*/
	ns.disableLog("disableLog");
	ns.disableLog("scan");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("exec");
	ns.disableLog("scp");
	ns.disableLog("sleep");
	
	ns.tail()
	while(true){
		if(ns.getCrimeChance("Homicide") > 0.9){
			var preKarma = ns.heart.break();
			var postKarma = -54000;
			var timer = Math.ceil((preKarma-postKarma)/60);
			ns.print("Ready for Murder");
			ns.spawn("/singularity/auto-homicide.js",1,timer)
		} else if(!ns.isBusy()){
			ns.print((ns.getCrimeChance("Homicide")*100)+"% chance of murder.");
			ns.commitCrime("Mug someone");
		}
		await ns.sleep(100);
	}
}