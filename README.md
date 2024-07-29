# A stylish ACT OverlayPlugin skin
- Inspired by apex-n (https://github.com/nettyneets/apex-n/releases)
- Built on the ngld fork of the ACT OverlayPlugin (https://github.com/ngld/OverlayPlugin)
- Shoot me a message if there's any problems

# Installation
Download and add the OverlayPlugin listed above to ACT. See its instructions for details.

Unzip the download and copy the contents of this folder into the ACT installation location.
eg: C:\Program Files\Advanced Combat Tracker\resources

To enable the skin, open ACT and go to the Plugins tab. Select the OverlayPlugin.dll tab in there then Mini Parse on the left. If the list on the left is empty, click the 'New' button and make sure to select Custom in the preset dropdown, select 'MiniParse' in the type dropdown and give it a name.
Click the (...) on the URL field then add the path to the index.html

Make sure "Show overlay" is ticked and the "Max. framerate" value in the Advanced tab is at least 30. (Higher is fine too.)
You may also wish to have "Automatically hide overlays" next to the New and Remove buttons ticked too.

Finally, edit the Config file (see below) and change the value of yourName to your character's name and set any of the options you want. If you're unsure, stick to the defaults.

# Config
Config = js/config.js
To edit the config, do so while ACT isn't running, or copy the config file onto your desktop, edit it there and paste it into the js folder with admin permissions, then simply press Reload overlay in ACT to view the changes.

# License
Free for personal use. Non-commercial.
You may not use the material for commercial purposes.

# Core features
- A stylish design making ample use of the job colours as at-a-glance info.
- Coloured Job/Class icons.
- Death count turns red when someone has died.
- Combatants can be expanded with the + button at the end of each row to display a few additional stats.
- Context menu option to end or clear the encounter.
