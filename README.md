# Gridonic Client Services

A service library for our projects respecting application boundaries and encapsulating dependencies.

It works best for projects created with [@gridonic/cli](https://www.npmjs.com/package/@gridonic/cli).

## Concepts

The library is designed to provide services used repeatedly in projects.

- Provides interfaces for each exported service and model
- The services are mostly independent from each other, so they can be added selectively to the projects
- Written in typescript 

### Benefits

- Standardizes our projects by using interfaces for common services and models
- Encapsulates dependencies, making it possible to replace them easier if needed
- No magic or restrictions: services can be extended, copied or completely replaced if they are not suiting the project
- Only used services get compiled into project

## Usage in Projects

Services can be imported selectively into a project. It is recommended to do all imports in one file in each project
and exporting the types. This prevents the code from being cluttered with import statements from this library.

## Developing the library

### Local project setup

Install dependencies
```
npm install
```

Run unit tests
```
npm run test
```

Lints and fixes files
```
npm run lint
```

### Publishing

When ready to release, execute the following steps, given that all changes are commited in the master branch:
- List changes in the CHANGELOG.md
- Bump your version and automatically create a git tag with `npm version <type>`, where type is patch, minor or major
- Push the master branch `git push` and the tags `git push --tags`
- Create a release in github. A github action will then automatically publish the package to npm

### Guidelines

- Every service must be documented
- Every service must implement an interface
- Every service must be unit-tested
