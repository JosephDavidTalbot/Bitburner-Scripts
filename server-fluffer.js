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
	ns.disableLog("getServerRequiredHackingLevel");
	ns.disableLog("getHackingLevel");

    var weakenSecurity = .05;
	var growSecurity = .004;
	var maxTime = 0;

	var hosts = list.getServerList(ns, 'home');
	hosts = hosts.filter(host => list.getRoot(ns, host));
	hosts.sort((a,b) => ns.getWeakenTime(a) - ns.getWeakenTime(b));

	var t = 0;
	var target = hosts[t];

	var maxThreads = 0;

	for(var i=0; i < hosts.length; i++){
		var serverName = hosts[i];
		await ns.scp('weaken.script', 'home', serverName);
		await ns.scp('hack.script', 'home', serverName);
		await ns.scp('grow.script', 'home', serverName);
		maxThreads += Math.floor(ns.getServerMaxRam(serverName) / ns.getScriptRam('weaken.script',serverName));
	}

	while(t < hosts.length){
		target = hosts[t];
		var threadsAvailable = 0;
		for(var i=0; i < hosts.length; i++){
			var host = hosts[i];
			var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
			var threadRam = ns.getScriptRam('weaken.script',host);
			var hostThreads = Math.floor(hostRam/threadRam);
			threadsAvailable += hostThreads;
		}
		if(ns.getServerRequiredHackingLevel(target) < ns.getHackingLevel()){
			var weakenTime = ns.getWeakenTime(target);
			var growTime = ns.getGrowTime(target);
			var threadsAvailable = 0;
			for(var i=0; i < hosts.length; i++){
				var host = hosts[i];
				var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
				var threadRam = ns.getScriptRam('weaken.script',host);
				var hostThreads = Math.floor(hostRam/threadRam);
				threadsAvailable += hostThreads;
			}
			if(ns.getServerSecurityLevel(target) > (ns.getServerMinSecurityLevel(target) + 0.001)){
				ns.tprint(target);
				ns.print("**Weakening...")
				let weakenThreads = Math.min(Math.ceil((ns.getServerSecurityLevel(target)-ns.getServerMinSecurityLevel(target))/weakenSecurity),maxThreads);
				var deployed = false
				while(!deployed){
					threadsAvailable = 0;
					for(var i=0; i < hosts.length; i++){
						var host = hosts[i];
						var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
						var threadRam = ns.getScriptRam('weaken.script',host);
						var hostThreads = Math.floor(hostRam/threadRam);
						threadsAvailable += hostThreads;
					}
					if(weakenThreads <= threadsAvailable){
						if(ns.getWeakenTime(target) > maxTime){
							maxTime = ns.getWeakenTime(target);
						}
						await distributeDelayedThreads(ns, weakenThreads, 'weaken.script', hosts, target, 0);
						deployed = true;
						t++;
						await ns.sleep(1000);
					} else {
						await ns.sleep(10000);
					}
				}
			} else {
				t++;
			}
		} else {
			t++;
		}

		
		
		hosts = list.getServerList(ns, 'home');
		hosts = hosts.filter(host => list.getRoot(ns, host));
		hosts.push('home');
		for(var i=0; i < hosts.length; i++){
			var serverName = hosts[i];
			await ns.scp('weaken.script', 'home', serverName);
			await ns.scp('grow.script', 'home', serverName);
			
			await ns.scp('delay-weaken.script', 'home', serverName);
			await ns.scp('delay-grow.script', 'home', serverName);
			maxThreads += Math.floor(ns.getServerMaxRam(serverName) / ns.getScriptRam('weaken.script',serverName));
		}
	}
	ns.tprint(waitMessage(maxTime))
}

function waitMessage (waitTime){
	var minutes = Math.floor(waitTime/60000);
	var seconds = (waitTime - (Math.floor(waitTime/60000)*60000))/1000;
	var message = "Sleeping for "+minutes+" minutes and "+seconds+" seconds.";
	return message;
}

async function distributeDelayedThreads(ns, threads, script, hosts, target, delay) {
	ns.print("Distributing "+script+" on "+threads+" threads.");
	var deployed = false;
	while(!deployed){
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
			} else if(threads < hostThreads){
				ns.exec(script,host,threads,target,delay,Date.now());
				deployed = true;
				return;
			}
		}
		await ns.sleep(1000);
	}
}