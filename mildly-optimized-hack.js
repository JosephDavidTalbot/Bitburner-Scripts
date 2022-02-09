/** @param {NS} ns **/
import * as list from "list-of-rooted-servers.ns";

const weakenSecurity = .05;
const growSecurity = .004;
const hackSecurity = .002;

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

	var target = ns.args[0];

	while(true){
		var tempblob = await refreshHostList(ns,target)
		var hosts = tempblob['hosts'];
		var maxThreads = tempblob['maxThreads'];
		var threadsAvailable = tempblob['threadsAvailable'];
		var maxThreadsAvailable = tempblob['maxThreadsAvailable'];
		if(ns.getServerSecurityLevel(target) > (ns.getServerMinSecurityLevel(target))){
			await weakenTarget(ns,target,hosts);
		} else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)){
			await growTarget(ns,target,hosts,threadsAvailable);
		} else {
			var growThreads = Math.min(Math.ceil(ns.growthAnalyze(target, 1 / (0.9))),maxThreads);
			var hackThreads = Math.floor(ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * .1));
			//hack(target, {threads: hackThreads});
			
			await hackTarget(ns,target,hosts,hackThreads);
			//await weakenTarget(ns,target,hosts);
			await growTarget(ns,target,hosts,growThreads);
		}
	}
}

function waitMessage (waitTime){
	var minutes = Math.floor(waitTime/60000);
	var seconds = (waitTime - (Math.floor(waitTime/60000)*60000))/1000;
	var message = "Sleeping for "+minutes+" minutes and "+seconds+" seconds.";
	return message;
}

function naturalTime (waitTime){
	var minutes = Math.floor(waitTime/60000);
	var seconds = (waitTime - (Math.floor(waitTime/60000)*60000))/1000;
	var message = minutes+" minutes and "+seconds+" seconds";
	return message;
}

function distributeThreads(ns, threads, script, hosts, target) {
	ns.print("Distributing "+script+" on "+threads+" threads.");
	var growthRate = 1;
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
			growthRate *= ns.formulas.hacking.growPercent(ns.getServer(target),hostThreads,ns.getPlayer());
		} else {
			ns.exec(script,host,threads,target);
			growthRate *= ns.formulas.hacking.growPercent(ns.getServer(target),threads,ns.getPlayer());
			return growthRate;
		}
	}
	return growthRate;
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
	var growTime = ns.getGrowTime(target);
	var weakenTime = ns.getWeakenTime(target);
	ns.print("**Target has $"+ns.getServerMoneyAvailable(target).toLocaleString()+", and a maximum of $"+ns.getServerMaxMoney(target).toLocaleString());
	ns.print("**Growing...")
	ns.print("(Total threads available: "+maxThreadsAvailable+")");
	let growDiff = (ns.getServerMoneyAvailable(target)/ns.getServerMaxMoney(target));
	let growThreads = Math.min(Math.ceil(ns.growthAnalyze(target, (1/growDiff))),maxThreadsAvailable);
	var weakenGrow = (Math.ceil(growThreads * growSecurity / weakenSecurity)+1);
	if(growThreads == 0){
		growThreads = 1;
	}
	if(weakenGrow == 0){
		weakenGrow = 1;
	}
	//distributeThreads(ns, growThreads, 'grow.script', hosts, target);
	distributeThreads(ns, weakenGrow, 'weaken.script', hosts, target);
	var growthRate = distributeThreads(ns, growThreads, 'grow.script', hosts, target);
	var growRatio = ns.getServerMaxMoney(target)/ns.getServerMoneyAvailable(target);
	var cyclesToFull = Math.ceil(Math.log(growRatio)/Math.log(growthRate));
	var timeToFull = cyclesToFull * weakenTime;
	ns.print("Growing "+((growthRate * 100)-100)+"% this cycle.");
	ns.print("Will be at full cash in "+cyclesToFull+" cycles, or "+naturalTime(timeToFull)+" at current rates.");
	ns.print(waitMessage(weakenTime+1000));
	await ns.sleep(weakenTime+1000);
	return;
}

async function hackTarget(ns, target, hosts, hackThreads) {
	var hackTime = ns.getHackTime(target);
	var weakenTime = ns.getWeakenTime(target);
	var weakenHack = (Math.ceil(hackThreads * hackSecurity / weakenSecurity)+1);
	ns.print("**Target has $"+ns.getServerMoneyAvailable(target).toLocaleString()+", and a maximum of $"+ns.getServerMaxMoney(target).toLocaleString());
	ns.print("**Hacking...")
	if(hackThreads == 0){
		hackThreads = 1;
	}
	if(weakenHack == 0){
		weakenHack = 1;
	}
	distributeThreads(ns, hackThreads, 'hack.script', hosts, target);
	distributeThreads(ns, weakenHack, 'weaken.script', hosts, target);
	ns.print(waitMessage(weakenTime+1000));
	await ns.sleep(weakenTime+1000);
	return;
}

export async function refreshHostList(ns,target) {
	var hosts = list.getServerList(ns, 'home');
	hosts = hosts.filter(host => list.getRoot(ns, host));
	hosts.push('home');
	var maxThreads = 0;
	var threadsAvailable = 0;
	var maxThreadsAvailable = 0;
	var hackSpace = false;
	var growSpace = false;
	var growThreads = Math.ceil(ns.growthAnalyze(target, (1 / 0.9)))*2;
	var hackThreads = Math.max(Math.floor(ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * .1)),1);
	for(var i=0; i < hosts.length; i++){
		var host = hosts[i];
		await ns.scp('weaken.script', 'home', host);
		await ns.scp('hack.script', 'home', host);
		await ns.scp('grow.script', 'home', host);

		await ns.scp('delay-weaken.script', 'home', host);
		await ns.scp('delay-hack.script', 'home', host);
		await ns.scp('delay-grow.script', 'home', host);

		await ns.scp('delay-stock-grow.script', 'home', host);
		await ns.scp('stock-grow.script', 'home', host);
		var host = hosts[i];
		var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
		var threadRam = ns.getScriptRam('weaken.script',host);
		var hostThreads = Math.floor(hostRam/threadRam);
		threadsAvailable += hostThreads;
		if(!growSpace && hostThreads >= hackThreads){
			growSpace = true;
			hostThreads -= growThreads;
		}
		if(!hackSpace && hostThreads >= hackThreads){
			hackSpace = true;
			hostThreads -= hackThreads;
		}
		if(hostThreads > maxThreadsAvailable){
			maxThreadsAvailable = hostThreads;
		}
		maxThreads += Math.floor(ns.getServerMaxRam(host) / ns.getScriptRam('weaken.script',host));
	}
	return {'hosts': hosts, 'maxThreads': maxThreads, 'threadsAvailable': threadsAvailable, 'maxThreadsAvailable': maxThreadsAvailable, 'hackSpace': hackSpace, 'growSpace': growSpace};
}