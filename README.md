## LFW-APP : Various tools for the FGC

This app is a third party tool tailored for the Fighting Game Community (FGC), for games like Street Fighter, Tekken, Smash Brothers, Mortal Kombat, and more...
As you may know, fighting games are my passion and i've found out several problems in the main site used for hosting and running tournaments : start.gg
- UI problems
- Lack of clarity
- Lots of hassle for organisers when running a tournament
Besides all of this, start gg still obviously has great things going for it and is the leader in the market. By using their API, we can create a nicer experience.

This app serves as a way for people to get the information they want rapidly. Let's take a look !

### The stack
It is build in react.js with Material UI, and the backend is supported by Node.js. Querying start.gg's API is handled using graphQL and in-app communication is handled with RESTFUL APIs.
Finally, start.gg has an oauth feature currently supported in the application.

## The features

### Station Viewer

Allows the user to check what matches are ongoing/called in your bracket, in real time. 
This is very useful for tournament organisers as they don't have to yell for players to play in a given station anymore. This solves a big problem tournament organisers almost always have.
Right now, just by projecting this screen with your own bracket in your event, you'll be able to let players go themselves to the station to play out their set, and only write the report.

![image](https://github.com/user-attachments/assets/1dae55c6-d109-4be3-8647-21688c5644d4)

#### Working on a notification system with oauth. The user, once connected, would get notified once it's their turn to play. This could be a small revolution for tournament organisers, and is what i'm working on.

### Tournaments by User

Allows you to check the tournaments of your favorite player just by typing their ID !

![image](https://github.com/user-attachments/assets/e060ea42-19db-4525-bb7a-75ae0b17eaea)

### Next tournaments by country and game

Allows you to check what tournaments are coming with their page, dates, locations... no matter your game.

![image](https://github.com/user-attachments/assets/1d952e6a-37a1-40bc-897f-6b4895d2c2a3)

More features are obviously on the way, as this project is still in active development (it's kinda slowed down because i'm looking for an apprenticeship currently, and that takes time... but i'm still doing my best)

Thanks for reading !
