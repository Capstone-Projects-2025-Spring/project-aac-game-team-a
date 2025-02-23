"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[5450],{79199:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>c,contentTitle:()=>s,default:()=>p,frontMatter:()=>i,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"api-specification/frontend","title":"Frontend Class Documentation","description":"Frontend-Backend Integration","source":"@site/docs/api-specification/frontend.md","sourceDirName":"api-specification","slug":"/api-specification/frontend","permalink":"/project-aac-game-team-a/docs/api-specification/frontend","draft":false,"unlisted":false,"editUrl":"https://github.com/Capstone-Projects-2025-Spring/project-aac-game-team-a/tree/main/documentation/docs/api-specification/frontend.md","tags":[],"version":"current","lastUpdatedBy":"kenfonseca","frontMatter":{},"sidebar":"docsSidebar","previous":{"title":"Backend JSDoc Documentation","permalink":"/project-aac-game-team-a/docs/api-specification/backendJSDoc"},"next":{"title":"Frontend JSDoc Documentation","permalink":"/project-aac-game-team-a/docs/api-specification/frontendJSDoc"}}');var a=t(74848),o=t(28453);const i={},s="Frontend Class Documentation",c={},d=[{value:"JSON Overview",id:"json-overview",level:3},{value:"<strong>User JSON</strong>",id:"user-json",level:4},{value:"<strong>Game JSON</strong>",id:"game-json",level:4},{value:"<strong>Drawing JSON</strong>",id:"drawing-json",level:4}];function l(n){const e={code:"code",h1:"h1",h3:"h3",h4:"h4",header:"header",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...n.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(e.header,{children:(0,a.jsx)(e.h1,{id:"frontend-class-documentation",children:"Frontend Class Documentation"})}),"\n",(0,a.jsxs)(e.p,{children:[(0,a.jsx)(e.strong,{children:"Frontend-Backend Integration"}),"\nThe frontend and backend communicate through API endpoints."]}),"\n",(0,a.jsx)(e.h3,{id:"json-overview",children:"JSON Overview"}),"\n",(0,a.jsx)(e.p,{children:"The following section provides an overview of JSON fields."}),"\n",(0,a.jsx)(e.h4,{id:"user-json",children:(0,a.jsx)(e.strong,{children:"User JSON"})}),"\n",(0,a.jsx)(e.pre,{children:(0,a.jsx)(e.code,{className:"language-json",children:'{\n  "data": {\n    "id": "string", // Unique identifier\n    "created_at": "string", // Read-only, creation timestamp\n    "updated_at": "string" // Read-only, last update timestamp\n  }\n}\n'})}),"\n",(0,a.jsx)(e.h4,{id:"game-json",children:(0,a.jsx)(e.strong,{children:"Game JSON"})}),"\n",(0,a.jsx)(e.pre,{children:(0,a.jsx)(e.code,{className:"language-json",children:'{\n  "data": {\n    "id": "string", // Unique game identifier\n    "room_code": "string", // Unique game room code\n    "current_round": "int", // Current round number\n    "max_rounds": "int", // Total number of rounds\n    "players": [\n      {\n        "id": "string", // Player identifier\n        "score": "int" // Player score\n      }\n    ],\n    "created_at": "string",\n    "updated_at": "string"\n  }\n}\n'})}),"\n",(0,a.jsx)(e.h4,{id:"drawing-json",children:(0,a.jsx)(e.strong,{children:"Drawing JSON"})}),"\n",(0,a.jsx)(e.pre,{children:(0,a.jsx)(e.code,{className:"language-json",children:'{\n  "data": {\n    "game_id": "string", // Associated game ID\n    "player_id": "string", // Player who drew\n    "canvas_data": "string", // Encoded drawing data\n    "created_at": "string",\n    "updated_at": "string"\n  }\n}\n'})})]})}function p(n={}){const{wrapper:e}={...(0,o.R)(),...n.components};return e?(0,a.jsx)(e,{...n,children:(0,a.jsx)(l,{...n})}):l(n)}},28453:(n,e,t)=>{t.d(e,{R:()=>i,x:()=>s});var r=t(96540);const a={},o=r.createContext(a);function i(n){const e=r.useContext(o);return r.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function s(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(a):n.components||a:i(n.components),r.createElement(o.Provider,{value:e},n.children)}}}]);