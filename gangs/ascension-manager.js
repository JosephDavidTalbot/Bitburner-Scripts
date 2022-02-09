/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
	ns.disableLog("gang.purchaseEquipment");
	const equipment = ns.gang.getEquipmentNames().sort((a,b) => ns.gang.getEquipmentCost(a) - ns.gang.getEquipmentCost(b));

    if(!ns.gang.inGang()){
		ns.tprint("You're not in a gang. Try again.");
	} else {
		while(true){
			var members = ns.gang.getMemberNames()
			if(ns.gang.canRecruitMember()){
				var newMemberName = "#"+(members.length+1)
				ns.gang.recruitMember(newMemberName);
				ns.gang.setMemberTask(newMemberName, 'Traffick Illegal Arms');
			}
			members = ns.gang.getMemberNames()

			for(var i=0; i<members.length; i++) {
				//if(ns.gang.getMemberInformation(members[i]).str_asc_mult >= 50 && ns.gang.getMemberInformation(members[i]).task == 'Terrorism') {
				if(ns.gang.getMemberInformation(members[i]).str_asc_mult >= 40) {
					if(ns.gang.getGangInformation().territory < 100 && ns.gang.getGangInformation().territoryWarfareEngaged == false && ns.gang.getMemberInformation("#"+(i+1)).task != "Territory Warfare") {
						ns.gang.setMemberTask(('#'+(i+1)), 'Territory Warfare');
					} else if(ns.gang.getGangInformation().territoryWarfareEngaged && ns.gang.getMemberInformation("#"+(i+1)).task == "Territory Warfare") {
						ns.gang.setMemberTask(('#'+(i+1)), 'Traffick Illegal Arms');
					}
				}
				/*if(ns.gang.getAscensionResult(members[i]).str >= (1.5 * ns.gang.getMemberInformation(members[i]).str_asc_mult)){
					ns.gang.ascendMember(members[i]);
				}*/
				var memberInfo = ns.gang.getMemberInformation(members[i]);
				
				let currentExperience = ns.gang.getMemberInformation(members[i]).str_exp;
				let currentAscensionPool = ns.gang.getMemberInformation(members[i]).str_asc_points;
				let nextAscensionPool = currentAscensionPool + currentExperience - 1000;

				let currentExpIncome = 15.77 * (1 + Math.sqrt(currentAscensionPool / 32000));
				let nextExpIncome = 15.77 * (1 + Math.sqrt(nextAscensionPool / 32000));
				let incomeDelta = nextExpIncome - currentExpIncome;

				// We ascend if recovering from the EXP "loss" on ascension (not converted to pool) would take less time than we've spent so far in this ascension.
				// This loss is 1000 per stat. We're only considering one stat, so it's 1000.
				let cyclesToRecover = 1000 / incomeDelta;

				// Calculate how long we've been training since last ascension.
				let cyclesSinceLastAscension = memberInfo.hack_exp / currentExpIncome;

				if (cyclesSinceLastAscension > cyclesToRecover) {
					ns.gang.ascendMember(members[i]);
					/*for(var j=0; j<equipment.length; j++){
						ns.gang.purchaseEquipment(members[i],equipment[j]);
					}*/
					/*if(ns.getServerMoneyAvailable("home") > 1000000000) {
						/*ns.exec("/gangs/equip-all.js","home");
						ns.exec("/gangs/rootkit-all.js","home");
						await ns.sleep(100);*/
						/*for(var j=0; j<equipment.length; j++){
							ns.gang.purchaseEquipment(members[i],equipment[j]);
						}
					}*/
				}
			}
			if(ns.getServerMoneyAvailable("home") > 1000000000000 || ns.gang.getGangInformation().territoryWarfareEngaged) {
				for(var i=0; i<equipment.length; i++){
					for(var j=0; j<members.length; j++){
						ns.gang.purchaseEquipment(members[j],equipment[i]);
					}
				}
			}

			await ns.sleep(100);

			var power = ns.gang.getGangInformation().power
			var rivalNames = ["Slum Snakes","Speakers for the Dead","The Black Hand","The Dark Army","The Syndicate","NiteSec","Tetrads"]
			var rivals = ns.gang.getOtherGangInformation();
			var maxRival = 0;
			for(var k=0; k<rivalNames.length; k++){
				if(rivals[rivalNames[k]].power > maxRival && rivals[rivalNames[k]].territory > 0 && rivalNames[k] != ns.gang.getGangInformation().faction){
					maxRival = rivals[rivalNames[k]].power
				}
			}
			//ns.print("Ratio: "+(power/maxRival));
			if(power >= (maxRival * 4) && ns.gang.getGangInformation().territoryWarfareEngaged == false) {
				ns.gang.setTerritoryWarfare(true);
			}
		}
	}
}