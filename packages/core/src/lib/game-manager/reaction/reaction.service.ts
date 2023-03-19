import { GuessStatus, ReactionStatus } from '@reaxion/common';
import { ISettings } from '@reaxion/common/interfaces';
import { v4 as uuid4 } from 'uuid';
import { UndefinedReactionError } from '../errors';
import { AddGuessStatus } from '../game-manager';
import { Reaction } from './reaction';
export class ReactionService {
  public reaction: Reaction | undefined;
  constructor(protected settings: ISettings) {}

  public withReaction(reaction: Reaction): ReactionService {
    this.reaction = reaction;
    return this;
  }
  public guessIsRight(guess: number) {
    if (!this.reaction) throw new UndefinedReactionError();
    const delta = Math.abs(this.reaction.duration - guess);
    return delta <= this.settings.difficulty.deviation;
  }
  public calculateGuessDeviationStatus(guess: number): AddGuessStatus {
    if (!this.reaction) throw new UndefinedReactionError();
    if (this.guessIsRight(guess)) return 'GUESS_VALID';
    else
      return guess < this.reaction.duration
        ? 'GUESS_INVALID_LOW'
        : 'GUESS_INVALID_HIGH';
  }

  public createReactionWithRandomDuration() {
    const duration = Math.ceil(
      Math.random() * this.settings.difficulty.maxDuration
    );
    const id = uuid4();

    return new Reaction(
      id,
      duration,
      [],
      false,
      GuessStatus.IS_WAITING,
      ReactionStatus.HAS_NOT_STARTED
    );
  }
}
