---
title: "Game Theory Basics: Why Smart Choices Can Backfire"
pubDate: 2026-10-14
description:
  "Why individually rational choices can leave everyone worse off: players,
  strategies, the prisoner's dilemma, Nash equilibrium, and how changing
  incentives changes outcomes."
tags: ["mathematics", "economics"]
lang: "en"
isDraft: true
snippet:
  language: "markdown"
  code: |
    Players → Strategies → Outcomes
    Your best choice depends on what others do.
---

Two suspects each do the sensible thing, and both end up worse off. The same
trap catches rival firms in price wars and countries in arms races. Game theory
explains why, and it points to a fix: **what works best for you depends on what
others do**, so the way out is to change the incentives, not to ask people to
behave better.

A company deciding whether to lower its prices must consider how its competitors
will respond. A country negotiating a trade agreement must anticipate what other
countries will accept. Even friends choosing where to eat face a small strategic
problem: the outcome depends on several people's preferences and decisions.
**Game theory** is the mathematical study of this kind of strategic interaction.

In game theory, a "game" does not have to involve cards, a board, or a sporting
event. It can be any situation in which participants—called _players_—make
choices that affect one another's outcomes. To analyze it, we identify the
players, the strategies available to them, and the rewards or costs associated
with different combinations of choices. We also consider what each player knows
and whether decisions happen simultaneously or in sequence.

## Every game has players, strategies, payoffs and timing

Every game, however complicated, is built from the same four pieces:

1. **Players**: the decision makers. They can be people, firms, governments, or
   even animals and algorithms.
2. **Strategies**: the complete plans of action available to each player. In the
   simplest games a strategy is a single choice, such as "cooperate" or
   "defect".
3. **Payoffs**: a number for each player and each combination of strategies,
   describing how much that player likes the outcome. Payoffs can be money,
   time, reputation, or plain satisfaction. Only the ordering and the relative
   size matter.
4. **Information and timing**: who knows what, and who moves when.

The last piece splits games into two broad families. In a **simultaneous game**,
players choose without seeing each other's move, as in rock-paper-scissors or
two firms setting prices on the same morning. In a **sequential game**, players
take turns and later movers see what happened earlier, as in chess or a
negotiation with offers and counteroffers. The tools differ, but the question is
the same: given what the others will do, what should I do?

A simultaneous game with two players is usually written as a table called the
**payoff matrix**. Rows are one player's strategies, columns are the other's,
and each cell lists the payoffs as (row player, column player).

## Rational players can all end up worse off

The dilemma first appeared in the early 1950s, in experiments on how people
choose when their interests conflict (Flood, 1952). It later became a standard
model for the Cold War arms race.

One of the field's most revealing insights is that individually reasonable
decisions can produce collectively disappointing results. The classic example is
the **prisoner's dilemma**.

Two suspects are arrested and held in separate rooms. Each can stay silent
(cooperate with the other suspect) or betray the other (defect). The sentences,
in years, are:

|                    | B stays silent | B betrays  |
| ------------------ | -------------- | ---------- |
| **A stays silent** | A: 1, B: 1     | A: 3, B: 0 |
| **A betrays**      | A: 0, B: 3     | A: 2, B: 2 |

Fewer years is better. Now reason as player A:

- If B stays silent, betraying gives me 0 years instead of 1. Betraying is
  better.
- If B betrays, betraying gives me 2 years instead of 3. Betraying is better.

Whatever B does, betraying is the better reply. A strategy with this property is
called a **dominant strategy**. B reasons identically, so both betray and both
serve 2 years. Yet if both had stayed silent, each would have served only

1. Each player's choice is rational, and together they produce an outcome both
   dislike.

This is not just a story about prisoners. The same structure appears whenever
individual incentives pull against the group:

- **Price wars.** Each firm gains by undercutting the other, but when both do,
  profits fall for everyone.
- **Shared resources.** Each fisher benefits from catching a little more, but if
  all do, the fishery collapses.
- **Arms races.** Each country is safer by arming if the other does, yet both
  spend heavily and end no safer than before.
- **Team projects.** Each member is tempted to do a little less, and the project
  suffers.

## A stable outcome is not always a good one

The prisoner's dilemma has a clear prediction, but most games do not have a
dominant strategy. We need a more general idea of a stable outcome. That idea is
the **Nash equilibrium**, named after the mathematician John Nash. It is a
combination of strategies in which no player can improve their outcome by
changing their own strategy alone.

To check an outcome, hold everyone else's choice fixed and ask each player,
"Would you switch?" If nobody wants to, the outcome is an equilibrium. In the
prisoner's dilemma, (betray, betray) is the only one: if A switches to silence
while B betrays, A's sentence grows from 2 years to 3. The outcome (silent,
silent) is not an equilibrium, because from there either player gains by
betraying.

An equilibrium can be stable in this sense without being fair, efficient, or
desirable. The prisoner's dilemma shows this clearly: its equilibrium is worse
for both players than another available outcome.

Some games have more than one equilibrium. Consider two friends who want to
spend the evening together but cannot communicate. One prefers the cinema, the
other prefers a concert, and both prefer being together over being apart:

|                | B: cinema  | B: concert |
| -------------- | ---------- | ---------- |
| **A: cinema**  | A: 2, B: 1 | A: 0, B: 0 |
| **A: concert** | A: 0, B: 0 | A: 1, B: 2 |

