import { Injectable } from "@nestjs/common";
import { Namespace, Socket} from "socket.io";
import { Engine, World, Bodies, Body, Runner , Events} from "matter-js";

@Injectable()
export class GameStarterService {
	constructor() { }

	startGame(roomName: string, player1: Socket, player2: Socket) {
    const height = 750;
    const width = 650;
    let playerScore = 0;
    let opponentScore = 0;
    let isGameOver = false;
    let intervalStatus;
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    const createWall = (x: number, y: number, width: number, height: number, isStatic: boolean, restitution?: number) => {
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

    const sendBallPosition = () => {
      const ballPosition = {
        x: ball.position.x,
        y: ball.position.y,
      };
      player1.emit('updateBallPosition', ballPosition);
      player2.emit('updateBallPosition', ballPosition);
      console.log(ballPosition);
    };

    intervalStatus =  setInterval(sendBallPosition, 10);
    player1.on('updatePlayerPosition', (position) => {
      player1.emit('updatePlayerPosition', position);
      Body.setPosition(playerPaddle, position);
      player2.emit('updateOpponentPosition', position);
    });
    player2.on('updatePlayerPosition', (position) => {
      player2.emit('updatePlayerPosition', position);
      Body.setPosition(opponentPaddle, position)

      player1.emit('updateOpponentPosition', position);
    }
    );
    Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: 0.005, y: -0.005 });
    if(!isGameOver){
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (pair.bodyA === walls[2] && pair.bodyB === ball || pair.bodyB === walls[2] && pair.bodyA === ball) {
          playerScore++;
          player1.emit('updateScore', {myScore: playerScore,oppScore: opponentScore });
          player2.emit('updateScore', { myScore:opponentScore,oppScore: playerScore });
          Body.setPosition(ball, { x: 325, y: 375 });
          player1.emit('updateBallPosition', { x: 325, y: 375 });
          player2.emit('updateBallPosition', { x: 325, y: 375 });
        }
        if (pair.bodyA === walls[3] && pair.bodyB === ball || pair.bodyB === walls[3] && pair.bodyA === ball) {
          opponentScore++;
          player1.emit('updateScore', { myScore:playerScore,oppScore: opponentScore });
          player2.emit('updateScore', { myScore:opponentScore,oppScore: playerScore });
          Body.setPosition(ball, { x: 325, y: 375 });
          player1.emit('updateBallPosition', { x: 325, y: 375 });
          player2.emit('updateBallPosition', { x: 325, y: 375 });
        }
        if (playerScore >= 10 || opponentScore >= 10) {
          // stop the game
          clearInterval(intervalStatus);
          Runner.stop(runner);
          Engine.clear(engine);
          World.clear(engine.world, false);
          player1.emit('gameOver', { myScore:playerScore,oppScore: opponentScore });
          player2.emit('gameOver', { myScore:opponentScore,oppScore: playerScore });
          // i wanna stop startserver from running

        }
      }
    }
    );
    }
  }
}