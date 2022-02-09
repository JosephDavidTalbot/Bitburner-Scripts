/** @param {NS} ns **/
import * as list from "list-of-rooted-servers.ns";

export async function main(ns) {
    var servers = list.getServerList(ns, 'home');
	var tools = 0;
	if(ns.fileExists("BruteSSH.exe", "home")){
		tools+=1;
	}
	if(ns.fileExists("FTPCrack.exe", "home")){
		tools+=1;
	}
	if(ns.fileExists("relaySMTP.exe", "home")){
		tools+=1;
	}
	if(ns.fileExists("HTTPWorm.exe", "home")){
		tools+=1;
	}
	if(ns.fileExists("SQLInject.exe", "home")){
		tools+=1;
	}
	
	for(var i = 0; i < servers.length; i++){
		var serverName = servers[i];
		if(!ns.hasRootAccess(serverName) && ns.getServerNumPortsRequired(serverName) <= tools){
			if(ns.fileExists("BruteSSH.exe", "home")){
				ns.brutessh(serverName);
			}
			if(ns.fileExists("FTPCrack.exe", "home")){
				ns.ftpcrack(serverName);
			}
			if(ns.fileExists("relaySMTP.exe", "home")){
				ns.relaysmtp(serverName);
			}
			if(ns.fileExists("HTTPWorm.exe", "home")){
				ns.httpworm(serverName);
			}
			if(ns.fileExists("SQLInject.exe", "home")){
				ns.sqlinject(serverName);
			}
			ns.nuke(serverName);
		}
		
		if(ns.hasRootAccess(serverName) && ns.args[0] != undefined) {
			ns.connect(serverName);
			await ns.installBackdoor();
			ns.connect('home');
		}
	}
}