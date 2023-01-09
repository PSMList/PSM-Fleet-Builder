# PSMList Fleet Builder

## Context

> The Pirates Constructible Strategy Game is a tabletop game manufactured by WizKids, Inc., with aspects of both miniatures game and collectible card game genres. "Pirates of the Spanish Main" (the initial release of the Pirates line) is the world's first "constructible strategy game," referring to the mechanics of creating game pieces from components that punch out of styrene cards.

[Pirates CSG wiki](https://en.wikipedia.org/wiki/Pirates_Constructible_Strategy_Game)

The commercial edition stopped in 2008 but their still are a lot of players or collectors around the world, espacially in the USA. Projects on top of this boardgame are (or were) keeping the player base in love with it.

The most important one is the community keeping the fan base alive on social networks:
  * [Discord](https://discord.com/invite/qeY7e3Q) (main one)
  * [Facebook](https://www.facebook.com/piratesconstructiblestrategygame/)
  * [Instagram](https://www.instagram.com/piratescsg/)

## Presentation

The Fleet Builder project is a part of the [PSMList](https://www.psmlist.com/public/) website that was built to centralize projetcs aiming to improve Pirates CSG players' experience.

The webssite started as an encyclopedia for this boardgame. 
It went online with a "Fleets" section that promised to bring features for building and sharing fleets.

The Fleet Builder is built on top of the encyclopedia database and aims to enable players to:
  * Manage their fleets:
    * Define fleet settings
    * Search through the PSMList database
    * Add ships with their crew
  * Save, export and import fleets
  * Search through everyone's public fleets
  * And more...

It still is in an alpha stage of development.
The connection to PSMList accounts is not visible in the files of this repository as this part belongs to the PSMList code (not shared for security reasons).

# Features

The main features available are:
  * Searching through the database
  * Select a ship, submarine, creature, flotilla or fort to add
  * Show ships' crew and new crew
  * Deselect unwanted ships and crew
  * Edit fleet name, max points and public visibility
  * Add, edit, save and delete fleets linked with your account
  * Search others' public fleets and show their content
  * Share, export their data as file or import data to clone your or one another's fleet

There are two types of search inputs:
  * a text input to filter results by name or ID
  * a select input to filter the results by faction and one by extension

Ship and crew selection gets some validation warnings and errors.
As an example, adding multiple ships with the same name raises a warning.

## Preview

Ship selection:

![Search through spanish ships of the SM extension and display of selected ships](https://media.discordapp.net/attachments/848669194508566629/1061769104903647402/image.png)

Crew selection with warning/error messages:

![Search through available crew and display of selected crew for one specific ship with rules warnings](https://media.discordapp.net/attachments/848669194508566629/1061769105423736852/image.png)

Fleet settings edition (mobile screen):

![Display of inputs to edit fleet name, max points and public visibility](https://media.discordapp.net/attachments/848669194508566629/1061769105721536583/image.png)

Displaying ship crew count (tablet screen):

![Same display as the first but on tablet screen and notification icon showing crew count of each ship](https://media.discordapp.net/attachments/848669194508566629/1061769106065473716/image.png)

Demo of the main features:

[Showing features available in alpha version like searching, selecting, saving, resetting...](https://cdn.discordapp.com/attachments/812021803497029662/1037136213536161863/2022-11-01_23-38-26.mov)

## More to come

The alpha version of the Fleet Builder is online with limited access.

It is far from complete, but it aims, in the long run, to give the ability to:
  * Enhanced selection rules:
    * Conditions when contrary to the Pirates' code rules
    * Taking ships and crew links, keywords and abilities modifiers
  * Advanced settings:
    * Opting in or out for Pirates' code rules
    * Adding custom rules (ex: only Pirates of the Carribean ships and crew, only worst "rank" ships, no submarines...) 
  * Creating and sharing predefined settings (ex: specific rules for an event) 

## Technical details

The code base is developed with SolidJS, a UI building library like React with fine-grained (true) reactivity, using TypeScript. It is bundled with Vite.
The assets (images, fonts, some css) are taken from the [PSMList website](https://www.psmlist.com/public/).

If you want to run it yourself locally, you will need to use the remote assets from the PSMList website.
For that, you just have to add a &lt;base href="https://www.psmlist.com" />&gt; element in the &lt;head&gt; of the index.html file.
You can pull data from the PSMList database through the online API (see src/data/)

```
For more information or help to install your own environment, please use the project Issues section.
```