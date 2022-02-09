/** @param {NS} ns **/
export async function main(ns) {
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
	ns.disableLog("commitCrime");
	ns.disableLog("getPlayer");
	
	var corpName = "RizzyCorp"

	//Step 1: Create Corporation.
	if(!ns.getPlayer().hasCorporation && ns.getPlayer().money < 150000000000){
		ns.print("No corporation. Waiting for $150 billion...")
	}
	while(!ns.getPlayer().hasCorporation) {
		if(ns.getPlayer().money > 150000000000){
			ns.corporation.createCorporation(corpName,true);
			ns.print("Created new corporation: "+corpName);
			ns.corporation.unlockUpgrade("Smart Supply");
		}
		await ns.sleep(10000);
	}

	//Step 2: Create software division.
	var corpInfo = ns.corporation.getCorporation();
	var divisions = []
	for(var i = 0; i < corpInfo.divisions.length; i++) {
		divisions.push(corpInfo.divisions[i].type)
	}
	if(divisions.indexOf("Software") == -1){
		ns.corporation.expandIndustry("Software","RizzySoft");
	}

	//Step 3: Setup

	for(var i = 0; i < corpInfo.divisions.length; i++) {
		
	}
}