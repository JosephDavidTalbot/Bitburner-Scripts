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
	
	ns.tail()
	/*if(ns.args[0] == null){
		ns.tprint("Please input how many minutes you wish to run this for.");
	} else {*/
		var timeComplete = new Date()
		timeComplete.setSeconds(timeComplete.getSeconds()+(ns.heart.break()+54000));
		ns.print("Estimated completion time: "+timeComplete);
		var preKarma = ns.heart.break();
		//var timer = ns.args[0] * 60 * 1000;
		while(/*timer > 0 && */ns.heart.break() > -54000){
			if(!ns.isBusy()){
				ns.commitCrime("Homicide");
				//ns.print("Time to completion: "+naturalTime(ns.heart.break()+54000));
			}
			await ns.sleep(100);
			//timer -= 100;
		}
		var postKarma = ns.heart.break();
		ns.print("Pre Karma: "+preKarma+". Post Karma: "+postKarma);
		ns.print("Gathered "+(preKarma-postKarma)+" bad karma over "+(ns.args[0])+" minutes.");
		ns.print("Karma rate: "+((preKarma-postKarma)/ns.args[0])+" per minute.")
		ns.print("Minutes to Gang threshold: "+((54000+postKarma)/((preKarma-postKarma)/ns.args[0])));
	//}
}

function naturalTime (waitTime){
	var hours = Math.floor(waitTime/3600);
	waitTime %= 3600;
	var minutes = Math.floor(waitTime/60);
	waitTime %= 60;
	//var seconds = Math.round(waitTime - (Math.floor(waitTime/60)*60));
	var seconds = waitTime;
	var message = hours+" hours, "+minutes+" minutes, and "+seconds+" seconds";
	return message;
}