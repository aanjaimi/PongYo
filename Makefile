

DOCKER_COMPOSE=docker compose --env-file ./backend/.env



up:
	$(DOCKER_COMPOSE) up -d

build:
	$(DOCKER_COMPOSE) up -d --build

down:
	$(DOCKER_COMPOSE) down
