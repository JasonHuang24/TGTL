/**
 * Phase 3 card density (blueprint 3.0 §11.4). Authored via a fan-out workflow —
 * one agent per act — then adversarially safety-verified per card, validated
 * against the registries (skills, conditions, flags, gauges, families, bands), and
 * reviewed by the executor against the crisis/loss domains (§7.1 human review pass).
 * Same schema and rules as the base pool; adds replay variety (each run samples a
 * different subset of a larger act pool).
 */
import type { DecisionCard } from "@/content/play/schema";

export const DENSITY_CARDS: DecisionCard[] = [
  {
    "id": "card-tutorial-responsibility",
    "act": 3,
    "family": "home",
    "mechanicLink": "recovery",
    "recoveryCard": true,
    "setup": "You begged for the pet, and now it's yours to feed and walk and clean up after — every day, including the days you're bored of it. Nobody's watching closely. The care is real, and so is how dull it gets by the second week.",
    "options": [
      {
        "id": "opt-let-it-slide",
        "label": "let the care slide on the dull days",
        "chips": {
          "costs": [
            "the pet's day, which it can't ask about",
            "a small habit of dropping things"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Someone quietly covers for you and nothing goes wrong. You learn, wrongly, that the job does itself — a lesson that bills you later.",
              "effects": {}
            }
          },
          {
            "name": "mixed",
            "weight": 2,
            "outcome": {
              "line": "The dull days win more often than not. Nothing dramatic, just a small thing you said you'd tend, half-tended.",
              "effects": {}
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "It slides far enough that someone has to step in, and the trust you were handed shrinks a little. Reliability is quiet until it's missing.",
              "effects": {
                "gauge": {
                  "connection": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-keep-it-up",
        "label": "do it even when it's boring",
        "chips": {
          "costs": [
            "small pieces of every single day",
            "the boring middle of a thing"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "sticks-with-hard-things"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You keep at it past the point it stopped being fun, and something steadies in you. Following through on the dull part is most of what following through means.",
              "effects": {
                "skills": [
                  "sticks-with-hard-things"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "Some days you nearly skip and don't. Not heroic — just kept. The pet is fed and you're a fraction more someone who does what they said.",
              "effects": {}
            }
          }
        ]
      },
      {
        "id": "opt-ask-a-system",
        "label": "when it's too much, ask to share days or set a routine",
        "chips": {
          "costs": [
            "admitting it's more than you reckoned"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "skill": "asks-for-help"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You say it's a lot and rework it — a shared day here, a reminder there — and the care holds because the plan finally fits you. Regrouping isn't quitting.",
              "effects": {
                "skills": [
                  "asks-for-help",
                  "recovers-fast"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "The grown-ups help you build a rhythm you can actually keep. The thing gets done, and you keep the part that was yours to keep.",
              "effects": {
                "skills": [
                  "asks-for-help"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-tutorial-contest",
    "act": 3,
    "family": "school",
    "mechanicLink": "readout",
    "setup": "You and a good friend both went for the same thing — a spot, a ribbon, a place at the top of a small contest — and they came out ahead of you. It stings twice: once because you didn't, and once because it was them.",
    "options": [
      {
        "id": "opt-quit-it",
        "label": "take the placing as the verdict and drop it",
        "chips": {
          "costs": [
            "a thing you liked, given up over one day"
          ],
          "variance": "moderate",
          "reversibility": "costly to undo"
        },
        "bands": [
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You walk away and the sting fades, and so does something you enjoyed before it had a scoreboard. Sometimes that's fine; sometimes it's a small surrender you won't notice for years.",
              "effects": {}
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "You quit the thing you loved because a single measure on a single day told you to. The ranking graded one afternoon; you handed it your whole verdict.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-keep-for-love",
        "label": "keep at it because you like it, not the ribbon",
        "chips": {
          "costs": [
            "letting the ribbon go to someone else, and being fine with it"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "skill": "recovers-fast"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You go back to it for the reason you started, and the ranking loses its grip. Protecting why you do a thing from how it's scored is a quiet, lifelong skill.",
              "effects": {
                "skills": [
                  "recovers-fast",
                  "sticks-with-hard-things"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "It's a little sore for a while, then it isn't. You keep the thing and let the placing be the placing. Your friend did well; so can you.",
              "effects": {
                "relationships": [
                  {
                    "id": "rel-childhood-friend",
                    "label": "a childhood friend",
                    "quality": 1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-look-what-measured",
        "label": "ask what the placing actually measured",
        "chips": {
          "costs": [
            "a moment of looking like the loss got to you"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "reads-the-fine-print"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You find out it scored one narrow slice on one particular day — not talent, not you. Knowing what a mark can and can't see is worth more than the mark.",
              "effects": {
                "skills": [
                  "reads-the-fine-print"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "The answer is vague, but the asking reframes it. A placing is a snapshot, not a sentence, and you just practised remembering that.",
              "effects": {}
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-tutorial-belonging",
    "act": 3,
    "family": "people",
    "mechanicLink": "party",
    "setup": "A group at school has a warm inside and a cold edge, and lately there's one kid left standing on the cold edge of it. Going along with the group is the easy, frictionless thing. You can feel where the line is.",
    "options": [
      {
        "id": "opt-go-along",
        "label": "stay comfortable inside the group",
        "chips": {
          "costs": [
            "a small piece of who you want to be",
            "someone left out, on your watch"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Nothing happens to you; the warmth stays yours. The cost is off to the side, easy not to look at, which is exactly how it stays cheap.",
              "effects": {}
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "The edge gets colder and you were part of the wall. No single day of going along is the harm; standing there while it hardens is.",
              "effects": {
                "gauge": {
                  "connection": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-cross-over",
        "label": "go stand with the one on the edge",
        "chips": {
          "costs": [
            "being, for an afternoon, on the edge yourself"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "reads-a-room"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You cross over without making a speech of it, and the cold edge is a little warmer for two. Kindness that costs you something is the kind people remember.",
              "effects": {
                "skills": [
                  "steadies-others",
                  "reads-a-room"
                ],
                "relationships": [
                  {
                    "id": "rel-left-out-kid",
                    "label": "a kid others overlooked",
                    "quality": 1
                  }
                ],
                "gauge": {
                  "connection": 1
                }
              }
            }
          },
          {
            "name": "mixed",
            "weight": 2,
            "outcome": {
              "line": "It's awkward and half the group notices and it's fine anyway. You spent a little standing to buy someone an easier day. Worth it.",
              "effects": {
                "relationships": [
                  {
                    "id": "rel-left-out-kid",
                    "label": "a kid others overlooked",
                    "quality": 1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-find-your-few",
        "label": "quietly build a couple of real ties instead",
        "chips": {
          "costs": [
            "the buzz of the popular table, let go"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "skill": "keeps-a-network"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You stop auditioning for the big group and put your time into a few people who show up for you. A handful of real ties outlasts any crowd's warmth.",
              "effects": {
                "skills": [
                  "keeps-a-network"
                ],
                "gauge": {
                  "connection": 1
                }
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "The group's approval stops running your afternoons. You trade a wide, thin belonging for a narrow, sturdy one — and sleep easier for it.",
              "effects": {
                "skills": [
                  "keeps-a-network"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-tutorial-ownup",
    "act": 3,
    "family": "inner",
    "setup": "You broke something you weren't supposed to touch, and so far nobody knows it was you. There's a version of the next hour where you just... don't say. The thing is fixable. What's harder to fix is which kind of person this small moment quietly makes you.",
    "options": [
      {
        "id": "opt-hide-it",
        "label": "say nothing and hope it blows over",
        "chips": {
          "costs": [
            "carrying a small secret",
            "a notch off the person you're becoming"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "It blows over. Nobody finds out and nothing breaks — except a tiny rehearsal of hiding, filed away where you'll reach for it again without noticing.",
              "effects": {}
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "It comes out later, and now it's two things: the breakage and the covering. The second one is what costs you; broken things are cheaper to replace than trust.",
              "effects": {
                "gauge": {
                  "connection": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-fix-quietly",
        "label": "try to fix it yourself before anyone notices",
        "chips": {
          "costs": [
            "a lot of effort spent on not being seen"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You patch it well enough to pass, and get away with it, and learn a slightly wrong lesson: that the goal was not-getting-caught rather than being straight.",
              "effects": {}
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "Your quiet fix makes it worse and now it's obvious someone tried to hide it. Hiding a mistake usually costs more than the mistake asked for.",
              "effects": {
                "gauge": {
                  "connection": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-own-up",
        "label": "go and say it was you, early",
        "chips": {
          "costs": [
            "a rough few minutes now",
            "the flush of admitting it"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "skill": "tells-the-truth-early"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You say it plainly before you're found out, and the trouble is smaller than the dread was. Told early, a mistake stays a mistake instead of becoming a lie.",
              "effects": {
                "skills": [
                  "tells-the-truth-early"
                ],
                "gauge": {
                  "connection": 1
                }
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "It's uncomfortable and then it's over, and someone helps you put it right. You file away that owning it early is the cheap door, not the brave one.",
              "effects": {
                "skills": [
                  "tells-the-truth-early",
                  "asks-for-help"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-adolescence-firstjob",
    "act": 4,
    "family": "work",
    "mechanicLink": "party",
    "setup": "Your first real job — a paycheck with your name on it and strangers who don't care that you're new. You can throw yourself in and become someone they rely on, clock the hours and keep it separate, or ask an old hand how the place really runs.",
    "options": [
      {
        "id": "opt-throw-in",
        "label": "throw yourself in; become reliable",
        "chips": {
          "costs": [
            "evenings",
            "caring about a place that may not care back"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "reads-a-room"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You become the one they trust with the hard shift, and someone there vouches for you later, unasked. First jobs are where you learn that being reliable travels.",
              "effects": {
                "skills": [
                  "keeps-a-network"
                ],
                "gauge": {
                  "connection": 1
                }
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "The work is dull and you do it well anyway. Nobody throws a parade, but a quiet reputation for showing up is being built where you can't see it.",
              "effects": {
                "skills": [
                  "sticks-with-hard-things"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "You pour yourself in and they take it for granted, then trim your hours when it suits them. The effort wasn't wasted; the lesson about where loyalty gets returned was expensive.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-clock-hours",
        "label": "clock the hours, keep it separate",
        "chips": {
          "costs": [
            "a slower start at being known"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You give the job the hours it pays for and keep the rest of yourself. It's a fair trade, and there's nothing wrong with a job that's only a job.",
              "effects": {}
            }
          },
          {
            "name": "mixed",
            "weight": 2,
            "outcome": {
              "line": "You stay a stranger there and miss the ties the place might have grown. Not every job is worth more than its wage — but you'll wonder about this one.",
              "effects": {}
            }
          }
        ]
      },
      {
        "id": "opt-learn-the-ropes",
        "label": "ask an old hand how the place really runs",
        "chips": {
          "costs": [
            "admitting you don't know the unwritten rules"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "An old hand tells you which corners are safe to cut and which manager to never surprise. The written rules were never the whole map, and asking early spares you the hard way.",
              "effects": {
                "skills": [
                  "asks-for-help",
                  "reads-the-fine-print"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "You get a shrug and a half-answer, but you asked — and asking marks you as someone who wants to do the thing right.",
              "effects": {
                "skills": [
                  "asks-for-help"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-adolescence-becoming",
    "act": 4,
    "family": "inner",
    "mechanicLink": "variance",
    "setup": "You've figured out something about who you are, and now there's the question of showing it — a look, a name, a way of speaking that's finally yours. Wear it out loud and it might be met with open arms, or with a hard week.",
    "options": [
      {
        "id": "opt-out-loud",
        "label": "wear it out loud",
        "chips": {
          "costs": [
            "exposure",
            "the people who liked the old version"
          ],
          "variance": "wide",
          "reversibility": "reversible",
          "positionNotes": [
            {
              "when": "strong-ties",
              "text": "With people who'd catch you, this is a bounded experiment — the worst week is still a week among friends."
            },
            {
              "when": "thin-ties",
              "text": "Without a circle underneath you, the same step lands harder; find one or two who'll hold before you go wide."
            }
          ]
        },
        "sensitivity": {
          "skill": "reads-a-room",
          "penaltyFlags": [
            "thin-ties"
          ]
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "It's met with more welcome than you braced for, and the relief of being seen as yourself is enormous. You learn the specific freedom of not performing a role that never fit.",
              "effects": {
                "skills": [
                  "reads-a-room"
                ],
                "gauge": {
                  "connection": 1
                }
              }
            }
          },
          {
            "name": "mixed",
            "weight": 2,
            "outcome": {
              "line": "Some come with you, some cool off, and you find out who your people actually were. The version of you underneath is realer now, whatever the room decided.",
              "effects": {
                "skills": [
                  "tells-the-truth-early"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 2,
            "failure": true,
            "outcome": {
              "line": "It draws a hard week — some cold shoulders, some noise — and then it passes. It was still the true thing; a sound choice can meet a bad room.",
              "effects": {
                "gauge": {
                  "connection": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-test-small",
        "label": "try it first with the people who are safe",
        "chips": {
          "costs": [
            "a slower, quieter reveal"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You show the truer version to a couple of trusted people first, and their easy welcome gives you a floor to go wider on your own clock. Small and reversible before bold.",
              "effects": {
                "skills": [
                  "asks-for-help"
                ],
                "gauge": {
                  "connection": 1
                }
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "It stays private a while longer, which is its own kind of fine. A thing doesn't have to be announced to be true.",
              "effects": {}
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-adolescence-callout",
    "act": 4,
    "family": "people",
    "mechanicLink": "recovery",
    "recoveryCard": true,
    "setup": "Something you said landed wrong and travelled — a clumsy moment that's now the thing people are talking about. The stumble is already done. What's still yours to decide is the next few days, not the moment that started it.",
    "options": [
      {
        "id": "opt-dig-in",
        "label": "dig in and wait for it to blow over",
        "chips": {
          "costs": [
            "the truth of it, left unsaid"
          ],
          "variance": "moderate",
          "reversibility": "costly to undo"
        },
        "bands": [
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "It blows over, mostly, because these things do. You also learn nothing from it and pick up a small habit of digging in when you're wrong. It cost less than it taught.",
              "effects": {}
            }
          },
          {
            "name": "poor",
            "weight": 2,
            "failure": true,
            "outcome": {
              "line": "Digging in makes it the story for longer, and the version that sticks is the defensive one. Doubling down on a stumble usually deepens the hole it's meant to cover.",
              "effects": {
                "gauge": {
                  "connection": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-own-it",
        "label": "own it plainly, once, then let it settle",
        "chips": {
          "costs": [
            "a hard, exposed few minutes"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "skill": "tells-the-truth-early"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You say the plain, un-defensive true thing once, then stop explaining. It deflates fast, and people quietly file you as someone who can own a mistake. Recovery is a skill, not a mood.",
              "effects": {
                "skills": [
                  "tells-the-truth-early",
                  "recovers-fast"
                ],
                "gauge": {
                  "connection": 1
                }
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "It's awkward and it half-lands and the week stays uncomfortable. But you handled it like someone you'd want to be, and that's the part that keeps.",
              "effects": {
                "skills": [
                  "recovers-fast"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-endure-it",
        "label": "when it just has to be waited out, protect your floor and find who holds you",
        "chips": {
          "costs": [
            "accepting you can't hurry it"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "endurance"
        ],
        "supportLink": "/topics/relationships",
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Some stumbles have no clever fix — only days that have to pass. You keep your routines, stay off the noise, and let the few people who know you hold you through it.",
              "effects": {
                "skills": [
                  "asks-for-help"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 2,
            "outcome": {
              "line": "It stays uncomfortable, because it is, and it thins out on its own the way these things do. What you keep is proof that a bad week isn't the end of you.",
              "effects": {}
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-adolescence-firstwage",
    "act": 4,
    "family": "money",
    "setup": "Your own money for the first time, and a scene that costs money to be part of — the clothes, the nights out, the being-there. You can spend it into belonging now, or keep a little back that nobody will thank you for keeping.",
    "options": [
      {
        "id": "opt-spend-in",
        "label": "spend it into belonging",
        "chips": {
          "costs": [
            "the margin you don't feel until it's gone"
          ],
          "variance": "moderate",
          "reversibility": "reversible",
          "positionNotes": [
            {
              "when": "floor",
              "text": "With a floor at home behind you, spending it all is a small, recoverable mistake — the worst case is a lean fortnight."
            },
            {
              "when": "no-floor",
              "text": "Without a floor, this is the only slack you've got; spend it all and an ordinary shock has nothing under it."
            }
          ]
        },
        "sensitivity": {
          "gauge": "money",
          "penaltyFlags": [
            "no-floor"
          ]
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You buy your way into a good season of belonging, and the memories are real and worth having. Money spent on your people is rarely the money you end up regretting.",
              "effects": {
                "gauge": {
                  "connection": 1
                }
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You keep up, barely, and the being-broke hum sits under the fun. Belonging you have to buy again every week is a treadmill you can't yet see the length of.",
              "effects": {
                "gauge": {
                  "money": -1
                }
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "It runs out faster than you planned, and an ordinary bill lands with nothing behind it. The scramble teaches what a margin was for, the expensive way.",
              "effects": {
                "gauge": {
                  "money": -1
                }
              }
            }
          }
        ]
      },
      {
        "id": "opt-keep-margin",
        "label": "keep a little back",
        "chips": {
          "costs": [
            "passing on some of the fun",
            "no thanks for it"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "gauge": "money"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You spend some and keep a little, and the little you kept turns an unlucky week from a scramble into a shrug. The habit of a margin starts small and pays quietly for years.",
              "effects": {
                "gauge": {
                  "money": 1
                },
                "skills": [
                  "handles-money"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "You bank a bit and barely notice. It feels like nothing, which is exactly how keeping a margin is supposed to feel at this age.",
              "effects": {
                "skills": [
                  "handles-money"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-launch-firstlease",
    "act": 5,
    "family": "home",
    "mechanicLink": "position",
    "setup": "The first place that's yours to sign for. One apartment sits at the very top of what you can pay — bright, close to everything. Another is plain and cheaper, with room left over each month. The keys are right there.",
    "options": [
      {
        "id": "opt-take-the-top",
        "label": "take the top place",
        "chips": {
          "costs": [
            "your monthly cushion",
            "tight months with no give"
          ],
          "variance": "wide",
          "reversibility": "costly to undo",
          "positionNotes": [
            {
              "when": "no-floor",
              "text": "With no savings behind you, one bad month here becomes a move, not a scare."
            }
          ]
        },
        "sensitivity": {
          "gauge": "money",
          "penaltyFlags": [
            "no-floor"
          ],
          "strength": 0.7
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You love waking up here. Friends drift over, the neighborhood pulls you in, and for a while the rent feels like the price of a life you chose.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "flagsSet": [
                  "thin-margin"
                ],
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The place is lovely and the math is tight. One slow month and you're moving things around, skipping small comforts, watching the account like weather.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "healthEnergy": -1
                },
                "flagsSet": [
                  "thin-margin"
                ],
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "failure",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "A cut shift, a surprise bill, and the top of your budget becomes the edge of it. You're borrowing to stay, or packing boxes you just unpacked.",
              "effects": {
                "gauge": {
                  "money": -2,
                  "healthEnergy": -1,
                  "connection": -1
                },
                "flagsSet": [
                  "no-floor",
                  "thin-margin"
                ],
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-keep-the-floor",
        "label": "keep the cushion",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "the place you really wanted"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "Plain walls, money left at the end of the month. The cushion turns out to be the thing that lets you say yes — to a trip, a course, a slow week when you need one.",
              "effects": {
                "gauge": {
                  "money": 1,
                  "timeStructure": 1
                },
                "flagsSet": [
                  "floor"
                ],
                "conditionsSet": [
                  "steady-footing"
                ],
                "skills": [
                  "handles-money"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "It's fine. Not the view you wanted, but nothing here can tip you over. You build from a place that holds.",
              "effects": {
                "gauge": {
                  "money": 1
                },
                "flagsSet": [
                  "floor"
                ],
                "conditionsSet": [
                  "steady-footing"
                ],
                "skills": [
                  "handles-money"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The savings are real, and so is the ache of walking past the place you almost had. Some nights the plain rooms feel like settling.",
              "effects": {
                "gauge": {
                  "money": 1,
                  "connection": -1
                },
                "flagsSet": [
                  "floor"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-share-the-good-one",
        "label": "split the good one",
        "chips": {
          "costs": [
            "your own space",
            "depending on someone you barely know"
          ],
          "variance": "moderate",
          "reversibility": "costly to undo"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "The good place, split two ways. You land a roommate who becomes a real friend, and the rent stops being the thing you dread.",
              "effects": {
                "gauge": {
                  "money": 1,
                  "connection": 1
                },
                "relationships": [
                  {
                    "id": "rel-roommate",
                    "label": "a roommate",
                    "quality": 1
                  }
                ],
                "flagsSet": [
                  "floor"
                ],
                "skills": [
                  "reads-a-room"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You make the numbers work by sharing space with someone you barely know. Some weeks it's easy company, some weeks it's dishes and silence.",
              "effects": {
                "gauge": {
                  "money": 1
                },
                "relationships": [
                  {
                    "id": "rel-roommate",
                    "label": "a roommate",
                    "quality": -1
                  }
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "The split rent helps until they miss their share. Now you're covering both halves and choosing between the friendship and the floor.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "connection": -1
                },
                "flagsSet": [
                  "thin-margin"
                ],
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-launch-fineprint",
    "act": 5,
    "family": "money",
    "mechanicLink": "slack",
    "setup": "The help that got you here had fine print. What felt like a gift from family, or an easy line of credit, turns out to be a loan with a name and a due date. The first statement lands in your inbox.",
    "options": [
      {
        "id": "opt-read-every-line",
        "label": "read every line",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "an honest, heavy evening",
            "seeing the real number"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You map every rate and date onto one page. It's heavier than you hoped and clearer than you feared, and a plan you can actually follow takes shape.",
              "effects": {
                "gauge": {
                  "timeStructure": 1,
                  "healthEnergy": -1
                },
                "skills": [
                  "reads-the-fine-print",
                  "handles-money"
                ],
                "flagsSet": [
                  "floor"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You learn what you really owe. Knowing is its own kind of tired, but you stop flinching at the inbox and start chipping at the total.",
              "effects": {
                "gauge": {
                  "timeStructure": 1
                },
                "skills": [
                  "reads-the-fine-print"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The terms are worse than they were sold to you. You make a plan anyway, and it means a lean stretch you didn't choose.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "healthEnergy": -1
                },
                "skills": [
                  "reads-the-fine-print"
                ],
                "conditionsSet": [
                  "stretched-thin"
                ],
                "flagsSet": [
                  "thin-margin"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-pay-it-down-fast",
        "label": "pay it down fast",
        "chips": {
          "costs": [
            "your whole buffer",
            "lean months",
            "no room for surprises"
          ],
          "variance": "wide",
          "reversibility": "costly to undo"
        },
        "sensitivity": {
          "gauge": "money",
          "penaltyFlags": [
            "thin-margin"
          ],
          "strength": 0.7
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You attack the balance and it shrinks fast. Free of it sooner, you feel lighter — and you've learned you can hold a hard line.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "healthEnergy": -1
                },
                "skills": [
                  "sticks-with-hard-things",
                  "handles-money"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The balance drops and so does your buffer. You're free of one worry and one bad week away from the next.",
              "effects": {
                "gauge": {
                  "money": -1
                },
                "flagsSet": [
                  "thin-margin"
                ],
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "failure",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "You pour everything at the debt and leave nothing for the surprise that always comes. A broken phone, a missed shift, and you're borrowing again to cover the gap.",
              "effects": {
                "gauge": {
                  "money": -2,
                  "healthEnergy": -1
                },
                "flagsSet": [
                  "no-floor",
                  "thin-margin"
                ],
                "conditionsSet": [
                  "stretched-thin",
                  "run-down"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-ask-for-terms",
        "label": "ask to bend the terms",
        "chips": {
          "costs": [
            "an awkward ask",
            "owing someone a yes"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You ask the awkward question — can the terms bend? Sometimes people say yes. A longer runway, a paused month, and the weight eases.",
              "effects": {
                "gauge": {
                  "timeStructure": 1,
                  "connection": 1
                },
                "skills": [
                  "asks-for-help",
                  "tells-the-truth-early"
                ],
                "relationships": [
                  {
                    "id": "rel-lender",
                    "label": "someone who lent to you",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You ask, and the answer is a firm, kind no. Nothing changes but the fact that you faced it out loud.",
              "effects": {
                "skills": [
                  "asks-for-help"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "Asking family to bend the loan turns the money into a sore spot. They remember it differently than you do, and dinners get quieter.",
              "effects": {
                "gauge": {
                  "connection": -1
                },
                "relationships": [
                  {
                    "id": "rel-lender",
                    "label": "family who lent to you",
                    "quality": -1
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-launch-cityofstrangers",
    "act": 5,
    "family": "threshold",
    "mechanicLink": "party",
    "setup": "You take the job in a city where you know no one. The apartment echoes. The work is fine, but the evenings are long and the weekends are longer. Building a life here means building the people in it, from nothing.",
    "options": [
      {
        "id": "opt-say-yes-to-everything",
        "label": "say yes to everything",
        "chips": {
          "costs": [
            "your quiet evenings",
            "energy spread thin"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You say yes to the run club, the coworker's dinner, the neighbor's thing. Most fade, a few stick, and one becomes the friend who makes the city home.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "healthEnergy": -1
                },
                "skills": [
                  "keeps-a-network",
                  "reads-a-room"
                ],
                "relationships": [
                  {
                    "id": "rel-newfriend",
                    "label": "a new friend",
                    "quality": 2
                  }
                ],
                "flagsSet": [
                  "strong-ties"
                ],
                "conditionsSet": [
                  "well-tended"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You fill the calendar and still feel outside the glass. Faces you know, no one you'd call at midnight — the network is wide and thin.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "healthEnergy": -1
                },
                "skills": [
                  "keeps-a-network"
                ],
                "flagsSet": [
                  "thin-ties"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "You spread yourself across a scatter of half-friendships and run yourself down keeping up with all of them. None go deep, and you're tired.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                },
                "conditionsSet": [
                  "run-down"
                ],
                "flagsSet": [
                  "thin-ties"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-tend-a-few",
        "label": "tend a few",
        "chips": {
          "costs": [
            "the wider net you didn't cast"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You stop collecting and start showing up — same two people, every week. It grows slow and roots deep, the kind of tie you can lean your weight on.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "keeps-a-network",
                  "steadies-others"
                ],
                "relationships": [
                  {
                    "id": "rel-closefriend",
                    "label": "a close friend",
                    "quality": 2
                  }
                ],
                "flagsSet": [
                  "strong-ties"
                ],
                "conditionsSet": [
                  "well-tended"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "A small circle takes shape. Not many, but real. When something goes wrong, there's finally someone in this city to call.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "keeps-a-network"
                ],
                "flagsSet": [
                  "strong-ties"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You bet on a couple of people and one drifts away. The other stays, and you learn that going deep means it hurts more when it thins.",
              "effects": {
                "relationships": [
                  {
                    "id": "rel-closefriend",
                    "label": "a friend who drifts",
                    "quality": -1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-hold-the-old-ties",
        "label": "hold the old ties",
        "flags": [
          "endurance"
        ],
        "supportLink": "/topics/relationships",
        "chips": {
          "costs": [
            "a slower start here",
            "nights that stay quiet a while"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You keep the old voices close — the calls home, the far-away friend who still picks up. It doesn't fill the empty room, but it keeps you standing while the new city warms slowly.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "keeps-a-network"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The distance stretches the old ties thin. Time zones and busy lives mean the calls get shorter, and some nights the apartment is very quiet.",
              "effects": {
                "gauge": {
                  "connection": -1,
                  "healthEnergy": -1
                },
                "conditionsSet": [
                  "run-down"
                ],
                "flagsSet": [
                  "thin-ties"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-launch-firstmistake",
    "act": 5,
    "family": "work",
    "mechanicLink": "recovery",
    "recoveryCard": true,
    "setup": "Your first real job, and the first real mistake. A number you sent out was wrong, and it went up the chain before anyone caught it. Your manager wants to see you. The walk to their desk is the longest one yet.",
    "options": [
      {
        "id": "opt-own-it-early",
        "label": "own it early",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "a hard, honest hour",
            "your pride, briefly"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "tells-the-truth-early",
          "strength": 0.6
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You get there first — here's what I got wrong, here's how I'll fix it, here's how it won't happen twice. The mistake shrinks to its real size, and something like trust grows.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "tells-the-truth-early",
                  "recovers-fast"
                ],
                "relationships": [
                  {
                    "id": "rel-manager",
                    "label": "your manager",
                    "quality": 1
                  }
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You own it plainly. Your manager isn't thrilled, but they've seen worse and they notice you didn't flinch. You keep the job and a little standing.",
              "effects": {
                "skills": [
                  "tells-the-truth-early"
                ],
                "relationships": [
                  {
                    "id": "rel-manager",
                    "label": "your manager",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You tell the truth and it still stings. A closer eye on your work for a while, a lesson that lands in your stomach — but no lasting mark.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "timeStructure": -1
                },
                "skills": [
                  "tells-the-truth-early",
                  "recovers-fast"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-quietly-fix-it",
        "label": "quietly fix it",
        "chips": {
          "costs": [
            "carrying it alone",
            "the risk it surfaces"
          ],
          "variance": "wide",
          "reversibility": "locks in"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You catch it and quietly correct it downstream, and the wave passes without breaking. You got lucky, and you know it.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                }
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "The patch half-holds. Someone notices the seam, and now the story is the fix you hid, not the slip you made.",
              "effects": {
                "gauge": {
                  "connection": -1,
                  "healthEnergy": -1
                },
                "relationships": [
                  {
                    "id": "rel-manager",
                    "label": "your manager",
                    "quality": -1
                  }
                ]
              }
            }
          },
          {
            "name": "failure",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "It surfaces on its own, with your fingerprints on the cover-up. People forgive the slip faster than the hiding, and trust here gets slow to rebuild.",
              "effects": {
                "gauge": {
                  "connection": -1,
                  "healthEnergy": -1,
                  "timeStructure": -1
                },
                "relationships": [
                  {
                    "id": "rel-manager",
                    "label": "your manager",
                    "quality": -1
                  }
                ],
                "flagsSet": [
                  "thin-ties"
                ],
                "conditionsSet": [
                  "run-down"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-ask-what-to-do",
        "label": "ask someone first",
        "chips": {
          "costs": [
            "admitting it out loud",
            "owing a coworker one"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You pull aside the coworker who's been here longer. They've made this exact mistake, and they walk you through the fix and the conversation. You go in steadier.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "asks-for-help",
                  "reads-a-room"
                ],
                "relationships": [
                  {
                    "id": "rel-coworker",
                    "label": "a coworker",
                    "quality": 1
                  }
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The coworker means well but their advice is half-right. You go in with a plan that only partly fits, and improvise the rest on your feet.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                },
                "skills": [
                  "asks-for-help",
                  "recovers-fast"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-build-buyrent",
    "act": 6,
    "family": "home",
    "mechanicLink": "compounding",
    "setup": "Your thirties, and the big grown-up question lands: buy a place or keep renting. Buying puts your whole buffer into a deposit and locks you in, but it slowly builds something. Renting keeps you light and keeps the margin. The costs of each are on different clocks.",
    "options": [
      {
        "id": "opt-buy-place",
        "label": "stretch to buy the place",
        "chips": {
          "costs": [
            "the whole buffer, gone into the deposit",
            "upkeep you can't see coming",
            "being rooted to one spot"
          ],
          "variance": "wide",
          "reversibility": "costly to undo",
          "positionNotes": [
            {
              "when": "floor",
              "text": "With a buffer still behind the deposit, a rough month is an annoyance, and the thing you bought quietly compounds while you live in it."
            },
            {
              "when": "no-floor",
              "text": "With no buffer behind the deposit, one bad month has nothing under it, and the place you own can become the trap you can't leave."
            }
          ]
        },
        "sensitivity": {
          "gauge": "money",
          "penaltyFlags": [
            "no-floor"
          ]
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You root down, and the boring monthly payment quietly builds equity that compounds for years. Owning turns out to be a curve bending slowly upward under your feet.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "handles-money"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "It works and it's tight. You're house-rich and cash-poor, and every surprise — a leak, a bad month — lands harder because the margin all went into the walls.",
              "effects": {
                "gauge": {
                  "money": -1
                },
                "flagsSet": [
                  "thin-margin"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "A shock lands with no buffer under it, and the thing you own owns you back. Forced into a corner, you learn that a locked-in bet has a long tail.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "timeStructure": -1
                },
                "flagsSet": [
                  "thin-margin"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-rent-keep-margin",
        "label": "keep renting, keep the margin",
        "chips": {
          "costs": [
            "nothing to show for the rent",
            "watching others 'get on the ladder'"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "gauge": "money"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You stay light, and you quietly invest the difference instead of sinking it into walls. That buffer compounds too — the same curve, kept liquid, and yours to move.",
              "effects": {
                "gauge": {
                  "money": 1
                },
                "skills": [
                  "handles-money"
                ],
                "conditionsSet": [
                  "footloose"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "Nothing to point at, and a margin fully intact. The payoff is a shock you'll absorb without noticing — which is exactly why renting feels like losing.",
              "effects": {
                "skills": [
                  "handles-money"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-build-move",
    "act": 6,
    "family": "work",
    "mechanicLink": "slack",
    "setup": "A bigger role opens up — more money, more standing, more of you it wants. It would eat your evenings, your attention, the maintenance and the people who run on your leftover time. The pay is visible. The slack it spends is the thing you'll notice missing later.",
    "options": [
      {
        "id": "opt-take-role",
        "label": "take the bigger role",
        "chips": {
          "costs": [
            "your evenings",
            "the maintenance you keep deferring",
            "attention the people close to you were getting"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "gauge": "timeStructure"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "It pays and it's seen, and you grow into it. You also spend slack you're not counting — fine as a season, costly if the season forgets to end.",
              "effects": {
                "gauge": {
                  "money": 1,
                  "timeStructure": -1
                },
                "skills": [
                  "sticks-with-hard-things"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Good on paper, thin everywhere else. The title fits; the margin that used to absorb your bad days is quietly gone.",
              "effects": {
                "gauge": {
                  "money": 1
                },
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "You spread too thin and something gives — a rupture at home, your health, or the work itself. Slack was the thing that would have held it all together.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "connection": -1
                },
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-shape-the-role",
        "label": "take it, but negotiate the shape",
        "chips": {
          "costs": [
            "asking for terms before you've proven yourself",
            "a smaller title than the one on offer"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "skill": "asks-for-help"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You ask for the scope, not just the title, and get a version that grows you without draining you dry. You bought the upside and kept the margin.",
              "effects": {
                "gauge": {
                  "money": 1
                },
                "skills": [
                  "asks-for-help",
                  "reads-a-room"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "A smaller step than the big one, slack intact. Less to show this year, and a self still standing to show it with next year.",
              "effects": {
                "skills": [
                  "asks-for-help"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-build-partner",
    "act": 6,
    "family": "people",
    "mechanicLink": "party",
    "setup": "Things with someone have gotten serious, and the next step is merging lives — shared money, shared address, a shared fate. Going deeper means more hands to carry the load and more of your own that's now entangled. A bond like this is built slowly and comes apart slowly too.",
    "options": [
      {
        "id": "opt-merge-now",
        "label": "merge your lives now",
        "chips": {
          "costs": [
            "some of your autonomy",
            "a shared fate you can't quickly unpick",
            "the fault lines you haven't read yet"
          ],
          "variance": "wide",
          "reversibility": "costly to undo"
        },
        "sensitivity": {
          "skill": "reads-a-room"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "It holds, and the load starts flowing both ways — someone carries your bad weeks, you carry theirs. A bond built for real turns out to be its own kind of floor.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "relationships": [
                  {
                    "id": "rel-partner",
                    "label": "a partner",
                    "quality": 2
                  }
                ],
                "skills": [
                  "steadies-others"
                ],
                "flagsSet": [
                  "strong-ties"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Good and ordinary. The deepening is slow and unspectacular, which is mostly what a lasting one looks like from the inside.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "relationships": [
                  {
                    "id": "rel-partner",
                    "label": "a partner",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "You merged before you'd read the fault lines, and unwinding a shared life is slow and dear. Bonds are spent fast and rebuilt slowly.",
              "effects": {
                "gauge": {
                  "connection": -1,
                  "money": -1
                },
                "relationships": [
                  {
                    "id": "rel-partner",
                    "label": "a partner",
                    "quality": -1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-talk-first",
        "label": "say plainly what you each want, then deepen",
        "chips": {
          "costs": [
            "a vulnerable conversation",
            "risking an answer you don't want to hear"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "skill": "tells-the-truth-early"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 3,
            "outcome": {
              "line": "You name what you each want out loud first, and the deepening rests on something true. A bond you've been honest inside carries real weight.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "relationships": [
                  {
                    "id": "rel-partner",
                    "label": "a partner",
                    "quality": 1
                  }
                ],
                "skills": [
                  "tells-the-truth-early"
                ],
                "flagsSet": [
                  "strong-ties"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "The conversation is awkward and clarifying. Nothing is settled, but you go in with your eyes open, which is more than most people give themselves.",
              "effects": {
                "skills": [
                  "tells-the-truth-early"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-build-squeeze",
    "act": 6,
    "family": "money",
    "mechanicLink": "recovery",
    "recoveryCard": true,
    "setup": "The ground shifts under your work — a whole line of it dries up, the market for it gone thin — while the fixed costs keep arriving on time. This isn't a thing you caused or can fix by trying harder. The move now is about the floor, not the win.",
    "options": [
      {
        "id": "opt-outrun-market",
        "label": "try to out-work the shrinking market",
        "chips": {
          "costs": [
            "health and time spent against a wall",
            "the buffer draining anyway"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "penaltyFlags": [
            "thin-market"
          ]
        },
        "bands": [
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Sometimes the market turns and holding was right; sometimes it's just sunk cost in a coat. This time it's honestly hard to tell which.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                }
              }
            }
          },
          {
            "name": "poor",
            "weight": 2,
            "failure": true,
            "outcome": {
              "line": "You spend yourself against a thin market and it doesn't turn. The effort wasn't the problem; the wall was. Dear information, bought with your reserves.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "money": -1
                },
                "conditionsSet": [
                  "run-down"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-reroute-adjacent",
        "label": "step to adjacent work while the floor holds",
        "chips": {
          "costs": [
            "letting go of the exact plan",
            "a pay dip while you cross over"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "flags": [
          "recovery"
        ],
        "sensitivity": {
          "skill": "recovers-fast"
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "Your skills come with you; only the label changes. You cross to steadier ground while the buffer still holds, and a later start is still a start.",
              "effects": {
                "gauge": {
                  "money": 1
                },
                "skills": [
                  "recovers-fast",
                  "reads-the-fine-print"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Sideways is slower and it's ground. You trade the perfect plan for a floor that keeps holding, which was the thing that actually needed protecting.",
              "effects": {
                "skills": [
                  "recovers-fast"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-endure-squeeze",
        "label": "when there's no good move yet, cut to the floor and let people hold you",
        "chips": {
          "costs": [
            "accepting a stretch you can't fix by trying"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "flags": [
          "endurance"
        ],
        "supportLink": "/situations/job-loss",
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Some stretches you get through with company, not around. You cut your costs to the floor, ask plainly for help, and let a few people carry part of it.",
              "effects": {
                "conditionsSet": [
                  "stretched-thin"
                ],
                "skills": [
                  "asks-for-help"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 2,
            "outcome": {
              "line": "It stays hard, because it is hard. What changes is that you stop reading an unfair draw as a verdict on you.",
              "effects": {
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-midgame-caregiving-load",
    "act": 7,
    "family": "home",
    "setup": "Your mother's needs have grown — rides to appointments, refills, the small daily tending. Somehow it has all become your job. Your siblings live far and stay quiet. You have a partner, a job, kids who still need you. Something has to give.",
    "options": [
      {
        "id": "opt-carry-it-alone",
        "label": "carry it yourself and say nothing",
        "flags": [],
        "chips": {
          "costs": [
            "your slack",
            "your health",
            "quiet resentment"
          ],
          "variance": "moderate",
          "reversibility": "costly to undo",
          "positionNotes": [
            {
              "when": "no-floor",
              "text": "With no slack to spare, carrying it all alone burns you down far faster."
            }
          ]
        },
        "sensitivity": {
          "gauge": "healthEnergy",
          "penaltyFlags": [
            "thin-margin"
          ],
          "strength": 0.6
        },
        "bands": [
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "You manage. There's a quiet pride in being the one who shows up. But the slack you used to keep for yourself is gone, spent without anyone seeing.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                },
                "skills": [
                  "sticks-with-hard-things"
                ],
                "conditionsSet": [
                  "care-load"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You keep every plate spinning for a while. Nobody notices the cost, because you never name it. The tiredness settles into your bones and stays.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "timeStructure": -1
                },
                "conditionsSet": [
                  "care-load",
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "You hold it all until you're running on empty. Small things slip — a missed refill, a sharp word at your kid. You feel far from everyone.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "connection": -1
                },
                "conditionsSet": [
                  "care-load",
                  "run-down"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-ask-siblings-to-share",
        "label": "call your siblings and split it",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "an awkward conversation",
            "giving up some control"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "asks-for-help",
          "gauge": "connection",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You lay it out plainly and ask. To your surprise, a sister offers to take the calls and money for a service. The load halves. You can breathe.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "connection": 1,
                  "timeStructure": 1
                },
                "skills": [
                  "asks-for-help",
                  "reads-a-room"
                ],
                "conditionsClear": [
                  "stretched-thin"
                ],
                "relationships": [
                  {
                    "id": "rel-sibling",
                    "label": "a sibling",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "They didn't realize how much you carried. It's uneven still, but now someone else checks in, sends money, shares the worry. You are less alone in it.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "asks-for-help"
                ],
                "conditionsSet": [
                  "care-load"
                ],
                "relationships": [
                  {
                    "id": "rel-sibling",
                    "label": "a sibling",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The call is tense. They mean well but stay vague about what they'll do. Still, you've named it out loud now, and that shifts something.",
              "effects": {
                "skills": [
                  "tells-the-truth-early",
                  "asks-for-help"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-bring-in-outside-help",
        "label": "arrange paid help and a neighbor rota",
        "flags": [],
        "chips": {
          "costs": [
            "money",
            "the guilt of not doing it all yourself"
          ],
          "variance": "moderate",
          "reversibility": "reversible",
          "positionNotes": [
            {
              "when": "thin-margin",
              "text": "With no cushion, paid help competes with rent — this option gets much harder to reach."
            }
          ]
        },
        "sensitivity": {
          "gauge": "money",
          "penaltyFlags": [
            "thin-margin"
          ],
          "strength": 0.6
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "A part-time aide and a neighbor who checks in change everything. Your mother is well-tended, your evenings return. Money's tighter, but your health isn't the price anymore.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "healthEnergy": 1,
                  "timeStructure": 1
                },
                "skills": [
                  "handles-money",
                  "reads-the-fine-print"
                ],
                "conditionsSet": [
                  "well-tended"
                ],
                "conditionsClear": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "It costs more than you'd like, and arranging it takes weeks. But once it's running, the daily weight lifts off your shoulders.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "healthEnergy": 1
                },
                "skills": [
                  "handles-money"
                ],
                "conditionsSet": [
                  "well-tended"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "The first helper isn't a fit and your mother resists a stranger in the house. You're out money and back to square one, tireder than before.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "healthEnergy": -1
                },
                "skills": [
                  "reads-the-fine-print"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-midgame-caregiving-plateau",
    "act": 7,
    "family": "work",
    "setup": "You've been good at this job for years. The climb flattened a while ago — same role, same rung, younger faces moving past you. It's steady, it pays, and some quiet part of you is restless for something that isn't just more of the same.",
    "options": [
      {
        "id": "opt-invest-slowly",
        "label": "build a new skill on the side, a little at a time",
        "flags": [],
        "chips": {
          "costs": [
            "evenings",
            "slow, unglamorous progress"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "sticks-with-hard-things",
          "gauge": "timeStructure",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "A year of small evenings adds up to something real. A side project turns into an offer, a raise, or just proof to yourself that you can still grow.",
              "effects": {
                "gauge": {
                  "timeStructure": -1,
                  "money": 1
                },
                "skills": [
                  "makes-things",
                  "sticks-with-hard-things"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Progress is slow and mostly invisible. But months in, you notice you're less bored, and a door you didn't know existed cracks open.",
              "effects": {
                "gauge": {
                  "timeStructure": -1
                },
                "skills": [
                  "makes-things",
                  "sticks-with-hard-things"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Some weeks you're too tired to touch it. The skill grows in fits and starts. You haven't arrived anywhere, but you haven't gone stale either.",
              "effects": {
                "gauge": {
                  "timeStructure": -1
                },
                "skills": [
                  "sticks-with-hard-things"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-push-for-promotion",
        "label": "make your case for the promotion now",
        "flags": [],
        "chips": {
          "costs": [
            "exposure",
            "a no on the record"
          ],
          "variance": "very wide",
          "reversibility": "costly to undo",
          "positionNotes": [
            {
              "when": "thin-market",
              "text": "In a thin job market a no costs more — you can't easily walk if it sours."
            }
          ]
        },
        "sensitivity": {
          "gauge": "connection",
          "penaltyFlags": [
            "thin-market"
          ],
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You lay out what you've done and what you want. They say yes — more money, more standing. Turns out they'd been waiting for you to ask.",
              "effects": {
                "gauge": {
                  "money": 1,
                  "connection": 1
                },
                "skills": [
                  "asks-for-help",
                  "tells-the-truth-early"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "They don't say yes, but they don't say never. You get a plan, a maybe, a next review. It stings, and it's more than you had.",
              "effects": {
                "skills": [
                  "asks-for-help"
                ]
              }
            }
          },
          {
            "name": "failure",
            "weight": 1,
            "failure": true,
            "outcome": {
              "line": "The answer is a flat no, and now it's awkward. You feel smaller at the desk you sit at every day, wondering if you overplayed your hand.",
              "effects": {
                "gauge": {
                  "connection": -1,
                  "healthEnergy": -1
                },
                "conditionsSet": [
                  "run-down"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-make-peace",
        "label": "make peace with it and pour the energy elsewhere",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "letting go of the climb",
            "other people's expectations"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "gauge": "healthEnergy",
          "skill": "recovers-fast",
          "strength": 0.4
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You stop measuring yourself by the next rung. The hours you spent on wanting-more go to your kids, your health, a life. You feel lighter than you have in years.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "connection": 1,
                  "timeStructure": 1
                },
                "skills": [
                  "steadies-others",
                  "recovers-fast"
                ],
                "conditionsSet": [
                  "steady-footing",
                  "well-tended"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "The restlessness quiets. Work becomes the thing that funds your life rather than the whole of it. Some days you miss the hunger, most days you don't.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1
                },
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-midgame-caregiving-village",
    "act": 7,
    "family": "civic",
    "setup": "The school pickup, the sick days, the birthday circuit — it's more than two hands can hold. Other parents are drowning in the same tide. Someone floats a rota: shared pickups, swapped babysitting, a group thread. It would mean depending on people you barely know.",
    "options": [
      {
        "id": "opt-join-the-rota",
        "label": "join the rota and pull your weight in it",
        "flags": [],
        "chips": {
          "costs": [
            "your turn in the rotation",
            "trusting near-strangers with your kids"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "keeps-a-network",
          "gauge": "connection",
          "strength": 0.6
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "Within a season you have a web of people. A sick day no longer means panic. Your kids gain other trusted grown-ups, and you gain a village to lean on.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "timeStructure": 1
                },
                "skills": [
                  "keeps-a-network",
                  "reads-a-room"
                ],
                "flagsSet": [
                  "strong-ties",
                  "thick-market"
                ],
                "conditionsClear": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "It's uneven — some parents give more than others — but on the whole you're carried more than you carry. The group thread becomes a small daily comfort.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "keeps-a-network"
                ],
                "flagsSet": [
                  "strong-ties"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You put in more than you get back at first, and one flaky family tests your patience. Still, two or three real friendships come out of it.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "timeStructure": -1
                },
                "skills": [
                  "keeps-a-network",
                  "reads-a-room"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-go-it-alone",
        "label": "keep to your own and skip the obligation",
        "flags": [],
        "chips": {
          "costs": [
            "a thinner safety net",
            "isolation"
          ],
          "variance": "moderate",
          "reversibility": "reversible",
          "positionNotes": [
            {
              "when": "thin-ties",
              "text": "With few people to call, going it alone leaves no net when a week goes wrong."
            }
          ]
        },
        "sensitivity": {
          "gauge": "connection",
          "penaltyFlags": [
            "thin-ties"
          ],
          "strength": 0.5
        },
        "bands": [
          {
            "name": "solid",
            "weight": 2,
            "outcome": {
              "line": "You protect your time and answer to no one's schedule but your own. It works — until the week everything lands at once and there's no one to call.",
              "effects": {
                "gauge": {
                  "timeStructure": 1,
                  "connection": -1
                },
                "flagsSet": [
                  "thin-ties"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You stay in control of your days. But you watch the rota parents trade easy favors, and a small loneliness sets in that you don't quite name.",
              "effects": {
                "gauge": {
                  "connection": -1
                },
                "flagsSet": [
                  "thin-ties"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "The one time you're truly stuck, you find you've built no net to catch you. You scramble, call in a work favor, and swear you'll do it differently.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "timeStructure": -1
                },
                "conditionsSet": [
                  "stretched-thin"
                ],
                "flagsSet": [
                  "thin-ties",
                  "no-floor"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-join-on-light-duty",
        "label": "join on light duty — take only what you can, and say so",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "admitting you're stretched",
            "the sense that you owe"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "asks-for-help",
          "gauge": "connection",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You're honest that you're stretched thin right now. Nobody blinks — half of them are too. You get the net without the guilt, and pay it back when the season turns.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "healthEnergy": 1
                },
                "skills": [
                  "asks-for-help",
                  "tells-the-truth-early"
                ],
                "flagsSet": [
                  "strong-ties"
                ],
                "conditionsClear": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Naming your limit up front makes it easy. You take a light share, lean when you must, and no one keeps a ledger. The relief is real.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "asks-for-help"
                ],
                "flagsSet": [
                  "strong-ties"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "It feels vulnerable to say you can't give much. One parent seems to note it. But most just nod, and you're in the circle now, lightly.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "tells-the-truth-early"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-midgame-caregiving-drift",
    "act": 7,
    "family": "people",
    "setup": "You and an old friend used to talk every week. Now months pass between messages. Nobody fell out — life just filled up, on both sides. You think of them often and don't reach out, and the quiet between you keeps stretching longer.",
    "options": [
      {
        "id": "opt-reach-out-name-it",
        "label": "reach out and say you've missed them",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "the risk they've moved on",
            "swallowing your pride"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "skill": "keeps-a-network",
          "gauge": "connection",
          "strength": 0.6
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You send the honest message: I miss you, let's not let this fade. They reply within the hour, relieved you did. You pick up almost where you left off.",
              "effects": {
                "gauge": {
                  "connection": 2
                },
                "skills": [
                  "asks-for-help",
                  "tells-the-truth-early",
                  "keeps-a-network"
                ],
                "flagsSet": [
                  "strong-ties"
                ],
                "relationships": [
                  {
                    "id": "rel-oldfriend",
                    "label": "an old friend",
                    "quality": 2
                  }
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "It takes a few tries to line up, but you talk, and it's warm. Not weekly like before, but real — a thread picked back up, tended now on purpose.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "keeps-a-network",
                  "tells-the-truth-early"
                ],
                "relationships": [
                  {
                    "id": "rel-oldfriend",
                    "label": "an old friend",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "They're glad to hear from you but slow to write back, and busy. The friendship is gentler now, more occasional. It's not what it was, but it isn't gone.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "reads-a-room"
                ],
                "relationships": [
                  {
                    "id": "rel-oldfriend",
                    "label": "an old friend",
                    "quality": 1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-let-it-fade",
        "label": "let it rest and see if it comes back on its own",
        "flags": [],
        "chips": {
          "costs": [
            "a friendship on autopilot",
            "regret if it slips"
          ],
          "variance": "moderate",
          "reversibility": "costly to undo"
        },
        "sensitivity": {
          "gauge": "connection",
          "penaltyFlags": [
            "thin-ties"
          ],
          "strength": 0.4
        },
        "bands": [
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The friendship idles. Now and then one of you likes the other's photo. It's not painful, exactly — just a warm thing slowly cooling to lukewarm.",
              "effects": {
                "flagsSet": [
                  "thin-ties"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 2,
            "outcome": {
              "line": "Months become a year. When you finally think to reach out, it feels almost too late to bridge, and you're not sure you have the words anymore.",
              "effects": {
                "gauge": {
                  "connection": -1
                },
                "flagsSet": [
                  "thin-ties"
                ],
                "relationships": [
                  {
                    "id": "rel-oldfriend",
                    "label": "an old friend",
                    "quality": -1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-accept-the-season",
        "label": "accept it may have had its season, and turn toward who's here",
        "flags": [
          "endurance"
        ],
        "supportLink": "/topics/relationships",
        "chips": {
          "costs": [
            "letting go of what it was",
            "a real absence"
          ],
          "variance": "narrow",
          "reversibility": "locks in"
        },
        "sensitivity": {
          "skill": "recovers-fast",
          "gauge": "connection",
          "strength": 0.4
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You stop waiting for it to be what it was. It hurts a little to release, and it also frees you to pour into the friendships that do reach back.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "healthEnergy": 1
                },
                "skills": [
                  "reads-a-room",
                  "steadies-others"
                ],
                "conditionsSet": [
                  "in-repair"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Some evenings you feel the empty space where they used to be. But you're not chasing anymore, and the people still close to you feel your fuller attention.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "steadies-others"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-late-rightsize",
    "act": 8,
    "family": "home",
    "mechanicLink": "recovery",
    "recoveryCard": true,
    "setup": "The stairs feel longer than they used to, and the big house holds more rooms than you fill. A smaller place across town would be easier to keep. But every corner here carries something. Do you move while it's your choice, or hold on?",
    "options": [
      {
        "id": "opt-rightsize-move",
        "label": "right-size while it's your call",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "the ache of sorting a lifetime of things",
            "a season of upheaval",
            "less room when family visits"
          ],
          "variance": "moderate",
          "reversibility": "costly to undo"
        },
        "sensitivity": {
          "gauge": "healthEnergy",
          "skill": "recovers-fast",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "The new place is warm within a season. Neighbors are close, the upkeep is light, and you gave the good pieces to people who wanted them. You feel lighter.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "timeStructure": 1,
                  "money": 1
                },
                "skills": [
                  "handles-money"
                ],
                "conditionsSet": [
                  "well-tended"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "The move is tiring, but it lands. Some things you miss; most you don't. The smaller rooms are easier on your knees, and there's money freed up.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "money": 1
                },
                "skills": [
                  "recovers-fast"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "It's done, but the sorting drags on for months and one child is hurt that you gave away the old table. You're settled, and a little worn.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "timeStructure": 1
                },
                "relationships": [
                  {
                    "id": "rel-child",
                    "label": "a grown child",
                    "quality": -1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-rightsize-stay",
        "label": "stay put and make it work",
        "flags": [],
        "chips": {
          "costs": [
            "ongoing upkeep you can't always manage",
            "rooms that sit empty and cold",
            "help you have to arrange and pay for"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You move your bed downstairs and find someone to handle the yard. The house is too big, but it's yours, and the familiar walls hold you steady.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You manage, mostly. But a winter storm and a failed furnace remind you how much a big house asks. You cope, and you're tired more often.",
              "effects": {
                "gauge": {
                  "money": -1,
                  "healthEnergy": -1
                },
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "The upkeep outpaces you. Things go unfixed, a fall on the stairs shakes you, and staying starts to feel less like choice and more like being stuck.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "timeStructure": -1
                },
                "conditionsSet": [
                  "run-down"
                ],
                "flagsSet": [
                  "thin-margin"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-rightsize-family",
        "label": "bring the family into the choice",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "opening a tender subject",
            "hearing opinions you may not like",
            "the decision taking longer"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "gauge": "connection",
          "skill": "asks-for-help",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "Around the table, it turns tender and honest. The children offer to help sort and haul. You choose together, and no one feels shut out.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "healthEnergy": 1
                },
                "skills": [
                  "asks-for-help",
                  "reads-a-room"
                ],
                "relationships": [
                  {
                    "id": "rel-family",
                    "label": "your family",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "They have thoughts, some clashing, but they show up. The plan takes shape slowly, and you feel less alone carrying it.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "asks-for-help"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Old sibling tensions surface over who wants what. You get help, but also a squabble to smooth. The decision is shared, and a little bruised.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                },
                "relationships": [
                  {
                    "id": "rel-family",
                    "label": "your family",
                    "quality": -1
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-late-hand-down",
    "act": 8,
    "family": "work",
    "mechanicLink": "party",
    "setup": "For years the workshop was yours alone. Now a younger hand keeps asking to learn — eager, quick, and nothing like you. Teaching means slowing down, letting them botch good material, watching your way get changed. Or you keep the craft close and finish your own runs in peace.",
    "options": [
      {
        "id": "opt-handdown-teach",
        "label": "teach the eager hand",
        "flags": [],
        "chips": {
          "costs": [
            "slower output while they learn",
            "wasted material and patience",
            "seeing your methods reshaped"
          ],
          "variance": "wide",
          "reversibility": "costly to undo"
        },
        "sensitivity": {
          "gauge": "connection",
          "skill": "steadies-others",
          "strength": 0.6
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "They take to it and bring their own spark. Word spreads; two more ask to learn. The craft outgrows you and lives on, and the shop hums with company.",
              "effects": {
                "gauge": {
                  "connection": 2,
                  "healthEnergy": 1
                },
                "skills": [
                  "steadies-others",
                  "makes-things",
                  "keeps-a-network"
                ],
                "conditionsSet": [
                  "well-tended"
                ],
                "relationships": [
                  {
                    "id": "rel-apprentice",
                    "label": "an apprentice",
                    "quality": 2
                  }
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Progress is slow and uneven, but real. They ruin some stock and save some too. By season's end they can carry a job alone, and you're proud in a quiet way.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "steadies-others",
                  "makes-things"
                ],
                "relationships": [
                  {
                    "id": "rel-apprentice",
                    "label": "an apprentice",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You teach; they drift. Half is learned, half abandoned when a better offer calls them away. Some knowledge passed on, some time you won't get back.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                },
                "skills": [
                  "steadies-others"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-handdown-keep",
        "label": "finish your own runs",
        "flags": [],
        "chips": {
          "costs": [
            "the knowledge goes no further than you",
            "the shop stays quiet",
            "no one to share the load"
          ],
          "variance": "narrow",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "The work stays clean and yours. Your days are calm, your standards intact. The runs come out beautiful, and only you know how.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "timeStructure": 1
                },
                "skills": [
                  "makes-things"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Peaceful, yes, but the quiet grows heavy. A part of you notices the eager hand found another teacher, and the craft moves on without you.",
              "effects": {
                "gauge": {
                  "connection": -1
                }
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "The runs get harder as your hands tire, with no one to hand them to. What you know starts to feel like a weight you carry alone.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "connection": -1
                },
                "conditionsSet": [
                  "run-down"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-handdown-share",
        "label": "bring in others to teach with you",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "giving up sole authority over how it's taught",
            "coordinating with others",
            "the craft blending with other hands' habits"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "gauge": "connection",
          "skill": "asks-for-help",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You link up with a couple of old peers and take on learners together. The load is light, the room is full, and the craft passes to many hands at once.",
              "effects": {
                "gauge": {
                  "connection": 2,
                  "healthEnergy": 1
                },
                "skills": [
                  "keeps-a-network",
                  "asks-for-help",
                  "steadies-others"
                ],
                "conditionsSet": [
                  "well-tended"
                ],
                "flagsSet": [
                  "strong-ties"
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Sharing the teaching works better than doing it alone. Some coordination headaches, but the learners get more than you could give solo.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "keeps-a-network",
                  "steadies-others"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Egos rub. One old peer teaches it wrong, to your eye, and you bite your tongue. The craft passes on, changed more than you'd like.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                },
                "skills": [
                  "reads-a-room"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-late-old-rift",
    "act": 8,
    "family": "people",
    "mechanicLink": "recovery",
    "recoveryCard": true,
    "setup": "A brother you haven't spoken to in years. The falling-out was real, and both of you were wrong in your own ways. You've thought about calling. He might welcome it, or he might not pick up. You could reach out — or leave the quiet as it is.",
    "options": [
      {
        "id": "opt-rift-call",
        "label": "call your brother",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "exposing old hurt again",
            "a rejection you'd feel keenly",
            "he may want more than you can give"
          ],
          "variance": "very wide",
          "reversibility": "costly to undo"
        },
        "sensitivity": {
          "gauge": "connection",
          "skill": "tells-the-truth-early",
          "strength": 0.6
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "He's quiet, then his voice breaks. You both say the thing you should have said years ago. It isn't all mended in one call, but the door is open, and you're glad you tried.",
              "effects": {
                "gauge": {
                  "connection": 2,
                  "healthEnergy": 1
                },
                "skills": [
                  "tells-the-truth-early",
                  "recovers-fast"
                ],
                "conditionsSet": [
                  "in-repair"
                ],
                "relationships": [
                  {
                    "id": "rel-brother",
                    "label": "your brother",
                    "quality": 2
                  }
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "He's guarded. You get politeness, not warmth, and the old wound stays half-covered. Still, you said your piece, and the silence is a little less heavy now.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "healthEnergy": -1
                },
                "skills": [
                  "tells-the-truth-early"
                ],
                "conditionsSet": [
                  "in-repair"
                ],
                "relationships": [
                  {
                    "id": "rel-brother",
                    "label": "your brother",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "failure",
            "failure": true,
            "weight": 1,
            "outcome": {
              "line": "He doesn't pick up, or he does and it turns sharp. The call ends worse than the quiet was. You carry the sting, and wish you'd left it alone.",
              "effects": {
                "gauge": {
                  "connection": -1,
                  "healthEnergy": -1
                },
                "conditionsSet": [
                  "run-down"
                ],
                "relationships": [
                  {
                    "id": "rel-brother",
                    "label": "your brother",
                    "quality": -1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-rift-bridge",
        "label": "ask a relative to bridge it",
        "flags": [],
        "chips": {
          "costs": [
            "putting a relative in the middle",
            "the message getting softened or garbled",
            "waiting on someone else's timing"
          ],
          "variance": "wide",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "gauge": "connection",
          "skill": "keeps-a-network",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Your cousin carries word gently, and it lands better secondhand. Your brother reaches back on his own terms. A slow thaw begins.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "keeps-a-network",
                  "asks-for-help"
                ],
                "conditionsSet": [
                  "in-repair"
                ],
                "relationships": [
                  {
                    "id": "rel-brother",
                    "label": "your brother",
                    "quality": 1
                  }
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "The go-between tries, but the message thins in the passing. Nothing breaks open, nothing breaks worse. You're about where you started, with one more person hoping.",
              "effects": {
                "gauge": {},
                "skills": [
                  "keeps-a-network"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "The relative oversteps, says too much, and stirs the pot. Now two people are cross with you, and the rift feels wider than before.",
              "effects": {
                "gauge": {
                  "connection": -1,
                  "healthEnergy": -1
                },
                "relationships": [
                  {
                    "id": "rel-brother",
                    "label": "your brother",
                    "quality": -1
                  },
                  {
                    "id": "rel-cousin",
                    "label": "a cousin",
                    "quality": -1
                  }
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-rift-rest",
        "label": "let it rest, and set it down",
        "flags": [
          "endurance"
        ],
        "supportLink": "/topics/relationships",
        "chips": {
          "costs": [
            "the rift stays unhealed",
            "the wondering never fully quiets",
            "carrying it alone if you don't lean on others"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You stop waiting for a call that may not come. You talk it through with people who love you, and slowly the grip of it loosens. Not closed, but lighter to hold.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "connection": 1
                },
                "skills": [
                  "asks-for-help",
                  "recovers-fast"
                ],
                "conditionsSet": [
                  "in-repair"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Some days you're at peace; some days the old anger flares. You lean on a friend when it does. The rift stays, but it stops running your quiet hours.",
              "effects": {
                "gauge": {
                  "connection": 1
                },
                "skills": [
                  "asks-for-help"
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "You try to set it down but keep picking it back up, alone. Without anyone to say it to, the old story loops. It sits heavy.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "connection": -1
                },
                "conditionsSet": [
                  "run-down"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "card-late-step-back",
    "act": 8,
    "family": "civic",
    "mechanicLink": "party",
    "setup": "You've led the community group for longer than anyone can remember. The seat is yours if you want it again. But the meetings tire you now, and a younger member is ready and able. Running again means standing in the light a while longer. Stepping back means letting go.",
    "options": [
      {
        "id": "opt-stepback-hand",
        "label": "step back and hand it over",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "the role that gave you standing is gone",
            "watching them do it differently",
            "an emptier calendar to fill"
          ],
          "variance": "moderate",
          "reversibility": "locks in"
        },
        "sensitivity": {
          "gauge": "healthEnergy",
          "skill": "steadies-others",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You step aside with grace and stay on to mentor. The younger member thrives; the group grows under fresh energy. You have your evenings back, and their gratitude.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "timeStructure": 1,
                  "connection": 1
                },
                "skills": [
                  "steadies-others",
                  "recovers-fast"
                ],
                "conditionsSet": [
                  "well-tended"
                ],
                "relationships": [
                  {
                    "id": "rel-successor",
                    "label": "your successor",
                    "quality": 2
                  }
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "The handover is a little bumpy, but it takes. You rest more, worry less, and find the group manages fine without you at the head.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "timeStructure": 1
                },
                "skills": [
                  "steadies-others"
                ],
                "conditionsSet": [
                  "steady-footing"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You let go, then feel unmoored — the calls stop, the purpose thins. You've rest you didn't quite want yet, and a gap you'll need to fill.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "connection": -1
                },
                "conditionsSet": [
                  "footloose"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-stepback-run",
        "label": "keep the seat",
        "flags": [],
        "chips": {
          "costs": [
            "energy you can't always spare",
            "blocking a ready newcomer",
            "the group leaning on you instead of growing"
          ],
          "variance": "wide",
          "reversibility": "costly to undo",
          "positionNotes": [
            {
              "when": "thin-margin",
              "text": "Keeping the seat with no margin to spare tends to go worse — the pace outruns you and the misses start to show."
            }
          ]
        },
        "sensitivity": {
          "gauge": "healthEnergy",
          "penaltyFlags": [
            "thin-margin"
          ],
          "strength": 0.6
        },
        "bands": [
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "You win the seat and carry on. The work still matters, and you're good at it. But the tiredness is real, and some nights you wonder how long you can keep pace.",
              "effects": {
                "gauge": {
                  "connection": 1,
                  "healthEnergy": -1
                },
                "skills": [
                  "sticks-with-hard-things"
                ],
                "conditionsSet": [
                  "stretched-thin"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "You hold the role, but the newcomer, passed over, drifts away disappointed. You keep the standing and lose a promising ally. The load stays all yours.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1
                },
                "relationships": [
                  {
                    "id": "rel-newcomer",
                    "label": "a younger member",
                    "quality": -1
                  }
                ]
              }
            }
          },
          {
            "name": "poor",
            "weight": 1,
            "outcome": {
              "line": "The pace catches up with you. You miss meetings, drop threads, and the group quietly notices the head isn't what it was. Holding on is costing you more than the seat gives back.",
              "effects": {
                "gauge": {
                  "healthEnergy": -1,
                  "timeStructure": -1,
                  "connection": -1
                },
                "conditionsSet": [
                  "run-down"
                ]
              }
            }
          }
        ]
      },
      {
        "id": "opt-stepback-split",
        "label": "lead alongside the newcomer",
        "flags": [
          "recovery"
        ],
        "chips": {
          "costs": [
            "sharing authority you're used to holding alone",
            "sorting out who does what",
            "the group unsure who leads"
          ],
          "variance": "moderate",
          "reversibility": "reversible"
        },
        "sensitivity": {
          "gauge": "connection",
          "skill": "steadies-others",
          "strength": 0.5
        },
        "bands": [
          {
            "name": "strong",
            "weight": 2,
            "outcome": {
              "line": "You take the role together, you steadying, them driving. The group gets your wisdom and their energy both. You carry half the weight and keep the good part.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "connection": 1
                },
                "skills": [
                  "steadies-others",
                  "keeps-a-network"
                ],
                "conditionsSet": [
                  "well-tended"
                ],
                "relationships": [
                  {
                    "id": "rel-colead",
                    "label": "a co-lead",
                    "quality": 2
                  }
                ]
              }
            }
          },
          {
            "name": "solid",
            "weight": 3,
            "outcome": {
              "line": "Splitting it works, mostly. A few crossed wires over who decides, but the load is lighter and the newcomer learns fast at your side.",
              "effects": {
                "gauge": {
                  "healthEnergy": 1,
                  "connection": 1
                },
                "skills": [
                  "steadies-others"
                ]
              }
            }
          },
          {
            "name": "mixed",
            "weight": 3,
            "outcome": {
              "line": "Two heads, some friction. The group isn't sure who to ask, and you end up doing more than half anyway. Better than alone, not quite what you hoped.",
              "effects": {
                "gauge": {},
                "skills": [
                  "reads-a-room"
                ]
              }
            }
          }
        ]
      }
    ]
  }
];
