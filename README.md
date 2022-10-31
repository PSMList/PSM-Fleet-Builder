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
r
For now, these features work in a standalone way:
 * Save your fleet in the browser, so reopening the Fleet Builder will load the last save
 * Export fleet data to a file that you can share to others 
 * Import fleet data from a shared file

Fleet settings are:
 * name
 * max points

To edit any setting, just double-click on the text and change the value.

There are two types of search inputs:
 * a select input to filter the results by faction
 * a text input to filter results by name or ID (just type "." to view all results)

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

Example of ship selection, with fleet name edition activated:

![Search through spanish ships with the name "Santa" and display of selected ships](https://cdn.discordapp.com/attachments/848668885972287522/1036403360926007357/unknown.png)

Example of crew selection:

![Search through spanish crew and display of selected crew for one specific ship](https://cdn.discordapp.com/attachments/848668885972287522/1036403360535953499/unknown.png)

Demo showing ship and crew search and select, both Desktop and Mobile:

<video controls="" allowfullscreen="" width="" height="">
  <source type="video/mp4" src="https://cdn.discordapp.com/attachments/848668885972287522/1035226202610348052/2022-10-27_18-15-54.mp4">
</video>
