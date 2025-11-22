export const GameConfig = {
  PLAYER: {
    BASE_HP: 120,
    BASE_SPEED: 220,
    BASE_DAMAGE: 15,
    BASE_FIRE_RATE: 0.4,
    BASE_PROJECTILE_SPEED: 450,
    BASE_PICKUP_RANGE: 60,
  },

  XP: {
    BASE_XP_REQ: 10,
    GROWTH_FACTOR: 1.5,
  },

  DROPS: {
    CHANCE_GOLD: 0.25,
    CHANCE_XP: 0.65,
    VALUE_GOLD: 15,
    VALUE_XP: 2,
  },

  DIFFICULTY: {
    SCALING_PER_MINUTE: 0.10,
  },

  WAVES: {
    DEFAULT_TIME: 60,
    BOSS_TIME: 120,
    BOSS_SPAWN_INTERVAL: 5,
  },

  COMBAT: {
    PLAYER_PUSH_FORCE: 100,
    BOSS_PUSH_FORCE: 150,
    TIME_WARP_SLOWDOWN: 0.5,
    EXPLOSION_SPLASH_MULTIPLIER: 0.5,
    LASER_PIERCE_MULTIPLIER: 0.5,
  },

  VISUAL: {
    AMBIENT_PARTICLE_COUNT: 30,
    BOSS_DEATH_EXPLOSIONS: 5,
    BOSS_DEATH_EXPLOSION_DELAY: 200,
  },

  ABILITIES: {
    DEFAULT_SHIELD_STRENGTH: 100,
    BLOOD_FRENZY_DURATION: 5000,
    BLOOD_FRENZY_LIFESTEAL_BONUS: 0.02,
  },

  ENEMIES: {
    BASIC: {
      HP: 15,
      SPEED: 70,
      DAMAGE: 8,
      RADIUS: 12,
      XP_VALUE: 2,
    },
    FAST: {
      HP: 10,
      SPEED: 150,
      DAMAGE: 5,
      RADIUS: 10,
      XP_VALUE: 2,
    },
    TANK: {
      HP: 50,
      SPEED: 50,
      DAMAGE: 15,
      RADIUS: 20,
      XP_VALUE: 5,
    },
    SWARMER: {
      HP: 5,
      SPEED: 180,
      DAMAGE: 3,
      RADIUS: 8,
      XP_VALUE: 1,
    },
    SHOOTER: {
      HP: 15,
      SPEED: 70,
      DAMAGE: 8,
      RADIUS: 12,
      XP_VALUE: 3,
    },
    BOMBER: {
      HP: 25,
      SPEED: 60,
      DAMAGE: 20,
      RADIUS: 14,
      XP_VALUE: 4,
      EXPLOSION_RADIUS: 100,
      EXPLOSION_DAMAGE: 50,
    },
    NECROMANCER: {
      HP: 30,
      SPEED: 40,
      DAMAGE: 5,
      RADIUS: 16,
      XP_VALUE: 6,
      SUMMON_INTERVAL: 3,
      SUMMON_COUNT: 2,
    },
    ASSASSIN: {
      HP: 15,
      SPEED: 120,
      DAMAGE: 25,
      RADIUS: 11,
      XP_VALUE: 5,
      CLOAK_DURATION: 2,
      TELEPORT_RANGE: 200,
    }
  }
};

export const MathHelpers = {
  getXpForLevel: (level: number) => {
    return Math.floor(GameConfig.XP.BASE_XP_REQ * Math.pow(level, GameConfig.XP.GROWTH_FACTOR));
  },

  getDifficultyMultiplier: (timeInSeconds: number) => {
    return 1 + (timeInSeconds / 60) * GameConfig.DIFFICULTY.SCALING_PER_MINUTE;
  },

  rollDrop: (luck: number = 1.0) => {
    const rand = Math.random();
    if (rand < GameConfig.DROPS.CHANCE_GOLD * luck) return 'gold';
    if (rand < (GameConfig.DROPS.CHANCE_GOLD + GameConfig.DROPS.CHANCE_XP) * luck) return 'xp';
    return null;
  }
};
