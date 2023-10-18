import { Injectable } from '@nestjs/common';
import { Engine, World, Bodies, Body, Runner, Events } from 'matter-js';
import QueueItem from '../interfaces/Queue.interface';
import { UserService } from '@/game/services/getFriend.service';

@Injectable()
export class GameStarterService {
  constructor(private userService: UserService) {}
  async startGame(player1: QueueItem, player2: QueueItem, isRanked: boolean) {
    player1.client.on('disconnect', () => {
      console.log(' player1 disconnected');
      player2Score = 10;
      player2.client.emit('update-score', {
        myScore: player2Score,
        oppScore: 0,
      });
    });
    player2.client.on('disconnect', () => {
      console.log(' player2 disconnected');
      player1Score = 10;
      player1.client.emit('update-score', {
        myScore: player1Score,
        oppScore: 0,
      });
    });
    await this.delay(5060);
    let player1Score = 0;
    let player2Score = 0;
    const isGameOver = false;
    player1.client.emit('update-opponent-position', { x: 325, y: 735 });
    player1.client.emit('update-player-position', { x: 325, y: 15 });
    player2.client.emit('update-player-position', { x: 325, y: 735 });
    player2.client.emit('update-opponent-position', { x: 325, y: 15 });
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

    const playerPaddle = Bodies.rectangle(325, 15, 150, 20, {
      isStatic: true,
    });

    const opponentPaddle = Bodies.rectangle(325, 735, 150, 20, {
      isStatic: true,
    });
    const walls = [
      createWall(0, 375, 1, 750, true, 1),
      createWall(650, 375, 1, 750, true, 1),
      createWall(325, 0, 650, 1, true),
      createWall(325, 750, 650, 1, true),
    ];
    World.add(engine.world, [ball, playerPaddle, opponentPaddle, ...walls]);
    const runner = Runner.create();
    Runner.run(runner, engine);
    Events.on(engine, 'beforeUpdate', () => {
      const ballPosition = {
        x: ball.position.x,
        y: ball.position.y,
      };
      player1.client.emit('update-ball-position', ballPosition);
      player2.client.emit('update-ball-position', ballPosition);
    });

    player1.client.on('update-player-position', (position) => {
      player1.client.emit('update-player-position', position);
      Body.setPosition(playerPaddle, position);
      player2.client.emit('update-opponent-position', position);
    });
    player2.client.on('update-player-position', (position) => {
      player2.client.emit('update-player-position', position);
      Body.setPosition(opponentPaddle, position);

      player1.client.emit('update-opponent-position', position);
    });
    Body.applyForce(
      ball,
      { x: ball.position.x, y: ball.position.y },
      { x: 0.004, y: -0.004 },
    );
    if (!isGameOver) {
      Events.on(engine, 'collisionStart', (event) => {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i];
          if (
            (pair.bodyA === walls[2] && pair.bodyB === ball) ||
            (pair.bodyB === walls[2] && pair.bodyA === ball)
          ) {
            player2Score++;
            player1.client.emit('update-score', {
              myScore: player1Score,
              oppScore: player2Score,
            });
            player2.client.emit('update-score', {
              myScore: player2Score,
              oppScore: player1Score,
            });
            Body.setPosition(ball, { x: 325, y: 375 });
            player1.client.emit('update-ball-position', { x: 325, y: 375 });
            player2.client.emit('update-ball-position', { x: 325, y: 375 });
          }
          if (
            (pair.bodyA === walls[3] && pair.bodyB === ball) ||
            (pair.bodyB === walls[3] && pair.bodyA === ball)
          ) {
            player1Score++;
            player1.client.emit('update-score', {
              myScore: player1Score,
              oppScore: player2Score,
            });
            player2.client.emit('update-score', {
              myScore: player2Score,
              oppScore: player1Score,
            });
            Body.setPosition(ball, { x: 325, y: 375 });
            player1.client.emit('update-ball-position', { x: 325, y: 375 });
            player2.client.emit('update-ball-position', { x: 325, y: 375 });
          }
          if (player1Score >= 10 || player2Score >= 10) {
            Runner.stop(runner);
            Engine.clear(engine);
            World.clear(engine.world, false);
            if (isRanked) {
              if (player1Score > player2Score) {
                this.userService.updateUserRankStats(player1.user.id, 1, 0, 10);
                this.userService.updateUserRankStats(player2.user.id, 0, 1, -5);
              } else {
                this.userService.updateUserRankStats(player1.user.id, 0, 1, -5);
                this.userService.updateUserRankStats(player2.user.id, 1, 0, 10);
              }
            }
            if (player1.client.connected) {
              player1.client.emit('game-over', {
                user: player1.user,
              });
            }
            if (player2.client.connected) {
              player2.client.emit('game-over', {
                user: player2.user,
              });
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
