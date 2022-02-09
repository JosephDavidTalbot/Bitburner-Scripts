/** @param {NS} ns **/
import * as list from "list-of-rooted-servers.ns";

export async function main(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("scan");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");
	ns.disableLog("exec");
	ns.disableLog("scp");
	ns.disableLog("sleep");
	
	//var target = 'n00dles';
	var target = ns.args[0];

	var hosts = list.getServerList(ns, 'home');
	hosts = hosts.filter(host => list.getRoot(ns, host));
	hosts = hosts.filter(host => ns.getServerUsedRam(host) == 0);
	/*var temp = ['home'];
	hosts = hosts.concat(temp);*/
	hosts.push('home');

	var maxThreads = 0;

	for(var i=0; i < hosts.length; i++){
		var serverName = hosts[i];
		await ns.scp('weaken.script', 'home', serverName);
		maxThreads += Math.floor(ns.getServerMaxRam(serverName) / ns.getScriptRam('weaken.script',serverName));
	}

	while(true){
		var weakenTime = ns.getWeakenTime(target);
		var growTime = ns.getGrowTime(target);
		/*if(!ns.gang.inGang()){
			if(ns.getServerSecurityLevel(target) > (ns.getServerMinSecurityLevel(target))){
				await weakenTarget(ns,target,hosts);
			} else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)){
				//await growTarget(ns,target,hosts,maxThreadsAvailable);
				await growTarget(ns,target,hosts,maxThreads);
			} else {
				while(true){
					ns.print("**Growing At Maximum...")
					let growThreads = maxThreads;
					distributeThreads(ns, growThreads, 'grow.script', hosts, target);
					var waitTime = Math.min(growTime+10000, growTime*2);
					ns.print(waitMessage(waitTime));
					await ns.sleep(waitTime);

					hosts = list.getServerList(ns, 'home');
					hosts = hosts.filter(host => list.getRoot(ns, host));
					hosts = hosts.filter(host => ns.getServerUsedRam(host) == 0);
					hosts.push('home');
					maxThreads = 0
					for(var i=0; i < hosts.length; i++){
						var serverName = hosts[i];
						await ns.scp('weaken.script', 'home', serverName);
						await ns.scp('grow.script', 'home', serverName);
						maxThreads += Math.floor(ns.getServerMaxRam(serverName) / ns.getScriptRam('grow.script',serverName));
					}
				}
			}
		} else {*/
			while(true){
				ns.print("**Weakening At Minimum...")
				weakenTime = ns.getWeakenTime(target);
				let weakenThreads = maxThreads;
				distributeThreads(ns, weakenThreads, 'weaken.script', hosts, target);
				var waitTime = Math.min(weakenTime+10000, weakenTime*2);
				//ns.print(waitMessage(waitTime));
				//await ns.sleep(waitTime);
				ns.print(waitMessage(waitTime));
				await ns.sleep(waitTime);

				hosts = list.getServerList(ns, 'home');
				hosts = hosts.filter(host => list.getRoot(ns, host));
				hosts = hosts.filter(host => ns.getServerUsedRam(host) == 0);
				hosts.push('home');
				maxThreads = 0
				for(var i=0; i < hosts.length; i++){
					var serverName = hosts[i];
					await ns.scp('weaken.script', 'home', serverName);
					await ns.scp('grow.script', 'home', serverName);
					maxThreads += Math.floor(ns.getServerMaxRam(serverName) / ns.getScriptRam('grow.script',serverName));
				}
			}
		//}
	}
}

function distributeThreads(ns, threads, script, hosts, target) {
	ns.print("Distributing "+script+" on "+threads+" threads.");
	for(var i=0; i < hosts.length; i++){
		var host = hosts[i];
		var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
		var threadRam = ns.getScriptRam(script,host);
		var hostThreads = Math.floor(hostRam/threadRam);
		if(hostThreads == 0) {
			continue;
		} else if(threads > hostThreads){
			threads -= hostThreads;
			ns.exec(script,host,hostThreads,target);
		} else {
			ns.exec(script,host,threads,target);
			return;
		}
	}
}

function waitMessage (waitTime){
	var minutes = Math.floor(waitTime/60000);
	var seconds = (waitTime - (Math.floor(waitTime/60000)*60000))/1000;
	var message = "Sleeping for "+minutes+" minutes and "+seconds+" seconds.";
	return message;
}

async function weakenTarget(ns, target, hosts) {
	var weakenSecurity = .05;
	var weakenTime = ns.getWeakenTime(target);
	ns.print("**Target has "+ns.getServerSecurityLevel(target)+" security, and a minimum of "+ns.getServerMinSecurityLevel(target));
	ns.print("**Weakening...")
	let weakenThreads = Math.max(Math.ceil((ns.getServerSecurityLevel(target)-ns.getServerMinSecurityLevel(target))/weakenSecurity),1);
	distributeThreads(ns, weakenThreads, 'weaken.script', hosts, target);
	var waitTime = weakenTime+1000;
	ns.print(waitMessage(waitTime));
	await ns.sleep(waitTime);
	return;
}

async function growTarget(ns, target, hosts, maxThreadsAvailable) {
	var weakenSecurity = .05;
	var growSecurity = .004;
	var weakenTime = ns.getWeakenTime(target);
	ns.print("**Target has $"+ns.getServerMoneyAvailable(target).toLocaleString()+", and a maximum of $"+ns.getServerMaxMoney(target).toLocaleString());
	ns.print("**Growing...")
	let growDiff = (ns.getServerMoneyAvailable(target)/ns.getServerMaxMoney(target));
	let growThreads = Math.min(Math.max(Math.ceil(ns.growthAnalyze(target, (1/growDiff))),1),maxThreadsAvailable);
	var weakenGrow = Math.max(Math.ceil(growThreads * growSecurity / weakenSecurity),1)*2;
	distributeThreads(ns, weakenGrow, 'weaken.script', hosts, target);
	if(growThreads == 0){
		growThreads = 1;
	}
	distributeThreads(ns, growThreads, 'grow.script', hosts, target);
	ns.print(waitMessage(weakenTime+1000));
	await ns.sleep(weakenTime+1000);
	return;
}