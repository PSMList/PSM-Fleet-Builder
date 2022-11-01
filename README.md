# PSMList Fleet Builder

## Context

This project is a part of the [PSMList](https://www.psmlist.com/public/) project aimed to help Pirates CSG players to find information on elements of the game.

## Presentation

The Fleet Builder gives the ability to:
 * Define fleet settings (name, max points...)
 * Search through the ship database and add some to your fleet
 * Search through the crew database and add some to each ship
 * Filter research by faction
 * Empty the list of ships and crew to restart from the ground up
 * Save and share your fleet
 * See others' fleets

It's aim is to be connected to your PSMList account in order to save your fleet and link it to your account, show it to others and see others'.<br />
It would also be possible to create fleet types to create fleets with locked settings, for example:
 * only ships (not submarine, flotilla, fort or creatures)
 * only SM extension
 * only non meta ships and crew
 * ...
As it still is in an alpha version, linking the Fleet Builder with PSMList account system (and related) is not available. Fleet settings are also limited.

# Features

For now, these features work in a standalone way:
 * Save your fleet in the browser, so reopening the Fleet Builder will load the last save
 * Export fleet data to a file that you can share to others 
 * Import fleet data from a shared file

Fleet settings are editable from a specific window, for now:
 * name
 * max points

There are two types of search inputs:
 * a select input to filter the results by faction
 * a text input with validation and rollback to filter results by name or ID (just type "." to view all results)

Clicking on the "user group" icon on top of a ship in the fleet shows the crew selection window.
The plus or minus respectively add or remove a ship or crew.

Adding a ship or crew gets some validation conditions.
A second ship with the same name can't be added.
For crew from the same ship:
 * There should be only one by name
 * Ship and crew faction must match
 * Number of crew can't exceed ship cargo

Total cost can't exceed fleet max cost setting.

**More validation and specific exceptions will be added later.**

## Preview

Ship selection:

![Search through spanish ships with the name "Santa" and display of selected ships](https://cdn.discordapp.com/attachments/848669194508566629/1037138055649308704/unknown.png)

Crew selection:

![Search through spanish crew and display of selected crew for one specific ship](https://media.discordapp.net/attachments/848669194508566629/1037138055649308704/unknown.png)

Fleet settings edition:

![Display of inputs to edit fleet data like name and max points](https://cdn.discordapp.com/attachments/848669194508566629/1037138884036923412/unknown.png)

Demo showing ship and crew search and select, both Desktop and Mobile:

<video controls="" allowfullscreen="" width="" height="">
  <source type="video/mp4" src="https://cdn.discordapp.com/attachments/812021803497029662/1037136213536161863/2022-11-01_23-38-26.mov">
</video>
