---
sidebar_position: 1
---
# Unit tests

## Coverage Report

<a target="blank" href={"https://capstone-projects-2025-spring.github.io/project-aac-game-team-a/coverage/index.html"}>Click here for coverage report</a>

## Testing Library

This project utilizes **Vitest**, a vite-native testing framework. Vitest allows us to utilize one testing framework to unit test front-end and back-end components and generate coverage reports for the project.

## Execution

Unit tests can be executed using the following steps:

* Install Node.js --> <a target="blank" href={"https://nodejs.org/en/download"}>Node.js Download Page</a>
* Install vitest with the following command: ```npm install -D vitest```
* To run the **unit tests**, execute the following command in the project root folder: ```npm run test```
* To generate a **coverage report**, execute the following command in the project root folder: ```npm run coverage```

All unit tests and coverage reports are generated automatically upon merging to the main branch of the project repository via Github Actions.

## Configuration

Unit and coverage tests can be configured in the ```vite.config.js``` file located in the root directory of the project.
