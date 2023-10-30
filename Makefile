

DOCKER_COMPOSE=docker compose --env-file ./backend/.env -p pong-yo



up:
	$(DOCKER_COMPOSE) up -d

ps:
	$(DOCKER_COMPOSE) ps

build:
	$(DOCKER_COMPOSE) up -d --build

log:
	$(DOCKER_COMPOSE) logs $(SERVICE_NAME) --follow

minio:
	$(DOCKER_COMPOSE) up minio -d


down:
	$(DOCKER_COMPOSE) down