Both (cinema, cinema) and (concert, concert) are equilibria: once you are there,
neither of you gains by leaving alone. Theory alone does not say which one will
occur. Players need something outside the matrix, such as a habit, a convention,
or a conversation, to coordinate. Games of this kind explain why societies
settle on conventions like driving on the right.

Other games, such as rock-paper-scissors, have no equilibrium in pure
strategies, because any fixed choice can be exploited. Nash proved that every
finite game has an equilibrium once players are allowed to _randomize_. In
rock-paper-scissors, it is to play each option one third of the time.

## Repetition, reputation and rules make cooperation pay

If the prisoner's dilemma were the whole story, cooperation would be rare. Yet
people and organizations cooperate all the time. Game theory explains why by
changing the game:

- **Repetition.** If the same players meet again and again, betrayal today can
  be punished tomorrow. In 1980, the political scientist Robert Axelrod invited
  researchers to submit strategies for a repeated prisoner's dilemma tournament,
  then ran a second, larger one. Both times the winner was the simplest entry,
  _tit for tat_ (submitted by the mathematician Anatol Rapoport): cooperate
  first, then copy the opponent's previous move. It is friendly, firm, and
  forgiving (Axelrod, 1980a; 1980b). Axelrod and the biologist William Hamilton
  later showed that the same logic lets cooperation evolve among self-interested
  individuals in nature (Axelrod & Hamilton, 1981).
- **Reputation.** When others observe how you behave, a betrayal costs you
  future partners.
- **Enforceable agreements.** Contracts, laws, and regulations change the
  payoffs, making betrayal expensive.
- **Communication and trust.** Credible promises can move players toward a
  better equilibrium, especially in coordination games.

Repetition has a weakness: mistakes. If two tit-for-tat players misread or slip
once, they can fall into a chain of retaliation. Wu and Axelrod (1995) studied
this noisy version of the game and found that a little generosity or contrition
helps players recover cooperation. Real relationships need the same margin for
error.

The lesson is practical. If an outcome is bad because of the incentives, asking
people to behave better is rarely enough. Change the incentives, and the
equilibrium changes with them.

## Models simplify people, but they still explain incentives

Game theory is therefore about much more than winning. It helps us examine
competition, cooperation, negotiation, and trust. Its models simplify human
behavior, so they cannot predict every decision. Real people are not always
perfectly rational, they care about fairness, and they often misjudge what
others know. Behavioral economics studies exactly these gaps.

But the models offer a useful starting point: to understand a choice, look
beyond the person making it and consider the incentives and choices of everyone
involved.

## Change the incentives and the outcome changes

- A game has players, strategies, payoffs, and rules about information and
  timing.
- A payoff matrix summarizes a simultaneous two-player game.
- A dominant strategy is best no matter what the others do.
- A Nash equilibrium is a set of strategies where nobody gains by deviating
  alone. It may be inefficient, and a game may have several.
- In the prisoner's dilemma, rational individuals reach an outcome that is worse
  for all. Repetition, reputation, and enforceable rules can help them escape
  it.

If an outcome is bad because of the incentives, asking people to behave better
is rarely enough. Change the incentives, and the equilibrium changes with them.

## Recommended

- [Once you understand game theory, you understand the world](https://www.youtube.com/watch?v=mScpHTIi-kM),
  by Veritasium. A video introduction to the same ideas, if you prefer to watch
  rather than read.
- [The Evolution of Trust](https://ve42.co/Case2023), an interactive game by
  Nicky Case. Play the repeated prisoner's dilemma against different strategies,
  including tit for tat.
- [Tit for Tat](https://ve42.co/T4T) and
  [The Golden Rule](https://ve42.co/GoldenRule), two Radiolab episodes on
  cooperation.

## References

- Axelrod, R. (1984). _The Evolution of Cooperation_. Basic Books.
- Axelrod, R. (1980). Effective choice in the prisoner's dilemma. _Journal of
  Conflict Resolution_, 24(1), 3–25. <https://ve42.co/Axelrod1980a>
- Axelrod, R. (1980). More effective choice in the prisoner's dilemma. _Journal
  of Conflict Resolution_, 24(3), 379–403. <https://ve42.co/Axelrod1980b>
- Axelrod, R., & Hamilton, W. D. (1981). The evolution of cooperation.
  _Science_, 211(4489), 1390–1396. <https://ve42.co/Axelrod1981>
- Wu, J., & Axelrod, R. (1995). How to cope with noise in the iterated
  prisoner's dilemma. _Journal of Conflict Resolution_, 39(1), 183–189.
  <https://ve42.co/Wu1995>
- Flood, M. M. (1952). Some experimental games. <https://ve42.co/Flood1952>
- Poundstone, W. (1992). _Prisoner's Dilemma_. Doubleday.
- Binmore, K. (2007). _Game Theory: A Very Short Introduction_. Oxford
  University Press.
- Dawkins, R. (2016). _The Selfish Gene_. Oxford University Press.
- Nowak, M. A., & Highfield, R. (2011). _SuperCooperators_. Canongate.
- Prisoner's dilemma, [Wikipedia](https://ve42.co/WikiPD) and
  [Stanford Encyclopedia of Philosophy](https://ve42.co/StanfordPD).
