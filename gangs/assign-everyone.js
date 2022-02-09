/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("disableLog");
	ns.disableLog("sleep");

    if(!ns.gang.inGang()){
		ns.tprint("You're not in a gang. Try again.");
	} else if(ns.args[0] != undefined) {
		/*ns.tprint("Well that didn't work.");*/
		ns.tprint("Args[0] was: "+ns.args[0]);
		var members = ns.gang.getMemberNames();
		for(var i=0; i<members.length; i++) {
			ns.gang.setMemberTask(members[i], ns.gang.getTaskNames()[ns.args[0]]);
		}
		ns.tprint("All assigned!");
	} else {
		ns.tprint("Please input a task number.");
		//var tasks = ns.gang.getTaskNames();
		var tasks = ns.gang.getTaskNames();
		tasks.forEach(task => ns.tprint("Task #"+tasks.indexOf(task)+": "+task));
		/*for(var x=0; x=tasks.length; x++) {
			ns.tprint("Task "+x+": "+tasks[x]);
		}*//*
		ns.tail();
		ns.print("Please input a task number.");
		var tasks = ns.gang.getTaskNames();
		ns.print(tasks);
		tasks.forEach(task => ns.print("Task #"+tasks.indexOf(task)+": "+task));*/
	}
}