/**
 * @param {NS} ns
 **/
export async function main(ns) {
  const doc = eval('document');
  const hook0 = doc.getElementById('overview-extra-hook-0');
  const hook1 = doc.getElementById('overview-extra-hook-1');
  hook0.innerText = "karma";
  while(true) {
    await ns.sleep(1000);
    hook1.innerText = ns.heart.break();
  }
}