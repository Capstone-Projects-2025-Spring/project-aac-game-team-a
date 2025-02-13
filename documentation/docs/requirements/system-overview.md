---
sidebar_position: 1
---

# System Overview
## Project abstraction

The AAC Pictionary Game is a web-based application designed to facilitate inclusive
and engaging gameplay for children across the autism spectrum. The platform
enables autistic children to communicate using an integrated AAC (Augmentative
and Alternative Communication) board, while other participants interact via voice
chat. Our goal is to minimize communication barriers and promote social
interaction in a fun and supportive environment.

## Conceptual Design
The application presents a user-friendly front-end interface where children interact
with the game. The interface displays avatars for each user and incorporates an
AAC board for autistic children. The system architecture consists of two primary
back-end components:

* A RESTful API that manages user authentication and account setup.
* A socket-based service that handles real-time game connectivity.
