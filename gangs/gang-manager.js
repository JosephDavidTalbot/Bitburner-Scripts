/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("sleep");
    if(!ns.gang.inGang()){
		ns.tprint("You're not in a gang. Try again.");
	} else {
		while(true){
			var members = ns.gang.getMemberNames()
			if(ns.gang.canRecruitMember()){
				var newMemberName = "#"+(members.length+1)
				ns.gang.recruitMember(newMemberName);
				ns.gang.setMemberTask(newMemberName, 'Terrorism');
			}
			members = ns.gang.getMemberNames()
			var wantedIncreasing = ns.gang.wantedLevelGainRate > 0;

			//var tasks = ns.gang.getTaskNames()
			var muggers = [];
			var terrorists = [];
			var vigilantes = [];
			for(var i=0; i<members.length; i++) {
				ns.print("Gang member "+members[i]+": "+ns.gang.getMemberInformation(members[i]).task);
				switch (ns.gang.getMemberInformation(members[i]).task) {
					case 'Mug People':
					case 'Strongarm Civilians':
						muggers.push(members[i]);
						break;
					case 'Terrorism':
						terrorists.push(members[i]);
						break;
					case 'Vigilante Justice':
						vigilantes.push(members[i]);
				}
			}

			var memberAllocated = false;

			for(var i=0; i<muggers.length; i++){
				var info = ns.gang.getMemberInformation(muggers[i]);
				if(wantedIncreasing && ns.gang.wantedLevelGainRate > 5 && !memberAllocated){
					ns.gang.setMemberTask(terrorists[i], 'Vigilante Justice');
					memberAllocated = true;
				}
			}
			
			for(var i=0; i<terrorists.length; i++){
				var info = ns.gang.getMemberInformation(terrorists[i]);
				var wantedThreshold = info.wantedLevelGain > 0.001
				//var statSum = info.hack + info.dex + info.def + info.str + info.cha;
				//
				//if(statSum > 630){
				if(wantedThreshold){
					ns.gang.setMemberTask(terrorists[i], 'Mug People');
					ns.gang.purchaseEquipment(terrorists[i], 'Baseball Bat');
					ns.gang.purchaseEquipment(terrorists[i], 'Katana');
					ns.gang.purchaseEquipment(terrorists[i], 'Bulletproof Vest');
				}
			}
			
			for(var i=0; i<vigilantes.length; i++){
				var info = ns.gang.getMemberInformation(vigilantes[i]);
				if(!wantedIncreasing && ns.gang.wantedLevelGainRate < 2  && !memberAllocated){
					ns.gang.setMemberTask(vigilantes[i], 'Strongarm Civilians');
					memberAllocated = true;
				}
			}
			await ns.sleep(100);
		}
	}
}