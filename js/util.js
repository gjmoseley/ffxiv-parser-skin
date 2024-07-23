"use strict";

const localise = num => {
  return Intl.NumberFormat().format(num);
};

const toPercent = (num, divisor) => {
  if (!divisor)
    return 0;
  return (parseInt(num) / parseInt(divisor) * 100).toFixed();
};

const jobOrName = combatant => {
  combatant.JobOrName = combatant.Job || combatant.name;

  /* EW: This might not be needed anymore */
  let egiSearch = combatant.JobOrName.indexOf("-Egi (");
  if (egiSearch != -1) {
    combatant.JobOrName = combatant.JobOrName.substring(0, egiSearch);
  } else if (combatant.JobOrName.indexOf("Eos (") != -1) {
    combatant.JobOrName = "Eos";
  } else if (combatant.JobOrName.indexOf("Selene (") != -1) {
    combatant.JobOrName = "Selene";
  } else if (combatant.JobOrName.indexOf("Carbuncle (") != -1) {
    combatant.JobOrName = "PET";
  } else if (combatant.JobOrName.indexOf("Autoturret (") != -1) {
    combatant.JobOrName = "rook";
  } else if (combatant.JobOrName.indexOf(" (") != -1) {
    combatant.JobOrName = "chocobo";
  }
  return combatant.JobOrName;
};

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const getRGB = colour => {
  if (colour.indexOf("rgba") === -1)
      return { r: 0, g: 0, b: 0 };

  // If the bg colour is shown as "rgb(r,g,b)", strip the text characters
  let colourSplit = colour.replace("rgba(", "").replace(")", "").split(",");
  return {
      r: parseInt(colourSplit[0]),
      g: parseInt(colourSplit[1]),
      b: parseInt(colourSplit[2]),
      a: parseFloat(colourSplit[3])
  };
};

const highlightElement = (sender, percent) => {
  sender.originalBg = $(sender).css("backgroundColor");

  // Get the sender's bg colour
  let colour = getRGB(sender.originalBg);

  let hiLite = "rgba(" +
    (colour.r + (256 - colour.r) * percent / 100).toString() + "," +
    (colour.g + (256 - colour.g) * percent / 100).toString() + "," +
    (colour.b + (256 - colour.b) * percent / 100).toString() + "," +
    (colour.a).toString() + ")";

  $(sender).css("backgroundColor", hiLite);
};

const unHighlightElement = sender => {
  if (typeof sender.originalBg === "undefined")
    return;

  $(sender).css("backgroundColor", sender.originalBg);
};