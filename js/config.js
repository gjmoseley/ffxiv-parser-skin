// Replaces "YOU" with whatever's here. Default: "YOU"
var yourName = "Feena Faulkner";
// Max number of party member rows to display. Default: 12
var rows = 12;
// true to exclude the Limit Break from being counted in the header's max hit. Default: true
var ignoreLbMaxHit = true;
// true to show the Limit Break in the party list. Default: true
var partyLb = true;
// true to turn the death count red in the header with >0 deaths like in the party list. Default: false
var partyDeathHighlight = false;
// true to set the max hit colour to use the 'YOU' colour if you're the top hitter. Default: false
var playerColourMaxHit = false;
// The name of the theme css file used for setting colours in the skin. Don't include the file extension. Default: "dark"
var skinTheme = "dark";

// Recommended "Max. framerate" in ACT's FF14 overlay setting of at least 30
// or else the animations look very stuttery.

// If you want to play around and change things. Go nuts.
// Colours can be found in the core.css sprinkled about the place.
// If you want to add more stats add an entry in the html in the appropriate place
// then fill in the row for it in the Core.js. Use an existing stat as an example to work from.
