# <img src="web/public/law.png" alt="insaaf logo" width=32 height=32 > [I.N.S.A.A.F.](https://insaaf.westindia.cloudapp.azure.com/)

The insaaf(impartial notion suggestion and astute functioning) companion. It is a system designed to accelerate the court hearings by giving suggestions to the judges of the indian judicial system.

##### Tech Stack and Directory structure:

The system is using a microservice based architecture and this repo contains the frontend, backend, AI/ML and proxy services. Each folder is a service and might relies on different tech:
| Service | Tech |
|:----------:|:-----:|
| Backend | Node.Js |
| ML | Python3 |
| Frontend (web) | React.Js |
| Proxy | Nginx |
| Database | MongoDB |

## Installation

The installation can be tricky as the system architecture is micro-service based.

- Local or development environment:
  - Clone the repo or your fork:
    ```bash
    git clone https://github.com/NightWing1998/insaaf.git
                        #OR
    git clone https://github.com/<username>/insaaf.git
    ```
  - Using **_docker_**:
    **_REQUIREMENT : YOU NEED DOCKER AND DOCKER-COMPOSE INSTALLED_**
    Just clone/download the repo and run `docker-compose up --build`. That's it!! Your application shoud be up and running on `http://localhost`
  - Using **_installed languages_**
    **_REQUIREMENT: NODE.JS, YARN/NPM, PYTHON3, PIP, MONGODB_**
    - For backend:
      ```bash
      cd backend
      yarn install #or npm install
      #take a look at config before runnig
      yarn run server #or npm run server
      ```
    - For AI/ML:
      ```bash
      cd ml
      venv env
      source env/bin/activate
      pip3 install --no-cache-dir -r requirements.txt #or python3 -m pip install --no-cache-dir -r requirements.txt
      python3 app.py
      ```
    - For Frontend:
      ```bash
      cd web
      yarn install #or npm install
      yarn web
      ```
    - For Proxy:
      Not required
    - For database:
      [Install MongoDB Documentation](https://docs.mongodb.com/manual/installation/)
- For deploying in cloud:
  - The repo contains a file `docker-compose.prod.yml`
  - Set the following environment variables:
    ```bash
    CONTAINER_REGISTRY= #URL TO YOUR REGISTRY
    VERSION="latest" #OR SPECIFIC VERSION FOR EG: 1.0.0
    ```
  - Run `docker-compose -f docker-compose.prod.yml build` to build the images.
  - Then run `docker-compose -f docker-compose.prod.yml push` to push the images to your registry.
  - Go to your cloud console and run instances of these images

## TODOs

- [ ] Add a configuration section to the [README.md](#) to configure the installations
- [ ] Add docs.md to individual service folders to state it's purpose, stack and API endpoints if any.

## Contributors

- [NightWing1998](https://github.com/NightWing1998)
- [shivamsansare](https://github.com/shivamsansare)
- [TheRealKamikaze](https://github.com/TheRealKamikaze)

## License

[MIT](LICENSE)
