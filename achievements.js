/* ============================
   ACHIEVEMENT DEFINITIONS
============================ */

const ACHIEVEMENTS = [

    {
        id: "adventure-begins",
        tier: "bronze",
        icon: "🟤",
        name: "The Adventure Begins",
        description:
            "Earn your first XP.",
        secret: false,
        unlocked:
            () =>
                lifetimeXP() >= 1
    },

    {
        id: "first-blood",
        tier: "bronze",
        icon: "🟤",
        name: "First Blood",
        description:
            "Complete your first Perfect Day.",
        secret: false,
        unlocked:
            () =>
                perfectDayCount() >= 1
    },

    {
        id: "provisioned",
        tier: "bronze",
        icon: "🟤",
        name: "Provisioned",
        description:
            "Complete Planned Healthy Lunch for the first time.",
        secret: false,
        unlocked:
            () =>
                plannedLunchCount() >= 1
    },

    {
        id: "gas-station-goblins",
        tier: "bronze",
        icon: "🟤",
        name: "No Gas-Station Goblins",
        description:
            "Complete No Unplanned Junk Run for the first time.",
        secret: false,
        unlocked:
            () =>
                junkFreeCount() >= 1
    },

    {
        id: "touch-grass",
        tier: "bronze",
        icon: "🟤",
        name: "Touch Grass",
        description:
            "Complete your first Activity quest.",
        secret: false,
        unlocked:
            () =>
                activityDayCount() >= 1
    },

    {
        id: "waterskin-equipped",
        tier: "bronze",
        icon: "🟤",
        name: "Waterskin Equipped",
        description:
            "Hit your hydration target for the first time.",
        secret: false,
        unlocked:
            () =>
                hydrationDayCount() >= 1
    },

    {
        id: "eat-your-greens",
        tier: "bronze",
        icon: "🟤",
        name: "Eat Your Greens",
        description:
            "Complete your first Vegetables quest.",
        secret: false,
        unlocked:
            () =>
                vegetableDayCount() >= 1
    },

    {
        id: "level-2",
        tier: "bronze",
        icon: "🟤",
        name: "Level Up!",
        description:
            "Reach Level 2.",
        secret: false,
        unlocked:
            () =>
                playerLevel() >= 2
    },

    {
        id: "streak-3",
        tier: "bronze",
        icon: "🟤",
        name: "Three Days in the Wild",
        description:
            "Reach a 3-day streak.",
        secret: false,
        unlocked:
            () =>
                maxHistoricalStreak() >= 3
    },

    {
        id: "lunch-5",
        tier: "bronze",
        icon: "🟤",
        name: "A Full Week's Rations",
        description:
            "Complete 5 Planned Healthy Lunch quests.",
        secret: false,
        unlocked:
            () =>
                plannedLunchCount() >= 5
    },

    {
        id: "hydration-5",
        tier: "bronze",
        icon: "🟤",
        name: "Hydromancer",
        description:
            "Hit your hydration target on 5 days.",
        secret: false,
        unlocked:
            () =>
                hydrationDayCount() >= 5
    },

    {
        id: "lose-5",
        tier: "bronze",
        icon: "🟤",
        name: "The First Five",
        description:
            "Lose 5 lb from your starting weight.",
        secret: false,
        unlocked:
            () =>
                poundsLostFromStart() >= 5
    },

    {
        id: "boss-269",
        tier: "silver",
        icon: "🥈",
        name: "Break the 270 Barrier",
        description:
            "Reach 269 lb.",
        secret: false,
        unlocked:
            () =>
                lowestRecordedWeight() <=
                269
    },

    {
        id: "lose-10",
        tier: "silver",
        icon: "🥈",
        name: "Ten Pounds of Loot Dropped",
        description:
            "Lose 10 lb.",
        secret: false,
        unlocked:
            () =>
                poundsLostFromStart() >= 10
    },

    {
        id: "streak-7",
        tier: "silver",
        icon: "🥈",
        name: "Seven Days Strong",
        description:
            "Reach a 7-day streak.",
        secret: false,
        unlocked:
            () =>
                maxHistoricalStreak() >= 7
    },

    {
        id: "lunch-10",
        tier: "silver",
        icon: "🥈",
        name: "Meal Prep Apprentice",
        description:
            "Complete 10 Planned Healthy Lunch quests.",
        secret: false,
        unlocked:
            () =>
                plannedLunchCount() >= 10
    },

    {
        id: "junk-10",
        tier: "silver",
        icon: "🥈",
        name: "Convenience Store Resistance",
        description:
            "Complete No Unplanned Junk Run 10 times.",
        secret: false,
        unlocked:
            () =>
                junkFreeCount() >= 10
    },

    {
        id: "activity-10",
        tier: "silver",
        icon: "🥈",
        name: "Road-Worn Boots",
        description:
            "Complete Activity 10 times.",
        secret: false,
        unlocked:
            () =>
                activityDayCount() >= 10
    },

    {
        id: "hydration-10",
        tier: "silver",
        icon: "🥈",
        name: "Well Hydrated Adventurer",
        description:
            "Hit hydration target 10 times.",
        secret: false,
        unlocked:
            () =>
                hydrationDayCount() >= 10
    },

    {
        id: "vegetables-10",
        tier: "silver",
        icon: "🥈",
        name: "Vegetable Enthusiast, Apparently",
        description:
            "Complete Vegetables 10 times.",
        secret: false,
        unlocked:
            () =>
                vegetableDayCount() >= 10
    },

    {
        id: "perfect-5",
        tier: "silver",
        icon: "🥈",
        name: "Five Perfect Encounters",
        description:
            "Accumulate 5 Perfect Days.",
        secret: false,
        unlocked:
            () =>
                perfectDayCount() >= 5
    },

    {
        id: "level-5",
        tier: "silver",
        icon: "🥈",
        name: "Level 5 Adventurer",
        description:
            "Reach Level 5.",
        secret: false,
        unlocked:
            () =>
                playerLevel() >= 5
    },

    {
        id: "boss-259",
        tier: "silver",
        icon: "🥈",
        name: "The 260 Gate",
        description:
            "Reach 259 lb.",
        secret: false,
        unlocked:
            () =>
                lowestRecordedWeight() <=
                259
    },

    {
        id: "streak-14",
        tier: "silver",
        icon: "🥈",
        name: "Two Weeks on the Road",
        description:
            "Reach a 14-day streak.",
        secret: false,
        unlocked:
            () =>
                maxHistoricalStreak() >= 14
    },

    {
        id: "lose-20",
        tier: "silver",
        icon: "🥈",
        name: "Twenty Pounds Gone",
        description:
            "Lose 20 lb.",
        secret: false,
        unlocked:
            () =>
                poundsLostFromStart() >= 20
    },

    {
        id: "boss-249",
        tier: "gold",
        icon: "🥇",
        name: "Farewell, 250s",
        description:
            "Reach 249 lb.",
        secret: false,
        unlocked:
            () =>
                lowestRecordedWeight() <=
                249
    },

    {
        id: "lose-25",
        tier: "gold",
        icon: "🥇",
        name: "Quarter-Century Club",
        description:
            "Lose 25 lb.",
        secret: false,
        unlocked:
            () =>
                poundsLostFromStart() >= 25
    },

    {
        id: "lunch-25",
        tier: "gold",
        icon: "🥇",
        name: "Lunch Is a Meal Now",
        description:
            "Complete 25 Planned Healthy Lunch quests.",
        secret: false,
        unlocked:
            () =>
                plannedLunchCount() >= 25
    },

    {
        id: "junk-25",
        tier: "gold",
        icon: "🥇",
        name: "C-Store? Never Heard of Her",
        description:
            "Complete No Unplanned Junk Run 25 times.",
        secret: false,
        unlocked:
            () =>
                junkFreeCount() >= 25
    },

    {
        id: "activity-25",
        tier: "gold",
        icon: "🥇",
        name: "Constitution +2",
        description:
            "Complete Activity 25 times.",
        secret: false,
        unlocked:
            () =>
                activityDayCount() >= 25
    },

    {
        id: "hydration-25",
        tier: "gold",
        icon: "🥇",
        name: "Aquatic Alignment",
        description:
            "Hit hydration target 25 times.",
        secret: false,
        unlocked:
            () =>
                hydrationDayCount() >= 25
    },

    {
        id: "vegetables-25",
        tier: "gold",
        icon: "🥇",
        name: "The Broccoli Pact",
        description:
            "Complete Vegetables 25 times.",
        secret: false,
        unlocked:
            () =>
                vegetableDayCount() >= 25
    },

    {
        id: "perfect-10",
        tier: "gold",
        icon: "🥇",
        name: "Ten Perfect Days",
        description:
            "Accumulate 10 Perfect Days.",
        secret: false,
        unlocked:
            () =>
                perfectDayCount() >= 10
    },

    {
        id: "level-10",
        tier: "gold",
        icon: "🥇",
        name: "Level 10 Adventurer",
        description:
            "Reach Level 10.",
        secret: false,
        unlocked:
            () =>
                playerLevel() >= 10
    },

    {
        id: "streak-21",
        tier: "gold",
        icon: "🥇",
        name: "Three Weeks Without a TPK",
        description:
            "Reach a 21-day streak.",
        secret: false,
        unlocked:
            () =>
                maxHistoricalStreak() >= 21
    },

    {
        id: "lose-30",
        tier: "gold",
        icon: "🥇",
        name: "Thirty Pounds Lighter",
        description:
            "Lose 30 lb.",
        secret: false,
        unlocked:
            () =>
                poundsLostFromStart() >= 30
    },

    {
        id: "boss-239",
        tier: "gold",
        icon: "🥇",
        name: "Into the 230s",
        description:
            "Reach 239 lb.",
        secret: false,
        unlocked:
            () =>
                lowestRecordedWeight() <=
                239
    },

    {
        id: "all-quests-25",
        tier: "diamond",
        icon: "💎",
        name: "Habitual Adventurer",
        description:
            "Complete each daily quest type at least 25 times.",
        secret: false,
        unlocked:
            () =>
                plannedLunchCount() >= 25 &&
                junkFreeCount() >= 25 &&
                activityDayCount() >= 25 &&
                hydrationDayCount() >= 25 &&
                vegetableDayCount() >= 25
    },

    {
        id: "perfect-25",
        tier: "diamond",
        icon: "💎",
        name: "Perfect Month-ish",
        description:
            "Accumulate 25 Perfect Days.",
        secret: false,
        unlocked:
            () =>
                perfectDayCount() >= 25
    },

    {
        id: "lunch-50",
        tier: "diamond",
        icon: "💎",
        name: "Iron Rations",
        description:
            "Complete 50 Planned Healthy Lunch quests.",
        secret: false,
        unlocked:
            () =>
                plannedLunchCount() >= 50
    },

    {
        id: "junk-50",
        tier: "diamond",
        icon: "💎",
        name: "The C-Store Has Forgotten Your Name",
        description:
            "Complete No Unplanned Junk Run 50 times.",
        secret: false,
        unlocked:
            () =>
                junkFreeCount() >= 50
    },

    {
        id: "activity-50",
        tier: "diamond",
        icon: "💎",
        name: "Walker, Texas Ranger",
        description:
            "Complete Activity 50 times.",
        secret: false,
        unlocked:
            () =>
                activityDayCount() >= 50
    },

    {
        id: "hydration-50",
        tier: "diamond",
        icon: "💎",
        name: "Poseidon's Drinking Buddy",
        description:
            "Hit hydration target 50 times.",
        secret: false,
        unlocked:
            () =>
                hydrationDayCount() >= 50
    },

    {
        id: "vegetables-50",
        tier: "diamond",
        icon: "💎",
        name: "Vegetable Arc Complete",
        description:
            "Complete Vegetables 50 times.",
        secret: false,
        unlocked:
            () =>
                vegetableDayCount() >= 50
    },

    {
        id: "streak-30",
        tier: "diamond",
        icon: "💎",
        name: "Thirty-Day Streak",
        description:
            "Reach a 30-day streak.",
        secret: false,
        unlocked:
            () =>
                maxHistoricalStreak() >= 30
    },

    {
        id: "level-15",
        tier: "diamond",
        icon: "💎",
        name: "Level 15 Adventurer",
        description:
            "Reach Level 15.",
        secret: false,
        unlocked:
            () =>
                playerLevel() >= 15
    },

    {
        id: "lose-40",
        tier: "diamond",
        icon: "💎",
        name: "Forty Pounds Gone",
        description:
            "Lose 40 lb.",
        secret: false,
        unlocked:
            () =>
                poundsLostFromStart() >= 40
    },

    {
        id: "boss-229",
        tier: "diamond",
        icon: "💎",
        name: "Approach Goal Territory",
        description:
            "Reach 229 lb.",
        secret: false,
        unlocked:
            () =>
                lowestRecordedWeight() <=
                229
    },

    {
        id: "lose-50",
        tier: "diamond",
        icon: "💎",
        name: "Half-Century Down",
        description:
            "Lose 50 lb.",
        secret: false,
        unlocked:
            () =>
                poundsLostFromStart() >= 50
    },

    {
        id: "any-quest-100",
        tier: "legendary",
        icon: "🐉",
        name: "The Hundred Club",
        description:
            "Complete any individual daily quest 100 times.",
        secret: false,
        unlocked:
            () =>
                Math.max(
                    plannedLunchCount(),
                    junkFreeCount(),
                    activityDayCount(),
                    hydrationDayCount(),
                    vegetableDayCount()
                ) >= 100
    },

    {
        id: "lunch-100",
        tier: "legendary",
        icon: "🐉",
        name: "Dungeon Master of Lunch",
        description:
            "Complete 100 Planned Healthy Lunch quests.",
        secret: false,
        unlocked:
            () =>
                plannedLunchCount() >= 100
    },

    {
        id: "hydration-100",
        tier: "legendary",
        icon: "🐉",
        name: "Hydration Is Just a Passive Ability Now",
        description:
            "Hit hydration target 100 times.",
        secret: false,
        unlocked:
            () =>
                hydrationDayCount() >= 100
    },

    {
        id: "perfect-100",
        tier: "legendary",
        icon: "🐉",
        name: "One Hundred Perfect Days",
        description:
            "Accumulate 100 Perfect Days.",
        secret: false,
        unlocked:
            () =>
                perfectDayCount() >= 100
    },

    {
        id: "level-25",
        tier: "legendary",
        icon: "🐉",
        name: "Level 25 Adventurer",
        description:
            "Reach Level 25.",
        secret: false,
        unlocked:
            () =>
                playerLevel() >= 25
    },

    {
        id: "activity-180",
        tier: "legendary",
        icon: "🐉",
        name: "The Long Campaign",
        description:
            "Record Activity on 180 distinct days.",
        secret: false,
        unlocked:
            () =>
                activityDayCount() >= 180
    },

    {
        id: "boss-220",
        tier: "legendary",
        icon: "🐉",
        name: "Final Boss",
        description:
            "Reach 220 lb.",
        secret: false,
        unlocked:
            () =>
                lowestRecordedWeight() <=
                220
    },

    {
        id: "roll-credits",
        tier: "legendary",
        icon: "🐉",
        name: "Roll Credits",
        description:
            "Reach goal territory and defeat every weight boss.",
        secret: false,
        unlocked:
            () =>
                lowestRecordedWeight() <=
                220
    },


    /* SECRET ACHIEVEMENTS */

    {
        id: "secret-overachiever",
        tier: "secret",
        icon: "❓",
        name: "Overachiever",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                Object.values(history)
                .some(
                    record =>
                        Number(
                            record.water || 0
                        ) >= 100
                )
    },
    
    {
        id: "secret-critical-hit",
        tier: "secret",
        icon: "❓",
        name: "Critical Hit",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                hasPerfectDayAtNewLow()
    },
    
    {
        id: "secret-natural-20",
        tier: "secret",
        icon: "❓",
        name: "Natural 20",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                perfectDayCount() >= 20
    },
    
    {
        id: "secret-bell",
        tier: "secret",
        icon: "❓",
        name: "I Didn't Hear No Bell",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                largestHistoryGapBeforeActivity() >= 7
    },
    
    {
        id: "secret-comeback",
        tier: "secret",
        icon: "❓",
        name: "The Comeback Kid",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                hasPerfectReturnAfterGap(
                    30
                )
    },
    
    {
        id: "secret-inventory",
        tier: "secret",
        icon: "❓",
        name: "Inventory Management",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                questComboCount(
                    [
                        "lunch",
                        "junk",
                        "vegetables"
                    ]
                ) >= 10
    },
    
    {
        id: "secret-side-quest",
        tier: "secret",
        icon: "❓",
        name: "Side Quest Enjoyer",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                activityDayCount() >= 50
    },
    
    {
        id: "secret-potion",
        tier: "secret",
        icon: "❓",
        name: "Potion Addiction, But Healthy",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                countExactWaterDays(
                    64
                ) >= 20
    },
    
    {
        id: "secret-minmax",
        tier: "secret",
        icon: "❓",
        name: "Min-Maxed Constitution",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                questComboCount(
                    [
                        "activity",
                        "hydration",
                        "vegetables"
                    ]
                ) >= 25
    },
    
    {
        id: "secret-no-damage",
        tier: "secret",
        icon: "❓",
        name: "No Damage Run",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                longestPerfectDayStreak() >= 7
    },
    
    {
        id: "secret-flawless",
        tier: "secret",
        icon: "❓",
        name: "Flawless Victory",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                longestPerfectDayStreak() >= 14
    },
    
    {
        id: "secret-streak-100",
        tier: "secret",
        icon: "❓",
        name: "What Do We Say to the God of Death?",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                maxHistoricalStreak() >= 100
    },
    
    {
        id: "secret-new-game-plus",
        tier: "secret",
        icon: "❓",
        name: "New Game+",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                lowestRecordedWeight() <= 220 &&
                perfectDayCount() >= 100
    },
    
    {
        id: "secret-activity-250",
        tier: "secret",
        icon: "❓",
        name: "Touch Grass: Legendary Edition",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                activityDayCount() >= 250
    },
    
    {
        id: "secret-achievement-problem",
        tier: "secret",
        icon: "❓",
        name: "Achievement Unlocked: Achievement Problem",
        description:
            "Secret achievement unlocked.",
        secret: true,
        unlocked:
            () =>
                Object.keys(
                    getUnlockedAchievements()
                ).length >= 50
    }

];
