---
sidebar_position: 5
---

# Use-case descriptions

## Use Case Diagram
![AAC_use_case_diagram](https://github.com/user-attachments/assets/be1ec26e-8bf2-4118-8e8b-9cffd4c2b6de)

Figure 1: Use Case Diagram  
This diagram shows the flow of the game and how 3 players interact with it. For clarity, Child 1's interactions with the system are that of a drawer and Child 2 and 3's interactions are that of guessers, when in practice they will all take turns being the drawer.

## Use Cases

#1 **Host hosts game**  
The player setting up the game navigates to the website. Upon arrival, they see a large "Host Game" Button. This triggers the creation of a lobby with a room code that the host can share to the other players.

Triggering Event:
Host navigates to the game website and clicks a button "Host Game".

#2 **Host gets room code**  
The host is presented with a short room code that they will tell the players so they can enter it and join.

Triggering Event: The host has created a lobby by pressing "Host Game".


#3 **Host presses start game button**  
Once everyone has joined, the host will press start game. This will trigger the beginning of the game cycle.  

Triggering Event: All players have joined the lobby, and the host wants to start the game.

#4 **Players enter room code**  
Players use the room code provided by the host to enter it and join the lobby. 

Triggering Event: The host receives the room code and shares it with other players.

#5 **Players select avatar**  
Upon joining, each player will be presented with an array of avatars to choose from, and they must tap an avatar to join the lobby with that avatar.  

Triggering Event: A user has entered a valid room code.

#6**One player is selected at random to be a drawer**  
Out of all players, including the host, one is randomly selected to be the first drawer. They will be shown the drawing interface.  

Triggering Event: The host pressed start game.

#7 **The drawer is given 3 random choices to choose from to draw**  
The drawer is provided with 3 random prompts on their screen as buttons to choose from to draw. They tap on the choice that they want, and then they can begin drawing.  

Triggering Event: The drawer has been randomly selected.

#8 **Guessers see a guessing interface and drawing as it progresses**  
Default flow: The guessers spectate the drawing and make guesses using the AAC tablet as the round progresses.  
Alternative flow: The guessers spectate the drawing and make guesses using the keyboard after clicking the keyboard toggle button.  
There is a timer counting down during each drawing phase.  

Triggering Event: The drawer has selected one of the three random drawing prompts.  
Alternate Triggering Event: The drawer ran out of time (15s) to choose a prompt and one has been randomly selected.

#9 **Phase ends when the timer expires or everyone has guessed correctly**  
At this point, the correct answer will be displayed, and players will be awarded points. Point award values have not been determined yet.  

Triggering Event: drawer draws prompt and players try to guess the drawing prompt.

#10 **Players are awarded points for guessing correctly, drawer is awarded for players guessing the drawing**  
Players will accumulate points based on their performance in the game, but we want to make sure that the game doesn't feel too competitive.  

#11 **Users see summary screen**  
After everyone draws for their third time, total points will be displayed, and rankings will be shown at the end of the game.  
Triggering Event: All players have drawn three times.


