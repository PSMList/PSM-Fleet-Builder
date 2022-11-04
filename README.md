# PSMList Fleet Builder

## Context

This project is a part of the [PSMList](https://www.psmlist.com/public/) project aimed to help Pirates CSG players to find information on elements of the game.

## Presentation

The Fleet Builder aims, in the long run, to give the ability to:
 * Define fleet settings (name, max points, rules...)
 * Search through the ship database and add some to the fleet
 * Search through the crew database and add some to each ship
 * Filter research by faction and extension
 * Empty the list of ships and crew to restart from the ground up
 * Save and share the fleet data as public or private
 * See everyone's public fleets

The Fleet Builder is still in an alpha version.
For now, it is a "standalone" tool (not connected to PSMList accounts, see the [More to come](#more) section).

# Features

The main features available are:
 * Adding ships and crew via respective search bar
 * Edit fleet name and max points
 * Save your fleet in the browser, so reopening the Fleet Builder will load the last save
 * Export fleet data to a file that you can share to others
 * Import fleet data from a shared file

There are two types of search inputs:
 * a select input to filter the results by faction and one by extension
 * a text input with validation and rollback to filter results by name or ID ("." to view all results)

Clicking on the "user group" icon on top of a ship in the fleet shows the crew selection window.
The plus or minus respectively add or remove a ship or crew.

Ship and crew selection gets some validation warnings and errors.
As an example, adding multiple ships with the same name raises a warning.
One possible error (causing action rollback) is when the number of crew exceeds ship cargo.

## Preview

Ship selection:

![Search through spanish ships of the SM extension and display of selected ships](https://cdn.discordapp.com/attachments/848669194508566629/1038095935709925466/image.png)

Crew selection with warning/error messages:

![Search through available crew and display of selected crew for one specific ship](https://cdn.discordapp.com/attachments/848669194508566629/1038100535460507699/image.png)

Fleet settings edition (mobile screen):

![Display of inputs to edit fleet name and max points](https://cdn.discordapp.com/attachments/848669194508566629/1038101854950793296/image.png)

Displaying ship crew count (tablet screen):

![Same display as the first but on tablet screen and notification icon showing crew count of each ship](https://cdn.discordapp.com/attachments/848669194508566629/1038118815881515018/image.png)

Demo of the main features:

[Showing features available in alpha version like searching, selecting, saving, resetting...](https://cdn.discordapp.com/attachments/812021803497029662/1037136213536161863/2022-11-01_23-38-26.mov)

## [More to come][more]

The alpha version of the Fleet Builder is online with limited access.<br />
It is far from complete, especially concerning the link to PSMList account as the key feature to be added. That's why it is planned to bring the following ones:
 * Linking PSMList account to the Fleet Builder and what follows
   * Saving your fleets within the website, public or private
   * Managing yours (watch, update, delete)
   * Search through everyone's public fleet 
 * Enhanced selection:
   * Conditions when contrary to the Pirates' code rules
   * Adding ships and crew links 
 * Advanced settings:
   * Opting in or out for Pirates' code rules
   * Adding custom rules (ex: only Pirates of the Carribean ships and crew, only worst "rank" ships, no submarines...) 
 * Creating and sharing predefined settings (ex: specific rules for an event) 

## Technical details

The code base is developed with Preact, a lightweight version of React, using TypeScript. It is bundled with Vite.
The assets (images, fonts, some css) are taken from the [PSMList website](https://www.psmlist.com/public/).

If you want to run it yourself locally, you will need to use the remote assets from the PSMList website.
For that, you just have to add a &lt;base href="https://www.psmlist.com" />&gt; element in the &lt;head&gt; of the index.html file.
There is no need for an API or database connection because ships, crew, factions and extensions data are pulled from files in data folder to get better performance.

```
For more information, please use the project Issues section.
```