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
	const stats = ['strength','defense','dexterity','agility']

	ns.tail()
	/*if(ns.args[0] == null){
		ns.tprint("Please input your stat goal.");
	} else {
		var threshold = ns.args[0];
		for(var i = 0; i < stats.length; i++){
			var player = ns.getPlayer();
			ns.gymWorkout('Powerhouse Gym',stats[i]);
			while(player[stats[i]] < threshold){
				await ns.sleep(100);
			}
		}
		ns.stopAction();
		ns.spawn('singularity/auto-mug.js',1);
	}*/

	
	var highStat = 0;
	for(var i = 0; i < stats.length; i++){
		var player = ns.getPlayer();
		if(player[stats[i]] > highStat){
			highStat = player[stats[i]];
		}
	}
	while(ns.getCrimeChance("Homicide") < 1.0){
		for(var i = 0; i < stats.length; i++){
			var player = ns.getPlayer();
			var goal = player[stats[i]] + 1
			ns.gymWorkout('Powerhouse Gym',stats[i]);
			while(ns.getPlayer()[stats[i]] < highStat && ns.getPlayer()[stats[i]] < goal){
				await ns.sleep(100);
			}
		}
		if(player.strength == player.defense && player.defense == player.dexterity && player.dexterity == player.agility) {
			highStat++;
		}
	}
	ns.stopAction();
	ns.spawn('singularity/auto-mug.js',1);
}