import { Injectable } from '@nestjs/common';
import { Engine, World, Bodies, Body, Runner, Events } from 'matter-js';
import QueueItem from '../interfaces/Queue.interface';

@Injectable()
export class GameStarterService {
  async startGame(player1: QueueItem, player2: QueueItem) {
    await this.delay(5040, player1, player2);
    let player1Score = 0;
    let player2Score = 0;
    const isGameOver = false;
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
      player1.client.emit('updateBallPosition', ballPosition);
      player2.client.emit('updateBallPosition', ballPosition);
    });

    player1.client.on('updatePlayerPosition', (position) => {
      player1.client.emit('updatePlayerPosition', position);
      Body.setPosition(playerPaddle, position);
      player2.client.emit('updateOpponentPosition', position);
    });
    player2.client.on('updatePlayerPosition', (position) => {
      player2.client.emit('updatePlayerPosition', position);
      Body.setPosition(opponentPaddle, position);

      player1.client.emit('updateOpponentPosition', position);
    });
    Body.applyForce(
      ball,
      { x: ball.position.x, y: ball.position.y },
      { x: 0.005, y: -0.005 },
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
            player1.client.emit('updateScore', {
              myScore: player1Score,
              oppScore: player2Score,
            });
            player2.client.emit('updateScore', {
              myScore: player2Score,
              oppScore: player1Score,
            });
            Body.setPosition(ball, { x: 325, y: 375 });
            player1.client.emit('updateBallPosition', { x: 325, y: 375 });
            player2.client.emit('updateBallPosition', { x: 325, y: 375 });
          }
          if (
            (pair.bodyA === walls[3] && pair.bodyB === ball) ||
            (pair.bodyB === walls[3] && pair.bodyA === ball)
          ) {
            player1Score++;
            player1.client.emit('updateScore', {
              myScore: player1Score,
              oppScore: player2Score,
            });
            player2.client.emit('updateScore', {
              myScore: player2Score,
              oppScore: player1Score,
            });
            Body.setPosition(ball, { x: 325, y: 375 });
            player1.client.emit('updateBallPosition', { x: 325, y: 375 });
            player2.client.emit('updateBallPosition', { x: 325, y: 375 });
          }
          if (player1Score >= 5 || player2Score >= 5) {
            Runner.stop(runner);
            Engine.clear(engine);
            World.clear(engine.world, false);
            if (player1Score > player2Score) {
              player1.user.resoult = 'Winner';
              player2.user.resoult = 'Loser';
            } else {
              player1.user.resoult = 'Loser';
              player2.user.resoult = 'Winner';
            }
            console.log('Game over');

            player1.client.emit('gameOver', {
              user: player1.user,
              opp: player2.user,
            });
            player2.client.emit('gameOver', {
              user: player2.user,
              opp: player1.user,
            });
          }
        }
      });
    }
  }
  private delay(ms: number, player1: QueueItem, player2: QueueItem) {
    player1.client.emit('updateOpponentPosition', { x: 325, y: 735 });
    player1.client.emit('updatePlayerPosition', { x: 325, y: 15 });
    player2.client.emit('updatePlayerPosition', { x: 325, y: 735 });
    player2.client.emit('updateOpponentPosition', { x: 325, y: 15 });
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
