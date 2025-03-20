"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[3791],{10659:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"system-architecture/design","title":"design","description":"Component Descriptions","source":"@site/docs/system-architecture/design.md","sourceDirName":"system-architecture","slug":"/system-architecture/design","permalink":"/project-aac-game-team-a/docs/system-architecture/design","draft":false,"unlisted":false,"editUrl":"https://github.com/Capstone-Projects-2025-Spring/project-aac-game-team-a/tree/main/documentation/docs/system-architecture/design.md","tags":[],"version":"current","lastUpdatedBy":"Terrell Heyward","frontMatter":{},"sidebar":"docsSidebar","previous":{"title":"Version Control","permalink":"/project-aac-game-team-a/docs/system-architecture/version-control"},"next":{"title":"API Specification","permalink":"/project-aac-game-team-a/docs/category/api-specification"}}');var a=n(74848),t=n(28453);const i={},o=void 0,d={},c=[{value:"Component Descriptions",id:"component-descriptions",level:2},{value:"Frontend (Client-Side):",id:"frontend-client-side",level:3},{value:"Backend (Server-Side):",id:"backend-server-side",level:3},{value:"Class Diagram",id:"class-diagram",level:2},{value:"Sequence Diagrams",id:"sequence-diagrams",level:2},{value:"Algorithms",id:"algorithms",level:2},{value:"1. Player Selection (Random Drawer)",id:"1-player-selection-random-drawer",level:3},{value:"2. Word Selection (Random Prompt Assignment)",id:"2-word-selection-random-prompt-assignment",level:3},{value:"3. Guess Matching Algorithm",id:"3-guess-matching-algorithm",level:3},{value:"4. Score Calculation",id:"4-score-calculation",level:3},{value:"Collection Schemas",id:"collection-schemas",level:3},{value:"Collection Schemas",id:"collection-schemas-1",level:4}];function l(e){const s={br:"br",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",mermaid:"mermaid",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.h2,{id:"component-descriptions",children:"Component Descriptions"}),"\n",(0,a.jsx)(s.h3,{id:"frontend-client-side",children:"Frontend (Client-Side):"}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"GameRoom"}),(0,a.jsx)(s.br,{}),"\n","The GameRoom class contains elements that pertain to management of game sessions, including players, game rounds, and prompt information. It is the core game logic and controls the flow of the game such as which players are drawing, which players are guessing, the transitions between rounds, and starting and ending the game. It will handle prompts ensuring that none are repeated, and provides references to images pertaining to the prompts. This class also handles server-side functionality but for organization it is under client-side."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"Player"}),(0,a.jsx)(s.br,{}),"\n","This class is used to represent individual users who will be playing the game. It will store a player\u2019s details and score pertaining to the game session, and"]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"DrawingCanvas"}),(0,a.jsx)(s.br,{}),"\n","This class handles drawing functionality such as the canvas to draw on, the tools to draw with, and the stroke/color to draw with. It gathers the data from the drawer so it can be sent to the interfaces of the other players."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"ReferenceImageProvider"}),(0,a.jsx)(s.br,{}),"\n","When a prompt is displayed to a drawer, it will be accompanied by a reference image to assist the drawer if they have limited knowledge of the prompt to draw. This class will aid in storing and presenting the image to the current drawer and only to the current drawer. There will be multiple reference images per prompt to discourage the same drawing being done each time."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"GuessMessage"}),(0,a.jsx)(s.br,{}),"\n","The symbols to be sent in chat are handled by this class. It is used to broadcast AAC symbols a player selects to other player interfaces and also to determine the correct guess for a prompt."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"GameSettings"}),(0,a.jsx)(s.br,{}),"\n","This class is used to provide game sessions with rules and configurations such as how much time per round, how many players can join, and if AAC controls are enabled or not."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"AACBoard"}),(0,a.jsx)(s.br,{}),"\n","This class manages AAC board integration. We will be creating our own AAC Board and store symbols in this class to be referenced all througout the project."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"AACSymbol"}),(0,a.jsx)(s.br,{}),"\n","This class is used to represent symbols to include in our AAC Board with information such as an ID, a label, category, and image."]}),"\n",(0,a.jsx)(s.h3,{id:"backend-server-side",children:"Backend (Server-Side):"}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"GameSession"}),(0,a.jsx)(s.br,{}),"\n","This class uses the attributes from the GameRoom class and starts the game. GameSession handles the functionality of game session initiation, progression, and termination. It keeps track of current players in session, rounds completed, and then determines the winning player at the end."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"DataDrawing"}),(0,a.jsx)(s.br,{}),"\n","This class is fed by the GameSession class and records the data from drawings made by an individual user."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"StrokeData"}),(0,a.jsx)(s.br,{}),"\n","The class is used to represent an individual stroke of a drawing, and stores the coordinates, color, and size."]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.strong,{children:"SocketHandler"}),(0,a.jsx)(s.br,{}),"\n","This class manages WebSocket integration so that players can interact in real-time. It will handle client-server communication such ad connections, disconnections, drawing and chat events, and round starting or stopping."]}),"\n",(0,a.jsx)(s.h2,{id:"class-diagram",children:"Class Diagram"}),"\n",(0,a.jsx)("img",{width:"1056",alt:"Screenshot 2025-02-22 at 12 23 14\u202fPM",src:"https://github.com/user-attachments/assets/8fdaae25-4a33-41b9-982f-71ecc77377da"}),"\n",(0,a.jsx)("img",{width:"1057",alt:"Screenshot 2025-02-22 at 12 23 38\u202fPM",src:"https://github.com/user-attachments/assets/8601dc7f-ba64-44ad-bb11-e15d2d6d79ed"}),"\n",(0,a.jsx)(s.h2,{id:"sequence-diagrams",children:"Sequence Diagrams"}),"\n",(0,a.jsxs)(s.p,{children:["#1 ",(0,a.jsx)(s.strong,{children:"Host hosts game"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor host\r\nparticipant landingPage.js\r\nparticipant backend.js\r\n\r\nhost ->> landingPage.js: clicks host game button\r\nlandingPage.js -) backend.js: hostGame websocket message\r\nbackend.js --\x3e> landingPage.js: you are the host (websocket)\r\nlandingPage.js ->> lobby.js: navigates to\r\nlobby.js ->> host: host sees lobby page"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 1"}),"\n",(0,a.jsx)(s.p,{children:'The player setting up the game navigates to the website. Upon arrival, they see a large "Host Game" Button. This triggers the creation of a lobby with a room code that the host can share to the other players.'}),"\n",(0,a.jsx)(s.p,{children:'The host navigates to the website, and they click the large "host game" button. This triggers landingPage.js to send a message to the backend notifying that the host has hosted a game. This returns a websocket message back to the landingPage that relays stores a isHost boolean on the host\'s LandingPage. Then the landingPage immediately navigates to lobby.js, bringing with it information including the isHost boolean. Then thes host can see the lobby page with the necessary host componenets.'}),"\n",(0,a.jsx)(s.p,{children:'Triggering Event:\r\nHost navigates to the game website and clicks a button "Host Game".'}),"\n",(0,a.jsxs)(s.p,{children:["#2 ",(0,a.jsx)(s.strong,{children:"Host gets room code"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor host\r\n\r\nlandingPage.js ->> backend.js: hostGame websocket message\r\n\r\nbackend.js ->> backend.js: generates room code\r\nlandingPage.js ->> lobby.js: navigates to\r\nlobby.js ->> backend.js: request room code (websocket)\r\nactivate lobby.js\r\nbackend.js --\x3e> lobby.js: return room code (websocket)\r\ndeactivate lobby.js\r\nlobby.js ->> host: display room code\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 2"}),"\n",(0,a.jsx)(s.p,{children:"The host is presented with a short room code that they will tell the players so they can enter it and join."}),"\n",(0,a.jsx)(s.p,{children:'Triggering Event: The host has created a lobby by pressing "Host Game".'}),"\n",(0,a.jsxs)(s.p,{children:["#3 ",(0,a.jsx)(s.strong,{children:"Host presses start game button"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\nactor player\r\n\r\nactor host\r\n\r\nhost ->> lobby.js: presses start game\r\nactivate lobby.js\r\nlobby.js ->> backend.js: start game (websocket)\r\nbackend.js ->> lobby.js: to all fontends: start game (websocket)\r\nlobby.js ->> drawing.js: navigate to\r\n\r\n\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 3: one diagram showing the possibility of drawing."}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\nactor player\r\n\r\nactor host\r\n\r\nhost ->> lobby.js: presses start game\r\nactivate lobby.js\r\nlobby.js ->> backend.js: start game (websocket)\r\nbackend.js ->> lobby.js: to all frontends: start game (websocket)\r\nlobby.js ->> guessing.js: navigate to"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 4: alternative diagram showing the possibility of guessing."}),"\n",(0,a.jsx)(s.p,{children:'Once everyone has joined, the host will choose to press the "start game button". This will send a websocket message to the backend, which will be echoed back to all frontends. Then all frontends will navigate to either drawing.js or guessing.js depending on their role for the first round.'}),"\n",(0,a.jsx)(s.p,{children:"Triggering Event: All players have joined the lobby, and the host wants to start the game."}),"\n",(0,a.jsxs)(s.p,{children:["#4 ",(0,a.jsx)(s.strong,{children:"Players enter room code"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor player\r\n\r\nplayer ->> landingPage.js: enters room code\r\n\r\nactivate landingPage.js\r\nlandingPage.js ->> backend.js: checks room code\r\nbackend.js --\x3e> landingPage.js: validates room code\r\nlandingPage.js ->> lobby.js: navigates to\r\ndeactivate landingPage.js\r\nlobby.js ->> player: player sees lobby screen\r\n\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 5"}),"\n",(0,a.jsx)(s.p,{children:"Players use the room code provided by the host to enter it and join the lobby. Once entered, the landingPage.js sends the code to the backend for verification, and returns whether it's a valid code or not. If it is valid, it will navigate the user to the appropriate lobby, lobby.js. Then the user will see the lobby screen."}),"\n",(0,a.jsx)(s.p,{children:"Triggering Event: The host receives the room code and shares it with other players."}),"\n",(0,a.jsxs)(s.p,{children:["#5 ",(0,a.jsx)(s.strong,{children:"Players select avatar"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor player\r\nlandingPage.js ->> backend.js: fetch available avatars (websocket)\r\nbackend.js --\x3e> landingPage.js: return available avatars (websocket)\r\nlandingPage.js ->> player: display possible avatars\r\nplayer ->> landingPage.js: select avatar\r\nlandingPage.js ->> backend.js: update available avatars (websocket)\r\nbackend.js --\x3e> landingPage.js: confirm update (websocket)\r\nlandingPage.js ->> lobby.js: navigates to\r\nlobby.js ->> player: shows avatar in lobby screen\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 6"}),"\n",(0,a.jsx)(s.p,{children:"Upon joining, each player will be presented with an array of avatars to choose from, and they must tap an avatar to join the lobby with that avatar. First, the frontend must fetch the available avatars from the backend as a websocket message. The backend returns the available avatars, and the landingPage displays them to the user for selection. The user will make a selection, and landingPage.js will update the avatar list in the backend, which will verify with a return value. Then the landingPage.js will navigate to lobby.js where the user will see the lobby along with their avatar."}),"\n",(0,a.jsx)(s.p,{children:"Triggering Event: A user has entered a valid room code."}),"\n",(0,a.jsxs)(s.p,{children:["#6 ",(0,a.jsx)(s.strong,{children:"One player is selected at random to be a drawer"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor player\r\nparticipant drawing.js\r\nparticipant lobby.js\r\nparticipant backend.js\r\n\r\nbackend.js ->> backend.js: randomly selects drawer\r\nbackend.js ->> lobby.js: start game websocket message (contains role info)\r\nlobby.js ->> drawing.js: navigates to\r\ndrawing.js ->> player: player sees drawing page\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 7: showing the possibility of drawing first."}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor player\r\nparticipant guessing.js\r\nparticipant lobby.js\r\nparticipant backend.js\r\n\r\nbackend.js ->> backend.js: randomly selects drawer\r\nbackend.js ->> lobby.js: start game websocket message (contains role info)\r\nlobby.js ->> guessing.js: navigates to\r\nguessing.js ->> player: player sees guessing page\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 8: alternative showing the possibility of guessing first."}),"\n",(0,a.jsx)(s.p,{children:"Out of all players, including the host, one is randomly selected to be the first drawer. They will be shown the drawing interface. First, the backend randomly select a drawer from the list of players. Next, it will send a start game websocket message containing role info. Each player's lobby.js will take that information and either navigate them to guessing.js or drawing.js, where the users will see the appropriate UI."}),"\n",(0,a.jsx)(s.p,{children:"Triggering Event: The host pressed start game."}),"\n",(0,a.jsxs)(s.p,{children:["#7 ",(0,a.jsx)(s.strong,{children:"The drawer is given 3 random choices to choose from to draw"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor drawer\r\nparticipant drawing.js\r\nbackend.js ->> backend.js: selects 3 random prompts from list\r\nbackend.js ->> drawing.js: prompt choices (websocket)\r\ndrawing.js ->> drawer: drawer sees prompt choices\r\ndrawer ->> drawing.js: selects prompt\r\ndrawing.js ->> backend.js: current prompt (websocket)\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 9"}),"\n",(0,a.jsx)(s.p,{children:"The drawer is provided with 3 random prompts on their screen as buttons to choose from to draw. They tap on the choice that they want, and then they can begin drawing. First, the backend must randomly select 3 prompts from the list of possible prompts. The backend relays these choices in a websocket message to the drawing.js frontend file. the drawer sees the list, makes a choice, and drawing.js relays the choice to the backend."}),"\n",(0,a.jsx)(s.p,{children:"Triggering Event: The drawer has been randomly selected."}),"\n",(0,a.jsxs)(s.p,{children:["#8 ",(0,a.jsx)(s.strong,{children:"Guessers see a guessing interface and drawing as it progresses"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor guesser\r\nactor drawer\r\nparticipant guessing.js\r\nparticipant drawing.js\r\nparticipant backend.js\r\n\r\ndrawer ->> drawing.js: draws on the interface\r\ndrawing.js ->> backend.js: frequent drawing information (websocket)\r\nbackend.js ->> guessing.js: frequent drawing information (websocket)\r\nguessing.js ->> guesser: guesser spectates drawing\r\nguesser ->> guessing.js: guesser makes a guess\r\nguessing.js ->> backend.js: guess information (websocket)\r\nbackend.js ->> backend.js: checks guess\r\nbackend.js --\x3e> guessing.js: guess response (websocket)\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 10"}),"\n",(0,a.jsxs)(s.p,{children:["Default flow: The guessers spectate the drawing and make guesses using the AAC tablet as the round progresses.",(0,a.jsx)(s.br,{}),"\n","Alternative flow: The guessers spectate the drawing and make guesses using the keyboard after clicking the keyboard toggle button.",(0,a.jsx)(s.br,{}),"\n","There is a timer counting down during each drawing phase."]}),"\n",(0,a.jsx)(s.p,{children:"Further explanation: First, the drawer begins drawing on the interface on drawing.js, and frequent websocket information containing drawing data is sent to the backend. The drawing data is echoed to all guessing.js frontends that are spectating. Guessers spectate and enter guesses, which are relayed from guessing.js to backend.js to be checked. The user sees the result of their guess when another websocket message comes back from the backend to guessing.js."}),"\n",(0,a.jsxs)(s.p,{children:["Triggering Event: The drawer has selected one of the three random drawing prompts.",(0,a.jsx)(s.br,{}),"\n","Alternate Triggering Event: The drawer ran out of time (15s) to choose a prompt and one has been randomly selected."]}),"\n",(0,a.jsxs)(s.p,{children:["#9 ",(0,a.jsx)(s.strong,{children:"Phase ends when the timer expires or everyone has guessed correctly"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor drawer\r\nactor guesser\r\nbackend.js ->> guessing.js: guessing over (websocket)\r\nbackend.js ->> drawing.js: drawing over (websocket)\r\nguessing.js ->> guesser: reveal the prompt\r\ndrawing.js ->> drawer: show guessing phase results\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 11"}),"\n",(0,a.jsx)(s.p,{children:"At this point, the correct answer will be displayed, and players will be awarded points. Point award values have not been determined yet. First, the backend messages all guessing frontends and the drawing frontend that the drawing is over along with important information about the round. Then the prompt is revealed to the guessers, and the drawer sees the results of who guessed correctly."}),"\n",(0,a.jsx)(s.p,{children:"Triggering Event: drawer draws prompt and players try to guess the drawing prompt."}),"\n",(0,a.jsxs)(s.p,{children:["#10 ",(0,a.jsx)(s.strong,{children:"Players are awarded points for guessing correctly, drawer is awarded for players guessing the drawing"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\nactor guesser\r\nparticipant guessing.js\r\n\r\nguesser ->> guessing.js: enters guess\r\nguessing.js ->> backend.js: guess (websocket)\r\nbackend.js ->> backend.js: checks guess\r\nbackend.js ->> backend.js: adds points to guesser's score\r\nbackend.js --\x3e> guessing.js: correct guess response (websocket)\r\nguessing.js --\x3e> guesser: guesser sees they guessed correct\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 12"}),"\n",(0,a.jsx)(s.p,{children:"Players will accumulate points based on their performance in the game. When a guesser enters a guess, guessing.js sends the guess in a websocket to the backend where it is checked, points are added to the players score, and the guess response data is sent back to guessing.js for the user to see."}),"\n",(0,a.jsx)(s.p,{children:"Triggering event: The drawer has begun drawing and one of the guessers wants to make a guess."}),"\n",(0,a.jsxs)(s.p,{children:["#11 ",(0,a.jsx)(s.strong,{children:"Users see summary screen"})]}),"\n",(0,a.jsx)(s.mermaid,{value:"sequenceDiagram\r\n\r\nactor player\r\nparticipant summary.js\r\nparticipant backend.js\r\nbackend.js ->> backend.js: determines rankings\r\nbackend.js ->> summary.js: summary information (websocket)\r\nsummary.js ->> player: sees summary screen\r\n\r\n"}),"\n",(0,a.jsx)(s.p,{children:"Sequence Diagram 13"}),"\n",(0,a.jsx)(s.p,{children:"After everyone draws for their third time, total points will be displayed, and rankings will be shown at the end of the game. The backend will keep track of when the final round ends, and it will determine the rankings and deliver  the summary information to summary.js where users will see a summary screen."}),"\n",(0,a.jsx)(s.p,{children:"Triggering Event: All players have drawn three times."}),"\n",(0,a.jsx)(s.h2,{id:"algorithms",children:"Algorithms"}),"\n",(0,a.jsx)(s.h3,{id:"1-player-selection-random-drawer",children:"1. Player Selection (Random Drawer)"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"Selects one player randomly from the active lobby."}),"\n",(0,a.jsxs)(s.li,{children:["Uses ",(0,a.jsx)(s.code,{children:"Math.random()"})," to pick an index from the player list."]}),"\n"]}),"\n",(0,a.jsx)(s.h3,{id:"2-word-selection-random-prompt-assignment",children:"2. Word Selection (Random Prompt Assignment)"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"Retrieves three random words from a predefined list."}),"\n",(0,a.jsx)(s.li,{children:"Uses Fisher-Yates shuffle or a similar algorithm."}),"\n",(0,a.jsx)(s.li,{children:"If no selection in 15s, a word is randomly assigned."}),"\n"]}),"\n",(0,a.jsx)(s.h3,{id:"3-guess-matching-algorithm",children:"3. Guess Matching Algorithm"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"Converts guess and answer to lowercase, removes punctuation."}),"\n",(0,a.jsx)(s.li,{children:"Awards correct answer points"}),"\n"]}),"\n",(0,a.jsx)(s.h3,{id:"4-score-calculation",children:"4. Score Calculation"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"Guessers earn points based on time taken."}),"\n",(0,a.jsx)(s.li,{children:"Drawer earns points based on correct guesses."}),"\n",(0,a.jsx)(s.li,{children:"Balanced scoring to avoid excessive competitiveness."}),"\n"]}),"\n",(0,a.jsx)(s.h3,{id:"collection-schemas",children:"Collection Schemas"}),"\n",(0,a.jsx)(s.p,{children:(0,a.jsx)(s.strong,{children:"Users Collection"})}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{className:"language-json",children:'{\r\n  "avatar": "String",\r\n  "room_code": "String"\r\n}\n'})}),"\n",(0,a.jsx)(s.h4,{id:"collection-schemas-1",children:"Collection Schemas"}),"\n",(0,a.jsx)(s.p,{children:(0,a.jsx)(s.strong,{children:"Guess"})}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{className:"language-json",children:'{\r\n  "guess": "String",\r\n}\n'})})]})}function h(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,a.jsx)(s,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},28453:(e,s,n)=>{n.d(s,{R:()=>i,x:()=>o});var r=n(96540);const a={},t=r.createContext(a);function i(e){const s=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),r.createElement(t.Provider,{value:s},e.children)}}}]);