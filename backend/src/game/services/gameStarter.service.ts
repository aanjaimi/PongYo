import { Injectable } from '@nestjs/common';
import { Engine, World, Bodies, Body, Runner, Events } from 'matter-js';
import { UserService } from '@/game/services/updateStatus.service';
import { Socket } from 'socket.io';
import { Mode } from '@prisma/client';
import { GameGateway } from '../game.gateway';
import { Server } from 'socket.io';

@Injectable()
export class GameStarterService {
  constructor(private userService: UserService) {}

  async startGame(
    player1: Socket,
    player2: Socket,
    isRanked: boolean,
    server: Server,
  ) {
    await this.delay(5060);
    let player1Score = 0;
    let player2Score = 0;
    let isGameOver = false;

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    const createWall = (
      x: number,
      y: number,
      width: number,
      height: number,
      isStatic: boolean,
      restitution?: number,
    ) => {
      return Bodies.rectangle(x, y, width, height, {
        isStatic: isStatic,
        restitution: restitution || 0,
      });
    };

    const ball = Bodies.circle(325, 375, 10, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      inertia: Infinity,
    });

    Body.setVelocity(ball, { x: 8, y: -8 });

    const blueball = Bodies.circle(500, 200, 25, { isStatic: true });
    const magentaball = Bodies.circle(500, 550, 25, { isStatic: true });
    const redball = Bodies.circle(150, 550, 25, { isStatic: true });
    const tanball = Bodies.circle(150, 200, 25, { isStatic: true });
    const playerPaddle = Bodies.rectangle(325, 15, 150, 20, { isStatic: true });
    const opponentPaddle = Bodies.rectangle(325, 735, 150, 20, {
      isStatic: true,
    });

