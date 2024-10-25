# CAVS - CUET Anonymous Voting System

## Overview

***CAVS*** is a web application designed to facilitate anonymous voting of polls for the CUETians.Users can create and participate in polls without revealing their identities, though they must use a CUET-email to sign-in into the system. This email will only be used for verification purpose only, the *email_hash*(encrypted with SHA256) will be stored in the database, thus maintaining the anonymity for voting. But The poll-creator's email will not be shown to maintain authenticity and keep the system clean from any unusual activities.\
The backend is built by using FastAPI and SQLModel, while the frontend utilizes Next.js, Tailwind CSS, and Framer Motion.

## Features

- **Anonymous Voting**: Users can vote without disclosing their identities.
- **Poll Creation**: Users can create polls with various options.
- **Time-bound Polls**: Polls can be set to start and end at specific times.
- **Public and Private Polls**: Polls can be made public or restricted to certain users.
- **Poll Results**: Users can view the results of polls after they have ended.

## Local Development

For detailed instructions on setting up and running the backend and frontend locally, please refer to their respective README files:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
