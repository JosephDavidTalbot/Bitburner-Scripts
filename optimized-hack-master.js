/** @param {NS} ns **/
import * as list from "list-of-rooted-servers.ns";
import * as best from "find-best-server.js"

export async function main(ns) {
    var weakenSecurity = .05;
	var hackSecurity = .002;
	var growSecurity = .004;

	var hosts = list.getServerList(ns, 'home');
	hosts = hosts.filter(host => list.getRoot(ns, host));
	var temp = ['home'];
	hosts = temp.concat(hosts);

	var target = best.bestServer(ns, ns.getHackingLevel());
	var targets = ns.args[0]

	for(var i=0; i<targets;i++){
		ns.run('optimized-hack-manager.js',1,target[i][0]);
	}
}