    const walls = [
      createWall(0, 375, 1, 750, true, 1),
      createWall(650, 375, 1, 750, true, 1),
      createWall(325, 0, 650, 1, true, 1),
      createWall(325, 750, 650, 1, true, 1),
    ];
    World.add(engine.world, [ball, playerPaddle, opponentPaddle, ...walls]);
    if (isRanked) {
      World.add(engine.world, [blueball, magentaball, redball, tanball]);
    }
    const runner = Runner.create();
    Runner.run(runner, engine);
    Events.on(engine, 'beforeUpdate', () => {
      const resetBallPosition = () => {
        Body.setPosition(ball, { x: 325, y: 375 });
        player2
          .to(player1.user.id)
          .emit('update-ball-position', { x: 325, y: 375 });
        player1
          .to(player2.user.id)
          .emit('update-ball-position', { x: 325, y: 375 });
      };

      const ballPosition = {
        x: ball.position.x,
        y: ball.position.y,
      };
      if (
        ballPosition.y > 751 ||
        ballPosition.y < -1 ||
        ballPosition.x > 651 ||
        ballPosition.x < -1
      ) {
        resetBallPosition();
      }
      player1.to(player2.user.id).emit('update-ball-position', ballPosition);
      ballPosition.y = 750 - ballPosition.y;
      player2.to(player1.user.id).emit('update-ball-position', ballPosition);
    });
    player1.on('update-player-position', (position) => {
      player2.to(player1.user.id).emit('update-player-position', position);
      position.y = 750 - position.y;
      Body.setPosition(playerPaddle, position);
      player1.to(player2.user.id).emit('update-opponent-position', position);
    });
    player2.on('update-player-position', (position) => {
      player1.to(player2.user.id).emit('update-player-position', position);
      Body.setPosition(opponentPaddle, position);
      position.y = 750 - position.y;
      player2.to(player1.user.id).emit('update-opponent-position', position);
    });
    if (!isGameOver) {
      Events.on(engine, 'collisionStart', (event) => {
        const pairs = event.pairs;

        for (const pair of pairs) {
          const { bodyA, bodyB } = pair;

          const emitColorChange = (color) => {
            player1.to(player2.user.id).emit('change-color', { color });
            if (color === 'blue') {
              color = 'magenta';
            } else if (color === 'red') {
              color = 'tan';
            } else if (color === 'magenta') {
              color = 'blue';
            } else if (color === 'tan') {
              color = 'red';
            }
            player2.to(player1.user.id).emit('change-color', { color });
          };

          const emitScoreUpdate = () => {
            player2.to(player1.user.id).emit('update-score', {
              myScore: player2Score,
              oppScore: player1Score,
            });
            player1.to(player2.user.id).emit('update-score', {
              myScore: player1Score,
              oppScore: player2Score,
            });
          };

          const resetBallPosition = () => {
            Body.setPosition(ball, { x: 325, y: 375 });
            player2
              .to(player1.user.id)
              .emit('update-ball-position', { x: 325, y: 375 });
            player1
              .to(player2.user.id)
              .emit('update-ball-position', { x: 325, y: 375 });
          };

          if (bodyA === blueball || bodyB === blueball) {
            emitColorChange('blue');
            ball.velocity.y = ball.velocity.y > 0 ? 8 : -8;

            Body.setVelocity(ball, { x: 8, y: ball.velocity.y });
          }
          if (bodyA === magentaball || bodyB === magentaball) {
            emitColorChange('magenta');
            ball.velocity.y = ball.velocity.y > 0 ? 8 : -8;

            Body.setVelocity(ball, { x: 8, y: ball.velocity.y });
          }
          if (bodyA === redball || bodyB === redball) {
            emitColorChange('red');
            ball.velocity.y = ball.velocity.y > 0 ? 8 : -8;

            Body.setVelocity(ball, { x: 8, y: ball.velocity.y });
          }
          if (bodyA === tanball || bodyB === tanball) {
            emitColorChange('tan');
            ball.velocity.y = ball.velocity.y > 0 ? 8 : -8;

            Body.setVelocity(ball, { x: 8, y: ball.velocity.y });
          }
          if (
            (bodyA === walls[0] && bodyB === ball) ||
            (bodyB === walls[0] && bodyA === ball)
          ) {
            ball.velocity.y = ball.velocity.y > 0 ? 8 : -8;

            Body.setVelocity(ball, { x: 8, y: ball.velocity.y });
          }
          if (
            (bodyA === walls[1] && bodyB === ball) ||
            (bodyB === walls[1] && bodyA === ball)
          ) {
            ball.velocity.y = ball.velocity.y > 0 ? 8 : -8;

            Body.setVelocity(ball, { x: 8, y: ball.velocity.y });
          }
          if (
            (bodyA === walls[2] && bodyB === ball) ||
            (bodyB === walls[2] && bodyA === ball)
          ) {
            player2Score++;
            emitScoreUpdate();
            resetBallPosition();
          }
          if (
            (bodyA === walls[3] && bodyB === ball) ||
            (bodyB === walls[3] && bodyA === ball)
          ) {
            player1Score++;
            emitScoreUpdate();
            resetBallPosition();
          }
          if (
            player1Score >= 10 ||
            player2Score >= 10 ||
            player1.connected === false ||
            player2.connected === false
          ) {
            if (player1.connected === false) {
              player1Score = 0;
              player2Score = 10;
            }
            if (player2.connected === false) {
              player1Score = 10;
              player2Score = 0;
            }
            isGameOver = true;
            Runner.stop(runner);
            Engine.clear(engine);
            World.clear(engine.world, false);
            const updateRankStats = (
              winnerID,
              winnerScore,
              winnerPoints,
              winnerStatus,
              loserID,
              loserScore,
              loserPoints,
              loserStatus,
            ) => {
              this.userService.updateUserRankStats(
                {
                  id: winnerID,
                  score: winnerScore,
                  points: winnerPoints,
                  userStatus: winnerStatus,
                },
                {
                  id: loserID,
                  score: loserScore,
                  points: loserPoints,
                  userStatus: loserStatus,
                },
                isRanked ? Mode.RANKED : Mode.CLASSIC,
              );
            };
            if (isRanked) {
              if (player1Score > player2Score) {
                updateRankStats(
                  player2.user.id,
                  player2Score,
                  10,
                  true,
                  player1.user.id,
                  player1Score,
                  -5,
                  false,
                );
                updateRankStats(
                  player1.user.id,
                  player1Score,
                  -5,
                  false,
                  player2.user.id,
                  player2Score,
                  10,
                  true,
                );
              } else {
                updateRankStats(
                  player2.user.id,
                  player2Score,
                  -5,
                  false,
                  player1.user.id,
                  player1Score,
                  10,
                  true,
                );
                updateRankStats(
                  player1.user.id,
                  player1Score,
                  10,
                  true,
                  player2.user.id,
                  player2Score,
                  -5,
                  false,
                );
              }
            }
            this.userService.updateUserStatus(player1.user.id, 'ONLINE');
            this.userService.updateUserStatus(player2.user.id, 'ONLINE');
            if (player1.connected) {
              player2
                .to(player1.user.id)
                .emit('game-over', { user: player1.user });
              player1.disconnect();
            }
            if (player2.connected) {
              player1
                .to(player2.user.id)
                .emit('game-over', { user: player2.user });
              player2.disconnect();
            }
          }
        }
      });
    }
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
