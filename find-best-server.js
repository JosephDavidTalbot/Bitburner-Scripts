/** @param {NS} ns **/
import * as list from "list-of-rooted-servers.ns";
export async function main(ns) {
	let servers = bestServer(ns, ns.getHackingLevel());
    for(var i=0; i<ns.args[0]; i++){
		ns.tprint(servers[i]);
	}
}

export function bestServer(ns, hackLevel){
	var weakenSecurity = .05;
	var hackSecurity = .002;
	var growSecurity = .004;
	var serverName = list.getServerList(ns, 'home');
	//var serverName = [/*"home",*/"n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","harakiri-sushi","iron-gym","darkweb","rizzy-server-0","rizzy-server-1","rizzy-server-2","rizzy-server-3","rizzy-server-3-0","rizzy-server-3-1","rizzy-server-3-2","rizzy-server-3-3","rizzy-server-3-4","rizzy-server-3-5","rizzy-server-3-6","rizzy-server-3-7","rizzy-server-3-8","rizzy-server-3-9","rizzy-server-3-10","rizzy-server-15","rizzy-server-15-0","rizzy-server-15-1","rizzy-server-15-2","rizzy-server-15-3","rizzy-server-15-4","rizzy-server-15-5","rizzy-server-15-6","rizzy-server-15-7","rizzy-server-15-8","zer0","max-hardware","CSEC","nectar-net","omega-net","neo-net","silver-helix","phantasy","comptek","the-hub","netlink","crush-fitness","johnson-ortho","avmnite-02h","summit-uni","I.I.I.I","catalyst","rothman-uni","zb-institute","syscore","lexo-corp","alpha-ent","rho-construction","aevum-police","millenium-fitness","galactic-cyber","aerocorp","snap-fitness","global-pharm","unitalife","omnia","deltaone","defcomm","icarus","zeus-med","univ-energy","solaris","zb-def","nova-med","taiyang-digital","infocomm","titan-labs","run4theh111z","microdyne","applied-energetics","helios","vitalife","fulcrumtech","stormtech","omnitek","kuai-gong",".","4sigma","b-and-a","powerhouse-fitness","nwo","blade","clarkinc","ecorp","megacorp","fulcrumassets","The-Cave"];
	//serverName = serverName.filter(list.getRoot, ns);
	serverName = serverName.filter(name => list.getRoot(ns, name));
	var maxThreads = 0;
	for(var i = 0; i < serverName.length; i++){
		var host = serverName[i];
		var hostRam = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
		var threadRam = ns.getScriptRam('weaken.script',host);
		maxThreads += Math.floor(hostRam/threadRam) 
	}

	var serversProfit = []

	for(var i = 0; i < serverName.length; i++){
		if(ns.getServerRequiredHackingLevel(serverName[i]) < hackLevel){
			var target = serverName[i];
			//serversProfit.push(ns.getServerMaxMoney(serverName[i])); //Original; considers only max money.
			var weakenTime = ns.getWeakenTime(serverName[i]);
			var growThreads = Math.ceil(ns.growthAnalyze(target, (1 / 0.9)))*2;
			var hackThreads = Math.max(Math.floor(ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * .1)),1);
			var weakenGrow = (Math.ceil(growThreads * growSecurity / weakenSecurity)+1)*2;
			var weakenHack = (Math.ceil(hackThreads * hackSecurity / weakenSecurity)+1)*2;
			var totalThreads = growThreads+hackThreads+weakenGrow+weakenHack;
			var cycleTime = Math.max(((weakenTime+300)/(Math.min(Math.floor(maxThreads/totalThreads),1))),400)
			//var money = ns.hackAnalyzeChance(serverName[i]) * ns.hackAnalyze(serverName[i]) * ns.getServerMaxMoney(serverName[i]);
			var money = ns.hackAnalyzeChance(serverName[i]) * ns.getServerMaxMoney(serverName[i]);
			var profit = (money) / cycleTime;
			var hackProb = ns.hackAnalyzeChance(serverName[i])
			serversProfit.push([serverName[i],profit,hackProb]);
		} else {
			serversProfit.push(0);
		}
	}
	/*var max = serversProfit[0];
	var maxIndex = 0;*/

	/*for (var i = 1; i < serversProfit.length; i++) {
		if (serversProfit[i] > max) {
			maxIndex = i;
			max = serversProfit[i];
		}
	}*/
	serversProfit.sort((a,b) => b[1]-a[1]);
	return serversProfit;
}