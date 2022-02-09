/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("disableLog");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
	ns.disableLog("scp");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("purchaseServer");
	ns.disableLog("deleteServer");
	ns.disableLog("killall");
    var servers = ns.getPurchasedServers();
	var startingRam = 0;
	for (var r=3; r<21; r++) {
		var ram = Math.pow(2,r);
		if(ns.getServerMoneyAvailable("home") > (ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit())){
			startingRam = r;
		}
	}
	if(startingRam < 1) {
		ns.tprint("ERROR: Not enough money. Need $"+(ns.getPurchasedServerLimit()*ns.getPurchasedServerCost(2)).toLocaleString());
	}
	/*var totalRam = Math.pow(2,21)-1;
	var totalCost = totalRam * 55000 * ns.getPurchasedServerLimit();
	ns.print("The process overall will cost you $"+totalCost.toLocaleString());*/
	ns.print("There are "+ns.getPurchasedServers().length+" servers.");
	for(var r=startingRam; r<21; r++){
		var ram = Math.pow(2,r);
		var i = ns.getPurchasedServers().length;
		ns.print("There are "+i+" servers.");
		if((i+1) < ns.getPurchasedServerLimit()){
			ns.print("A server with "+Math.pow(2,r)+"GB of RAM will cost $"+ns.getPurchasedServerCost(ram).toLocaleString())
			ns.print(ns.getPurchasedServerLimit()+" servers with "+ram+"GB RAM will cost $"+(ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit()).toLocaleString())
			while(i < ns.getPurchasedServerLimit()) {
				if(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)){
					var hostname = "rizzy-server-"+i;
					ns.purchaseServer("rizzy-server-"+i,ram);
					await ns.scp('hack.script', 'home', hostname);
					await ns.scp('weaken.script', 'home', hostname);
					await ns.scp('grow.script', 'home', hostname);

					await ns.scp('delay-hack.script', 'home', hostname);
					await ns.scp('delay-weaken.script', 'home', hostname);
					await ns.scp('delay-grow.script', 'home', hostname);
					i++;
				}
				await ns.sleep(100);
			}
			//ns.print("Upgrade finished.");
		} else if(ns.getServerMaxRam(ns.getPurchasedServers()[0]) < ram) {
			await ns.sleep(1000);
			ns.print("Current Server RAM: "+ns.getServerMaxRam(ns.getPurchasedServers()[0])+"(2^"+(Math.log2(ns.getServerMaxRam(ns.getPurchasedServers()[0])))+")GB. New Server RAM: "+ram+"(2^"+r+")GB.");
			ns.print("Will cost $"+(ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit()).toLocaleString());
			var upgraded = false;
			i = 0;
			while(!upgraded){
				if(ns.getServerMoneyAvailable("home") > (ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit())){
					ns.print("Upgrade starting...");
					servers = ns.getPurchasedServers();
					for(i=0; i<servers.length;i++){
						//ns.deleteServer('rizzy-server-'+i);
						ns.killall(servers[i]);
						//ns.print("Successfully deleted "+servers[i]+": "+ns.deleteServer(servers[i]));
						ns.deleteServer(servers[i])
						await ns.sleep(100);
					}
					//ns.print(ns.getPurchasedServers());
					//if(ns.getPurchasedServers().length == 0){
					for(i=0;i<ns.getPurchasedServerLimit();i++){
						var hostname = "rizzy-server-"+i;
						ns.purchaseServer("rizzy-server-"+i,ram);
					}
					upgraded = true;
					ns.print("Upgrade finished.");
					//}
				} else {
					await ns.sleep(10000);
				}
			}
		}
	}
}