"use strict";

class MaxHitStats {
  constructor() {
    this.skill = "";
    this.damage = 0;
  }
}

class Combatant {
  constructor(combatant, encounter, loopIter) {
    this.parseData = combatant;
    this.name = (combatant.name === 'YOU') ? yourName : combatant.name;
    this.rank = loopIter + 1;

    let dpsNum = parseInt(combatant.encdps).toFixed();
    this.dps = isNaN(dpsNum) ? 0 : dpsNum;
    this.icon = '<img src="images/job-icons/' + jobOrName(combatant) + '.png" onerror="$(this).attr("src", "images/icons/error.png");">';
    this.role = (combatant.Job ? classes[combatant.Job] : "");
    this.crit = (this.dps ? combatant["crithit%"] : "0%");
    this.direct = (!this.dps || !combatant.DirectHitPct ? "0%" : combatant.DirectHitPct);
    this.critDirect = (!this.dps || !combatant.CritDirectHitPct ? "0%" : combatant.CritDirectHitPct);
    this.deaths = combatant.deaths;

    let heal = toPercent(combatant.healed, encounter.healed);
    this.heal = (isNaN(heal) ? 0 : heal);
    this.overHeal = combatant.OverHealPct;

    this.bestHit = new MaxHitStats();
    this.calculateBestHit();
  }
  
  calculateBestHit() {
    let maxHit = this.parseData.maxhit;
    if (!maxHit)
      return;

    // We can't just use split because some skills have hyphens in the name.
    let indexOfSplit = maxHit.lastIndexOf("-");
    this.bestHit.skill = maxHit.slice(0, indexOfSplit);
    this.bestHit.damage = parseInt(maxHit.slice(indexOfSplit+1));
  }

  isLimitBreak() {
    return this.name === "Limit Break";
  }

  isYou() {
    return this.name === yourName;
  }

  hasDied() {
    return this.deaths > 0;
  }

  getRole() {
    return (this.role ? this.role : this.parseData.Job);
  }

  getFormattedName() {
    return this.rank + ") " + this.name;
  }

  getDpsPercentage(topDps) {
    if (!topDps)
      return 0;

    return (parseFloat(this.parseData.encdps) / topDps) * 100;
  }

  getFormattedDps() {
    return localise(isNaN(this.dps) ? "0" : this.dps);
  }

  getFormattedCritRate() {
    return this.crit;
  }

  getFormattedHealPercent() {
    return this.heal + "%";
  }

  getFormattedDeaths() {
    return localise(this.deaths); // You'd hope the localise is never necessary...
  }

  getFormattedBestHit(isExtendedStat) {
    if (isExtendedStat)
      return " - " + this.bestHit.skill;
    
    return this.name + " - " + this.bestHit.skill +  " - ";
  }

  getFormattedBestHitDamage() {
    return localise(this.bestHit.damage);
  }
}
 