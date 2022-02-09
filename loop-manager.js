/** @param {NS} ns **/
import * as list from "list-of-rooted-servers.ns";

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

    var weakenSecurity = .05;
	var hackSecurity = .002;
	var growSecurity = .004;

	var target = ns.args[0];

	var weakenTime = ns.getWeakenTime(target);
	var hackTime = ns.getHackTime(target);
	var growTime = ns.getGrowTime(target);

	/*ns.print("Weaken time: "+weakenTime);
	ns.print("Grow time: "+growTime);
	ns.print("Hack time: "+hackTime);*/
	ns.print("**Target has $"+ns.getServerMoneyAvailable(target).toLocaleString()+", and a maximum of $"+ns.getServerMaxMoney(target).toLocaleString());
	ns.print("**Target has "+ns.getServerSecurityLevel(target)+" security, and a minimum of "+ns.getServerMinSecurityLevel(target));

	while(true){
		weakenTime = ns.getWeakenTime(target);
		hackTime = ns.getHackTime(target);
		growTime = ns.getGrowTime(target);
		var tempblob = await refreshHostList(ns,target)
		var hosts = tempblob['hosts'];
		var maxThreads = tempblob['maxThreads'];
		var threadsAvailable = tempblob['threadsAvailable'];
		var maxThreadsAvailable = tempblob['maxThreadsAvailable'];
		if(ns.getServerSecurityLevel(target) > (ns.getServerMinSecurityLevel(target))){
			await weakenTarget(ns,target,hosts);

		} else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)){
			//await growTarget(ns,target,hosts,maxThreadsAvailable);
			await growTarget(ns,target,hosts,maxThreads);

		} else {
			while(true){
				weakenTime = ns.getWeakenTime(target);
				hackTime = ns.getHackTime(target);
				growTime = ns.getGrowTime(target);
				var cycleTime = weakenTime+300;
				var cycleOffset = weakenTime-100;
				var growThreads = Math.ceil(ns.growthAnalyze(target, (1 / 0.9)));
				var hackThreads = Math.max(Math.floor(ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * .1)),1);
				/*var hackThreads = 1;
				var hackPercent = ns.hackAnalyze(target);
				var growThreads = Math.ceil(ns.growthAnalyze(target, (1 / (1-hackPercent))));*/
				tempblob = await refreshHostList(ns,target)
				hosts = tempblob['hosts'];
				var hackSpace = tempblob['hackSpace'];
				var growSpace = tempblob['growSpace'];
				var maxThreads = tempblob['maxThreads'];
				threadsAvailable = tempblob['threadsAvailable'];
				maxThreadsAvailable = tempblob['maxThreadsAvailable'];
				ns.print("\n**Hacking...\n")
				var weakenGrow = (Math.ceil(growThreads * growSecurity / weakenSecurity)+1)*2;
				var weakenHack = (Math.ceil(hackThreads * hackSecurity / weakenSecurity)+1)*2;
				var totalThreads = growThreads+hackThreads+weakenGrow+weakenHack;
				var deployed = false;
				//var delay = Math.max(((cycleTime)/5),400);
				var delay = 500;
				var delayTime = 0;
				var reported = false;
				while(!deployed){
					var sec = ns.getServerSecurityLevel(target) < (ns.getServerMinSecurityLevel(target)+0.001);
					var mon = ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target);
					if(threadsAvailable > totalThreads && /*hackSpace &&*/ growSpace && sec && mon){
						deployed = true;
						ns.print("**Target has $"+ns.getServerMoneyAvailable(target).toLocaleString()+", and a maximum of $"+ns.getServerMaxMoney(target).toLocaleString());
						distributeDelayedThreads(ns, growThreads, 'delay-grow.script', hosts, target, ((cycleOffset+200)-growTime));
						distributeDelayedThreads(ns, hackThreads, 'delay-hack.script', hosts, target, (cycleOffset-hackTime));
						distributeThreads(ns, weakenHack, 'weaken.script', hosts, target);
						distributeDelayedThreads(ns, weakenGrow, 'delay-weaken.script', hosts, target, 200);
						
						ns.print("Batch Distributed.");
						ns.print("Cycle time of "+cycleTime+"ms.")
						ns.print("Delay of "+delay+"ms.");
						await ns.sleep(delay);
					}
					delayTime += 50;
					await ns.sleep(50);
					if(delayTime >= delay+400){
						delayTime -= 400;
						if(!reported){
							if(!(threadsAvailable > totalThreads)){
								ns.print("Not Enough Threads Available");
								ns.print("Required Threads: "+totalThreads);
								ns.print("Available Threads: "+threadsAvailable);

							}
							/*if(!hackSpace){
								ns.print("Not Enough Hack Space.");
							}*/
							if(!growSpace){
								ns.print("Not Enough Grow Space");
							}
							if(!sec){
								ns.print("Security: "+ns.getServerSecurityLevel(target));
								ns.print("Security Minimum: "+ns.getServerMinSecurityLevel(target));
							}
							if(!mon){
								ns.print("Money Available: $"+ns.getServerMoneyAvailable(target).toLocaleString());
								ns.print("Money Maximum: $"+ns.getServerMaxMoney(target).toLocaleString());
							}
							reported = true;
						}
						if(!sec){
							await weakenTarget(ns,target,hosts);
							deployed = true;
						} else if(!mon) {
							await growTarget(ns,target,hosts,maxThreads);
							deployed = true;
						}
					}
				}
			}
		}
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

function distributeLoopThreads(ns, threads, script, hosts, target, loopTime) {
	ns.print("Distributing "+script+" on "+threads+" threads.");
	for(var i=0; i < hosts.length; i++){
		var host = hosts[i];
		var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
		var threadRam = ns.getScriptRam(script,host);
		var hostThreads = Math.floor(hostRam/threadRam);
		if(hostThreads == 0) {
			continue;
		} else if(threads > hostThreads && script!="loop-grow.script"){
			threads -= hostThreads;
			ns.exec(script,host,hostThreads,target,loopTime,Date.now());
		} else {
			ns.exec(script,host,threads,target,loopTime,Date.now());
			return// true;
		}
	}
	return// false;
}

export function distributeDelayedThreads(ns, threads, script, hosts, target, delay) {
	ns.print("Distributing "+script+" on "+threads+" threads.");
	for(var i=0; i < hosts.length; i++){
		var host = hosts[i];
		var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
		var threadRam = ns.getScriptRam(script,host);
		var hostThreads = Math.floor(hostRam/threadRam);
		if(hostThreads == 0) {
			continue;
		} else if(threads > hostThreads && script!="delay-grow.script"){
			threads -= hostThreads;
			ns.exec(script,host,hostThreads,target,delay,Date.now());
		} else {
			ns.exec(script,host,threads,target,delay,Date.now());
			return// true;
		}
	}
	return// false;
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
	distributeDelayedThreads(ns, growThreads, 'grow.script', hosts, target, 0);
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