
// TODO:
// Add more expanded stats
// - But which?
// LB is a special row and uses a different set of stats?
// Fix wiggling getting the highlight stuck

(function($) {
  "use strict";
  
  var RegisterOverlayEvents = () => {
    addOverlayListener("CombatData", (e) => Update(e));
    addOverlayListener("ChangeZone", () => EndEncounter());
  };

  var EndEncounter = function() {
    window.OverlayPluginApi.endEncounter();
  };

  var ClearEncounter = async function() {
    /*let comb = await callOverlayHandler({ call: 'getCombatants' }).then((msg) => {
        msg;
    });*/

    EndEncounter();
    ResetOverlay();
  };

  var ResetOverlay = function() {
    let overlay = $("#overlay");
    overlay.html("<li>No data.</li>");
    overlay.addClass("blank");
    EXPANDED.Reset();
  };

  var SetupHeader = (header, encounter, bestHitPlayer) => {
    header.find(".encounter-name").text(encounter.title);
    header.find(".encounter-time").text(encounter.duration);
    header.find(".encounter-dps").text((isNaN(encounter.ENCDPS) ? "0" : localise(encounter.ENCDPS)));

    let encDeath = header.find(".encounter-death");
    encDeath.text(localise(encounter.deaths));  // You'd hope the localize is never necessary...
    if (partyDeathHighlight && encounter.deaths > 0)
      encDeath.addClass("died");
    
    if (!bestHitPlayer)
      return;
    
    let maxHitHeader = header.find(".max-hit");
    if (playerColourMaxHit && bestHitPlayer.isYou())
      maxHitHeader.addClass("player");
    else
      maxHitHeader.addClass("job-" + bestHitPlayer.getRole());
    maxHitHeader.text(bestHitPlayer.getFormattedBestHit(false));
    header.find(".max-hit-val").text(bestHitPlayer.getFormattedBestHitDamage());
  };

  var last_event = null;
  var Update = e => {
    last_event = e;

    if (!e) {
      ResetOverlay();
      return;
    }

    let encounter = e.Encounter;
    let combatants = e.Combatant;
    let hTemplate = $("#header-template");
    let rTemplate = $("#combatant-template");
    let container = $("#overlay").clone();

    container.html("");
    container.removeClass("blank");

    const names = Object.keys(combatants);

    // Header - More after the combatant rows
    let header = hTemplate.clone();

    // Combatant rows
    let combatantRows = new Array;
    let players = new Array;
    let topDps = 0;
    for (let i = 0; i < names.length; ++i) {
      let combatant = combatants[names[i]];
      let player = new Combatant(combatant, encounter, i);
      players.push(player);

      if (i >= rows)
        continue;

      if (!partyLb && player.isLimitBreak())
          continue;
          
      if (!topDps)  // Cheeky - The first combatant did the most dps.
        topDps = parseFloat(combatant.encdps);

      let row = rTemplate.clone();
      combatantRows.push(row);

      row.hover(
        e => { highlightElement(e.currentTarget, 10.0); },
        e => { unHighlightElement(e.currentTarget); }
      );

      let nameField = row.find(".name");
      row.find(".name").text(player.getFormattedName());
      if (player.isYou())
        nameField.addClass("player");

      // Core stats and looks
      row.addClass("job-" + player.getRole());
      row.find(".dps").text(player.getFormattedDps());
      row.find(".job-icon").html(player.icon);
      row.find(".bar").css('width', player.getDpsPercentage(topDps) + "%");
      row.find(".expand").bind("click", () => { EXPANDED.Toggle(row, combatant.name); });
      if (EXPANDED.IsExpanded(combatant.name))
        row.removeClass("more-collapsed");

      // Basic Stats
      row.find(".crit").text(player.getFormattedCritRate());
      row.find(".direct").text(player.direct);
      row.find(".crit-direct").text(player.critDirect);
      let deathStat = row.find(".death");
      deathStat.text(player.getFormattedDeaths());
      if (player.hasDied())
        deathStat.addClass("died");

      // Expanded Stats
      row.find(".heal").text(player.getFormattedHealPercent());
      row.find(".overheal").text(player.overHeal);
      row.find(".max-hit-val").text(player.getFormattedBestHitDamage());
      row.find(".max-hit").text(player.getFormattedBestHit(true));
    }
    
    // Best hit of them all
    let playerBestHit = null;
    for (let player of players) {
      if (ignoreLbMaxHit && player.isLimitBreak())
        continue;

      if (!playerBestHit || playerBestHit.bestHit.damage < player.bestHit.damage)
        playerBestHit = player;
    }
    
    SetupHeader(header, encounter, playerBestHit);

    container.append(header);
    for (let row of combatantRows)
      container.append(row);

    $("#overlay").replaceWith(container);
  }

  // Context Menu
  var menuVisible = false;
  var toggleMenu = cmd => {
    let menu = $("#context-menu");
    if (!menu)
      return;

    const toShow = cmd === "show";
    menu.css("display", (toShow ? "block" : "none"));
    menuVisible = toShow;
  };
  var setPosition = (top, left) => {
    let menu = $("#context-menu");
    if (!menu)
      return;

    menu.css("top", top + "px");
    menu.css("left", left + "px");
    toggleMenu("show");
  };
  window.addEventListener("contextmenu", e => {
    e.preventDefault();
    setPosition(e.pageY, e.pageX);
    return false;
  });
  window.addEventListener("click", e => {
    if (menuVisible)
      toggleMenu("hide");
  });

  // ACT Events
  window.addEventListener("message", e => {
    if (e.data.type === "onOverlayDataUpdate")
      Update(e.data);
  });
  $(document).on('onOverlayDataUpdate', e => {
    Update(e.originalEvent);
  });
  $(document).on("onOverlayStateUpdate", e => {
    if (e.detail.isLocked)
      $("body").removeClass("resizeHandle");
    else
      $("body").addClass("resizeHandle");
  });

  $(document).ready(function() {
    if (typeof _debug_enabled !== "undefined") {
      // Debug code.
      $(".menu-options").append("<li class='menu-option' id='test-encounter'>Test Encounter</li>");
      $(".menu-options").append("<li class='menu-option' id='copy-encounter'>Copy Last Event</li>");
    }
    $("#end-encounter").on("click", e => {
      EndEncounter();
    });
    $("#clear-encounter").on("click", e => {
      ClearEncounter();
    });
    $("#test-encounter").bind("click", e => {
      Update(debug_event);
    });
    $("#copy-encounter").bind("click", e => {
      if (!last_event)
        return;

      let eventStr = JSON.stringify(last_event, null, 4);
      copyToClipboard(eventStr);
    });

    $('<link>').appendTo('head').attr({
      type: 'text/css', 
      rel: 'stylesheet',
      href: 'css/themes/' + skinTheme + '.css'
    });

    RegisterOverlayEvents();
    startOverlayEvents();
  });

})(jQuery);
