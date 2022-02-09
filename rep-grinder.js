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

	var hosts = list.getServerList(ns, 'home');
	hosts = hosts.filter(host => list.getRoot(ns, host));
	hosts.push('home');

	for(var i=0; i < hosts.length; i++){
		var host = hosts[i];
		await ns.scp('share.script','home',host);
		var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
		var threadRam = ns.getScriptRam('share.script',host);
		var hostThreads = Math.floor(hostRam/threadRam);
		if(hostThreads > 0){
			ns.exec('share.script',host,hostThreads);
		}
	}
}