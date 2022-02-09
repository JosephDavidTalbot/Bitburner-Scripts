/** @param {NS} ns **/
/*import { inputTerminalCommands } from "/gui/lib/terminal.js"
import * as contract from "coding-contract-manager.js";
import { testCases } from "/tests/largest-prime.js"*/


export async function main(ns) {
    ns.disableLog("ALL");
	/*var target = ns.args[0];
	var route = []
	var curr = target;

	while(curr!='home'){
		route.push(curr)
		var temp = ns.scan(curr);
		curr = temp[0];
	}
	var routeString = "connect " + route.reverse().join("; connect ")
	//ns.tprint("connect " + route.reverse().join("; connect "));
	ns.tprint(routeString);
	inputTerminalCommands(routeString.split('; '));*/
	ns.tail();
	//var solutions = [1, 1, 2, 3, 5, 7, 11, 15, 22, 30, 42, 56, 77, 101, 135, 176, 231, 297, 385, 490, 627, 792, 1002, 1255, 1575, 1958, 2436, 3010, 3718, 4565, 5604, 6842, 8349, 10143, 12310, 14883, 17977, 21637, 26015, 31185, 37338, 44583, 53174, 63261, 75175, 89134, 105558, 124754];

	//Ways To Sum
	/*for(var i = 0; i < solutions.length; i++){
		var testVal = contract.countSums(i,i-1)
		ns.print("Partitions of "+i+": "+testVal)
		if(testVal != solutions[i]-1){
			ns.print("Error: Incorrect. Answer should be "+(solutions[i]-1));
		}
	}*/
	/*var target = 'joesguns';
	var home = 'home';
	var before = ns.getServerMoneyAvailable(target)
	var weakenTime = ns.getWeakenTime(target);
	ns.print("Server has $"+before.toLocaleString()+" out of $"+ns.getServerMaxMoney(target));
	ns.print("Running grow() on three threads:");
	ns.exec('grow.script',home,3,target);
	await ns.weaken(target);
	var mid = ns.getServerMoneyAvailable(target);
	ns.print("Server has $"+mid.toLocaleString()+" out of $"+ns.getServerMaxMoney(target));
	ns.print("Grew "+(((mid/before)*100)-100)+"%.");
	ns.print("Running grow() three times on one thread each:");
	ns.exec('grow.script',home,1,target,'1');
	ns.exec('grow.script',home,1,target,'2');
	ns.exec('grow.script',home,1,target,'3');
	await ns.weaken(target);
	var after = ns.getServerMoneyAvailable(target);
	ns.print("Server has $"+after.toLocaleString()+" out of $"+ns.getServerMaxMoney(target));
	ns.print("Grew "+(((after/mid)*100)-100)+"%.");*/
	var i = 50;
	var chance = 0;
	while(chance < 1) {
		i++;
		chance = 7 * i + (ns.getPlayer().intelligence * 0.025);
		chance /= 975;
		chance /= 1;
		chance *= ns.getPlayer().crime_success_mult;
		chance *= 1 + (Math.pow(ns.getPlayer().intelligence, 0.8)) / 600;
		await ns.sleep(100)
	}

	ns.print("Successful Homicide at "+i+" combat stats!");
	
}