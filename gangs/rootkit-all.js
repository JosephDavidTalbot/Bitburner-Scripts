/** @param {NS} ns **/
export async function main(ns) {
    const names = ns.gang.getMemberNames();
	const equipment = ns.gang.getEquipmentNames().filter(aug => ns.gang.getEquipmentType(aug) == "Rootkit").sort((a,b) => ns.gang.getEquipmentCost(a) - ns.gang.getEquipmentCost(b));
	

	/*for(var j=0;j<equipment.length;j++){
		ns.tprint(equipment[j]+": "+ns.gang.getEquipmentType(equipment[j]));
	}*/
	for(var i=0; i<equipment.length; i++){
    	for(var j=0; j<names.length; j++){
			ns.gang.purchaseEquipment(names[j],equipment[i]);
		}
	}
}