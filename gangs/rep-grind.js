/** @param {NS} ns **/
export async function main(ns) {
    const names = ns.gang.getMemberNames();
	for(var i=0; i<names.length; i++){
    	ns.gang.setMemberTask(names[i], 'Terrorism');
	}
}