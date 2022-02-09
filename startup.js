/** @param {NS} ns **/
import * as dist from "optimized-hack-manager.js";
import * as list from "list-of-rooted-servers.ns";

export async function main(ns) {
    ns.run('open-all-servers.js');
	await ns.sleep(4000);
	//ns.run('optimized-hack-master.ns',1,1);
	ns.run('xp-farmer.js',1,'foodnstuff');
	/*ns.run('server-fluffer.ns');
	var hosts = list.getServerList(ns, 'home');
	hosts.sort((a,b) => ns.getWeakenTime(b)-ns.getWeakenTime(a));
	await ns.sleep(ns.getWeakenTime(hosts[0])+1000);*/
	await ns.sleep(1000);
	ns.kill('xp-farmer.js','home','foodnstuff');
	await ns.sleep(ns.getWeakenTime('foodnstuff'));
	//ns.run('optimized-hack-master.ns',1,1);
	ns.run('xp-farmer.js',1,'joesguns');

	/*var foodSym = 'FNS';
	var shares = Math.min(Math.floor((ns.getServerMoneyAvailable('home')-100000)/ns.stock.getAskPrice(foodSym)),ns.stock.getMaxShares(foodSym));
	ns.stock.buy(foodSym,shares);
	var blob = await dist.refreshHostList(ns,'foodnstuff');
	var hosts = blob['hosts']
	var threadsAvailable = blob['threadsAvailable'];
	dist.distributeDelayedThreads(ns,Math.floor(threadsAvailable * (19/21)),'delay-stock-grow.script',hosts,'foodnstuff',0);
	dist.distributeThreads(ns,Math.ceil(threadsAvailable * (2/21)),'weaken.script',hosts,'foodnstuff');
	await ns.sleep(ns.getWeakenTime('foodnstuff'));

	await ns.sleep(200000);
	//ns.run('auto-purchase-server.ns');*/
	
}