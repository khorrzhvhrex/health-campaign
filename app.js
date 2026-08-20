/* ============================
   CONFIG
============================ */

const START_WEIGHT = 276;

const HYDRATION_TARGET = 64;

const BLOODWORK_RAID_TARGET_DATE =
    "2027-02-18";


/* ============================
   BLOODWORK BASELINE
============================ */

const BLOODWORK_BASELINE = {

    date: "2026-08-18",

    metrics: [

        {
            id: "glucose",
            name: "Glucose (Fasting)",
            unit: "mg/dL",
            baseline: 120,
            reference: "70–99 mg/dL",
            normal:
                value =>
                    value >= 70 &&
                    value <= 99
        },

        {
            id: "cholesterol",
            name: "Cholesterol",
            unit: "mg/dL",
            baseline: 209,
            reference: "<200 mg/dL",
            normal:
                value =>
                    value < 200
        },

        {
            id: "triglycerides",
            name: "Triglycerides",
            unit: "mg/dL",
            baseline: 131,
            reference: "<150 mg/dL",
            normal:
                value =>
                    value < 150
        },

        {
            id: "hdl",
            name: "HDL Cholesterol",
            unit: "mg/dL",
            baseline: 42,
            reference:
                ">40 mg/dL • ≥60 negative-risk value",
            normal:
                value =>
                    value > 40
        },

        {
            id: "ldl",
            name: "LDL Cholesterol",
            unit: "mg/dL",
            baseline: 144,
            reference: "<100 mg/dL",
            normal:
                value =>
                    value < 100
        },

        {
            id: "vldl",
            name: "VLDL Cholesterol",
            unit: "mg/dL",
            baseline: 23,
            reference: "<30 mg/dL",
            normal:
                value =>
                    value < 30
        },

        {
            id: "ratio",
            name: "Cholesterol / HDL Ratio",
            unit: "",
            baseline: 5.0,
            reference: "<4.5",
            normal:
                value =>
                    value < 4.5
        }

    ]

};


const QUESTS = [
    {
        id: "lunch",
        name: "🥗 Planned healthy lunch",
        sub: "Real meal instead of convenience-store improvising",
        xp: 30
    },
    {
        id: "junk",
        name: "🚫 No unplanned junk run",
        sub: "Intentional food beats grazing",
        xp: 20
    },
    {
        id: "activity",
        name: "🚶 20+ minutes activity",
        sub: "Walking absolutely counts",
        xp: 20
    },
    {
        id: "hydration",
        name: "💧 Hydration target",
        sub: `${HYDRATION_TARGET} oz today`,
        xp: 20
    },
    {
        id: "vegetables",
        name: "🥦 Vegetables with 2+ meals",
        sub: "Build fiber into the day",
        xp: 10
    }
];

const BOSSES = [
    {
        target: 269,
        name: "Break the 270 Barrier"
    },
    {
        target: 259,
        name: "The 260 Gate"
    },
    {
        target: 249,
        name: "Farewell, 250s"
    },
    {
        target: 239,
        name: "Into the 230s"
    },
    {
        target: 229,
        name: "Approach Goal Territory"
    },
    {
        target: 220,
        name: "Final Boss"
    }
];


/* ============================
   LOCAL DATE
============================ */

function localDateKey(date = new Date()) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const TODAY =
    localDateKey();


/* ============================
   DATA
============================ */

let history =
    JSON.parse(
        localStorage.getItem(
            "health-history"
        )
    ) || {};

let currentWeight =
    Number(
        localStorage.getItem(
            "health-weight"
        )
    ) || START_WEIGHT;


/* ============================
   MIGRATE OLD DAILY STORAGE
============================ */

function migrateOldData() {

    const oldKey =
        "health-" + TODAY;

    const oldDay =
        JSON.parse(
            localStorage.getItem(oldKey)
        );

    if (
        oldDay &&
        !history[TODAY]
    ) {

        history[TODAY] = {
            quests:
                Array.isArray(oldDay.quests)
                ? oldDay.quests
                : [false,false,false,false,false],

            water:
                Number(oldDay.water || 0)
        };

        saveHistory();
    }
}

migrateOldData();


/* ============================
   TODAY RECORD
============================ */

if (!history[TODAY]) {

    history[TODAY] = {
        quests: [
            false,
            false,
            false,
            false,
            false
        ],
        water: 0
    };
}

let todayRecord =
    history[TODAY];

if (
    !Array.isArray(
        todayRecord.quests
    )
) {

    todayRecord.quests = [
        false,
        false,
        false,
        false,
        false
    ];
}

todayRecord.water =
    Number(
        todayRecord.water || 0
    );


/* ============================
   SAVE
============================ */

function saveHistory() {

    localStorage.setItem(
        "health-history",
        JSON.stringify(history)
    );

    /*
      Continue writing old key
      for compatibility with V1.
    */

    localStorage.setItem(
        "health-" + TODAY,
        JSON.stringify({
            quests:
                todayRecord.quests,

            water:
                todayRecord.water
        })
    );
}


/* ============================
   XP
============================ */

function recordXP(record) {

    if (
        !record ||
        !Array.isArray(record.quests)
    ) {
        return 0;
    }

    return record.quests.reduce(
        (sum, completed, i) =>
            sum +
            (
                completed
                ? QUESTS[i].xp
                : 0
            ),
        0
    );
}

function lifetimeXP() {

    return Object.values(history)
        .reduce(
            (sum, record) =>
                sum + recordXP(record),
            0
        );
}

function playerLevel() {

    /*
      500 XP per level.
    */

    return (
        Math.floor(
            lifetimeXP() / 500
        ) + 1
    );
}
  

/* ============================
   ACHIEVEMENT STORAGE
============================ */

function getUnlockedAchievements() {

    return JSON.parse(
        localStorage.getItem(
            "health-achievements"
        )
    ) || {};
}


function saveUnlockedAchievements(
    achievements
) {

    localStorage.setItem(
        "health-achievements",
        JSON.stringify(
            achievements
        )
    );
}


/* ============================
   CAMPAIGN STAT HELPERS
============================ */

function allHistoryEntries() {

    return Object.entries(history)
        .sort(
            ([a], [b]) =>
                a.localeCompare(b)
        );
}


function questCompletionCount(
    questId
) {

    const index =
        QUESTS.findIndex(
            quest =>
                quest.id ===
                questId
        );


    if (index === -1) {
        return 0;
    }


    return Object.values(history)
        .filter(
            record =>
                Array.isArray(
                    record.quests
                ) &&
                record.quests[index] ===
                    true
        )
        .length;
}


function activityDayCount() {

    return questCompletionCount(
        "activity"
    );
}


function hydrationDayCount() {

    return questCompletionCount(
        "hydration"
    );
}


function plannedLunchCount() {

    return questCompletionCount(
        "lunch"
    );
}


function junkFreeCount() {

    return questCompletionCount(
        "junk"
    );
}


function vegetableDayCount() {

    return questCompletionCount(
        "vegetables"
    );
}


function lowestRecordedWeight() {

    const weights = [
        currentWeight
    ];


    Object.values(history)
        .forEach(
            record => {

                if (
                    record.weight !==
                    undefined
                ) {

                    const value =
                        Number(
                            record.weight
                        );


                    if (
                        Number.isFinite(
                            value
                        )
                    ) {

                        weights.push(
                            value
                        );
                    }
                }
            }
        );


    return Math.min(
        ...weights
    );
}


function poundsLostFromStart() {

    return Math.max(
        0,
        START_WEIGHT -
        lowestRecordedWeight()
    );
}


function perfectDayCount() {

    return Object.values(history)
        .filter(
            record =>
                recordXP(record) ===
                100
        )
        .length;
}


function maxHistoricalStreak() {

    const dates =
        Object.keys(history)
        .sort();


    let best = 0;
    let current = 0;
    let previousDate = null;


    dates.forEach(
        date => {

            const record =
                history[date];


            if (
                recordXP(record) === 0
            ) {

                current = 0;
                previousDate = null;
                return;
            }


            const thisDate =
                new Date(
                    date +
                    "T12:00:00"
                );


            if (!previousDate) {

                current = 1;
            }

            else {

                const diff =
                    Math.round(
                        (
                            thisDate -
                            previousDate
                        ) /
                        86400000
                    );


                if (diff === 1) {

                    current++;
                }

                else {

                    current = 1;
                }
            }


            best =
                Math.max(
                    best,
                    current
                );


            previousDate =
                thisDate;
        }
    );


    return best;
}

function countDaysMatching(
    predicate
) {

    return Object.values(history)
        .filter(
            record =>
                predicate(record)
        )
        .length;
}


function questComboCount(
    questIds
) {

    const indexes =
        questIds
        .map(
            id =>
                QUESTS.findIndex(
                    quest =>
                        quest.id === id
                )
        );


    return countDaysMatching(
        record => {

            if (
                !Array.isArray(
                    record.quests
                )
            ) {
                return false;
            }


            return indexes.every(
                index =>
                    index >= 0 &&
                    record.quests[index] ===
                        true
            );
        }
    );
}


function countExactWaterDays(
    ounces
) {

    return countDaysMatching(
        record =>
            Number(
                record.water || 0
            ) === ounces
    );
}


function longestPerfectDayStreak() {

    const dates =
        Object.keys(history)
        .sort();


    let best = 0;
    let current = 0;
    let previousDate = null;


    dates.forEach(
        date => {

            const record =
                history[date];


            if (
                recordXP(record) !== 100
            ) {

                current = 0;
                previousDate = null;
                return;
            }


            const thisDate =
                new Date(
                    date +
                    "T12:00:00"
                );


            if (!previousDate) {

                current = 1;
            }

            else {

                const diff =
                    Math.round(
                        (
                            thisDate -
                            previousDate
                        ) /
                        86400000
                    );


                current =
                    diff === 1
                    ? current + 1
                    : 1;
            }


            best =
                Math.max(
                    best,
                    current
                );


            previousDate =
                thisDate;
        }
    );


    return best;
}


function largestHistoryGapBeforeActivity() {

    const activeDates =
        Object.entries(history)
        .filter(
            ([, record]) =>
                recordXP(record) > 0
        )
        .map(
            ([date]) => date
        )
        .sort();


    let largestGap = 0;


    for (
        let i = 1;
        i < activeDates.length;
        i++
    ) {

        const previous =
            new Date(
                activeDates[i - 1] +
                "T12:00:00"
            );

        const current =
            new Date(
                activeDates[i] +
                "T12:00:00"
            );


        const gap =
            Math.round(
                (
                    current -
                    previous
                ) /
                86400000
            ) - 1;


        largestGap =
            Math.max(
                largestGap,
                gap
            );
    }


    return largestGap;
}


function hasPerfectReturnAfterGap(
    minimumGapDays
) {

    const dates =
        Object.keys(history)
        .sort();


    let previousActiveDate =
        null;


    for (
        const date of dates
    ) {

        const record =
            history[date];

        const xp =
            recordXP(record);


        if (xp === 0) {
            continue;
        }


        const currentDate =
            new Date(
                date +
                "T12:00:00"
            );


        if (
            previousActiveDate
        ) {

            const gap =
                Math.round(
                    (
                        currentDate -
                        previousActiveDate
                    ) /
                    86400000
                ) - 1;


            if (
                gap >= minimumGapDays &&
                xp === 100
            ) {

                return true;
            }
        }


        previousActiveDate =
            currentDate;
    }


    return false;
}


function hasPerfectDayAtNewLow() {

    const entries =
        allHistoryEntries();


    let lowestSoFar =
        START_WEIGHT;


    for (
        const [, record] of entries
    ) {

        if (
            record.weight ===
                undefined
        ) {
            continue;
        }


        const weight =
            Number(
                record.weight
            );


        if (
            !Number.isFinite(
                weight
            )
        ) {
            continue;
        }


        const isNewLow =
            weight < lowestSoFar;


        if (
            isNewLow &&
            recordXP(record) === 100
        ) {

            return true;
        }


        lowestSoFar =
            Math.min(
                lowestSoFar,
                weight
            );
    }


    return false;
}


/* ============================
   STREAK
============================ */

function calculateStreak() {

    let streak = 0;

    const cursor =
        new Date();

    for (
        let i = 0;
        i < 1000;
        i++
    ) {

        const key =
            localDateKey(cursor);

        const record =
            history[key];

        if (!record)
            break;

        if (
            recordXP(record) === 0
        )
            break;

        streak++;

        cursor.setDate(
            cursor.getDate() - 1
        );
    }

    return streak;
}


/* ============================
   ACHIEVEMENTS
============================ */


function evaluateAchievements() {

    const unlocked =
        getUnlockedAchievements();

    const newlyUnlocked = [];


    ACHIEVEMENTS.forEach(
        achievement => {

            if (
                unlocked[
                    achievement.id
                ]
            ) {

                return;
            }


            if (
                achievement.unlocked()
            ) {

                unlocked[
                    achievement.id
                ] = {
                    unlockedAt:
                        new Date()
                        .toISOString()
                };


                newlyUnlocked.push(
                    achievement
                );
            }
        }
    );


    if (
        newlyUnlocked.length > 0
    ) {

        saveUnlockedAchievements(
            unlocked
        );


        newlyUnlocked.forEach(
            achievement => {

                toast(
                    `🏆 ${achievement.name}`
                );
            }
        );
    }


    return unlocked;
}


/* ============================
   PERFECT DAYS
============================ */

function countPerfectDays() {

    return Object.values(history)
        .filter(
            record =>
                recordXP(record) === 100
        )
        .length;
}


/* ============================
   QUEST UI
============================ */

function buildQuestList() {

    const container =
        document.getElementById(
            "questList"
        );

    container.innerHTML = "";

    QUESTS.forEach(
        (quest, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "quest";

            button.dataset.index =
                index;

            button.innerHTML = `
                <span class="quest-check">
                    ✓
                </span>

                <span class="quest-info">
                    <span class="quest-name">
                        ${quest.name}
                    </span>

                    <span class="quest-sub">
                        ${quest.sub}
                    </span>
                </span>

                <span class="quest-xp">
                    +${quest.xp}
                </span>
            `;

            button.addEventListener(
                "click",
                () => {

                    /*
                      Hydration quest is
                      normally automatic,
                      but manual override
                      remains allowed.
                    */

                    todayRecord
                        .quests[index] =
                        !todayRecord
                            .quests[index];

                    saveHistory();

                    updateUI();
                }
            );

            container.appendChild(
                button
            );
        }
    );
}


/* ============================
   WATER
============================ */

let lastWaterChange = 0;

document
.querySelectorAll(
    "[data-water]"
)
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const amount =
                Number(
                    button.dataset.water
                );

            lastWaterChange =
                amount;

            todayRecord.water +=
                amount;

            autoHydrationQuest();

            saveHistory();

            updateUI();

            toast(
                `💧 +${amount} oz`
            );
        }
    );
});


function autoHydrationQuest() {

    const hydrationIndex =
        QUESTS.findIndex(
            quest =>
                quest.id ===
                "hydration"
        );

    if (
        todayRecord.water >=
        HYDRATION_TARGET
    ) {

        todayRecord
            .quests[
                hydrationIndex
            ] = true;
    }

    else {

        todayRecord
            .quests[
                hydrationIndex
            ] = false;
    }
}


document
.getElementById(
    "undoWater"
)
.addEventListener(
    "click",
    () => {

        if (
            lastWaterChange <= 0
        )
            return;

        todayRecord.water =
            Math.max(
                0,
                todayRecord.water -
                lastWaterChange
            );

        lastWaterChange = 0;

        autoHydrationQuest();

        saveHistory();

        updateUI();
    }
);


document
.getElementById(
    "resetWater"
)
.addEventListener(
    "click",
    () => {

        todayRecord.water = 0;

        lastWaterChange = 0;

        autoHydrationQuest();

        saveHistory();

        updateUI();
    }
);


/* ============================
   WEIGHT
============================ */

document
.getElementById(
    "saveWeight"
)
.addEventListener(
    "click",
    saveWeight
);


document
.getElementById(
    "weightInput"
)
.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {
            saveWeight();
        }
    }
);


function saveWeight() {

    const input =
        document.getElementById(
            "weightInput"
        );

    const value =
        Number(
            input.value
        );

    if (
        !value ||
        value < 100 ||
        value > 500
    ) {

        toast(
            "Enter a valid weight"
        );

        return;
    }

    currentWeight = value;

    localStorage.setItem(
        "health-weight",
        String(currentWeight)
    );

    history[TODAY].weight =
        currentWeight;

    saveHistory();

    input.value = "";

    toast(
        `⚖️ ${value.toFixed(1)} lb logged`
    );

    updateUI();
}


/* ============================
   CURRENT BOSS
============================ */

function currentBoss() {

    return (
        BOSSES.find(
            boss =>
                currentWeight >
                boss.target
        )
        ||
        BOSSES[
            BOSSES.length - 1
        ]
    );
}


function updateBossUI() {

    const boss =
        currentBoss();

    const bossIndex =
        BOSSES.indexOf(boss);

    const start =
        bossIndex === 0
        ? START_WEIGHT
        : BOSSES[
            bossIndex - 1
        ].target;

    const requiredLoss =
        start - boss.target;

    const progressLoss =
        start - currentWeight;

    const percent =
        Math.max(
            0,
            Math.min(
                100,
                (
                    progressLoss /
                    requiredLoss
                ) * 100
            )
        );

    const remaining =
        Math.max(
            0,
            currentWeight -
            boss.target
        );

    document
    .getElementById(
        "bossName"
    )
    .textContent =
        boss.name;

    document
    .getElementById(
        "bossWeight"
    )
    .textContent =
        `${currentWeight.toFixed(1)} → ${boss.target} lb`;

    document
    .getElementById(
        "bossBar"
    )
    .style.width =
        `${percent}%`;

    document
    .getElementById(
        "bossRemaining"
    )
    .textContent =
        `${remaining.toFixed(1)} lb`;

    document
    .getElementById(
        "bossPercent"
    )
    .textContent =
        `${Math.round(percent)}%`;
}


/* ============================
   WEEKLY HISTORY HELPERS
============================ */

function recentDateKeys(
    count
) {

    const dates = [];

    const cursor =
        new Date();


    for (
        let i = 0;
        i < count;
        i++
    ) {

        dates.push(
            localDateKey(
                cursor
            )
        );

        cursor.setDate(
            cursor.getDate() - 1
        );
    }


    return dates.reverse();
}


function questCountForRecord(
    record
) {

    if (
        !record ||
        !Array.isArray(
            record.quests
        )
    ) {

        return 0;
    }


    return record.quests
        .filter(Boolean)
        .length;
}


function renderWeeklySummary() {

    const keys =
        recentDateKeys(7);


    const records =
        keys.map(
            key => ({
                date: key,
                record:
                    history[key] || null
            })
        );


    const totalXP =
        records.reduce(
            (sum, item) =>
                sum +
                recordXP(
                    item.record
                ),
            0
        );


    const averageXP =
        Math.round(
            totalXP / 7
        );


    const totalQuests =
        records.reduce(
            (sum, item) =>
                sum +
                questCountForRecord(
                    item.record
                ),
            0
        );


    const perfectDays =
        records.filter(
            item =>
                recordXP(
                    item.record
                ) === 100
        ).length;


    const hydrationIndex =
        QUESTS.findIndex(
            quest =>
                quest.id ===
                "hydration"
        );


    const lunchIndex =
        QUESTS.findIndex(
            quest =>
                quest.id ===
                "lunch"
        );


    const activityIndex =
        QUESTS.findIndex(
            quest =>
                quest.id ===
                "activity"
        );


    const hydrationDays =
        records.filter(
            item =>
                item.record &&
                Array.isArray(
                    item.record.quests
                ) &&
                item.record.quests[
                    hydrationIndex
                ] === true
        ).length;


    const lunchDays =
        records.filter(
            item =>
                item.record &&
                Array.isArray(
                    item.record.quests
                ) &&
                item.record.quests[
                    lunchIndex
                ] === true
        ).length;


    const activityDays =
        records.filter(
            item =>
                item.record &&
                Array.isArray(
                    item.record.quests
                ) &&
                item.record.quests[
                    activityIndex
                ] === true
        ).length;


    document
    .getElementById(
        "weekAverageXP"
    )
    .textContent =
        averageXP;


    document
    .getElementById(
        "weekQuestCount"
    )
    .textContent =
        totalQuests;


    document
    .getElementById(
        "weekPerfectDays"
    )
    .textContent =
        perfectDays;


    document
    .getElementById(
        "weekHydrationDays"
    )
    .textContent =
        hydrationDays;


    document
    .getElementById(
        "weekLunchDays"
    )
    .textContent =
        lunchDays;


    document
    .getElementById(
        "weekActivityDays"
    )
    .textContent =
        activityDays;


    renderWeeklyWeightTrend(
        records
    );
}


function renderWeeklyWeightTrend(
    records
) {

    const weighIns =
        records
        .filter(
            item =>
                item.record &&
                item.record.weight !==
                    undefined
        )
        .map(
            item => ({
                date:
                    item.date,

                weight:
                    Number(
                        item.record.weight
                    )
            })
        )
        .filter(
            item =>
                Number.isFinite(
                    item.weight
                )
        );


    const element =
        document.getElementById(
            "weekWeightSummary"
        );


    if (
        weighIns.length < 2
    ) {

        element.textContent =
            weighIns.length === 1
            ? `One weigh-in this week: ${weighIns[0].weight.toFixed(1)} lb`
            : "No weekly weight trend yet.";

        return;
    }


    const first =
        weighIns[0];

    const last =
        weighIns[
            weighIns.length - 1
        ];


    const change =
        last.weight -
        first.weight;


    let direction =
        "No change";


    if (
        change < 0
    ) {

        direction =
            `Down ${Math.abs(change).toFixed(1)} lb`;
    }

    else if (
        change > 0
    ) {

        direction =
            `Up ${change.toFixed(1)} lb`;
    }


    element.innerHTML = `
        <strong>
            Weekly weight:
            ${first.weight.toFixed(1)}
            →
            ${last.weight.toFixed(1)} lb
        </strong>

        <br>

        ${direction}
        across
        ${weighIns.length}
        weigh-ins.
    `;
}


/* ============================
   CAMPAIGN JOURNAL EVENTS
============================ */

function achievementEventsByDate() {

    const events = {};

    const unlocked =
        getUnlockedAchievements();


    Object.entries(
        unlocked
    )
    .forEach(
        ([id, data]) => {

            if (
                !data ||
                !data.unlockedAt
            ) {

                return;
            }


            const achievement =
                ACHIEVEMENTS.find(
                    item =>
                        item.id === id
                );


            if (!achievement) {
                return;
            }


            const unlockDate =
                new Date(
                    data.unlockedAt
                );


            if (
                Number.isNaN(
                    unlockDate.getTime()
                )
            ) {

                return;
            }


            const key =
                localDateKey(
                    unlockDate
                );


            if (!events[key]) {
                events[key] = [];
            }


            events[key].push({
                type:
                    "achievement",

                text:
                    `🏆 ${achievement.name}`
            });
        }
    );


    return events;
}


function levelEventsByDate() {

    const events = {};

    const entries =
        allHistoryEntries();


    let cumulativeXP = 0;

    let previousLevel = 1;


    entries.forEach(
        ([date, record]) => {

            cumulativeXP +=
                recordXP(record);


            const level =
                Math.floor(
                    cumulativeXP / 500
                ) + 1;


            if (
                level >
                previousLevel
            ) {

                if (!events[date]) {
                    events[date] = [];
                }


                for (
                    let reached =
                        previousLevel + 1;

                    reached <= level;
                    reached++
                ) {

                    events[date].push({
                        type:
                            "level",

                        text:
                            `⚔️ Level ${reached} reached`
                    });
                }
            }


            previousLevel =
                level;
        }
    );


    return events;
}


function bossEventsByDate() {

    const events = {};

    const entries =
        allHistoryEntries();


    const defeated =
        new Set();


    entries.forEach(
        ([date, record]) => {

            if (
                record.weight ===
                    undefined
            ) {

                return;
            }


            const weight =
                Number(
                    record.weight
                );


            if (
                !Number.isFinite(
                    weight
                )
            ) {

                return;
            }


            BOSSES.forEach(
                boss => {

                    if (
                        defeated.has(
                            boss.target
                        )
                    ) {

                        return;
                    }


                    if (
                        weight <=
                        boss.target
                    ) {

                        defeated.add(
                            boss.target
                        );


                        if (!events[date]) {
                            events[date] = [];
                        }


                        events[date].push({
                            type:
                                "boss",

                            text:
                                `👹 BOSS DEFEATED — ${boss.name}`
                        });
                    }
                }
            );
        }
    );


    return events;
}


function bloodworkRaidEventsByDate() {

    const events = {};

    const saved =
        getRaidResults();


    if (
        !saved ||
        !saved.date
    ) {

        return events;
    }


    events[
        saved.date
    ] = [
        {
            type:
                "boss",

            text:
                "🧪 SIX-MONTH BLOODWORK RAID COMPLETED"
        }
    ];


    return events;
}


function combinedJournalEvents() {

    const maps = [
       achievementEventsByDate(),
       levelEventsByDate(),
       bossEventsByDate(),
       bloodworkRaidEventsByDate()
   ];


    const combined = {};


    maps.forEach(
        map => {

            Object.entries(
                map
            )
            .forEach(
                ([date, events]) => {

                    if (
                        !combined[date]
                    ) {

                        combined[date] =
                            [];
                    }


                    combined[date]
                        .push(
                            ...events
                        );
                }
            );
        }
    );


    return combined;
}


/* ============================
   HISTORY VIEW
============================ */

function renderHistory() {

    renderWeeklySummary();


    const container =
        document.getElementById(
            "historyList"
        );


    const entries =
        Object.entries(history)
        .sort(
            ([a], [b]) =>
                b.localeCompare(a)
        );


    const journalEvents =
        combinedJournalEvents();


    container.innerHTML = "";


    if (
        entries.length === 0
    ) {

        container.innerHTML = `
            <p class="muted small">
                No campaign records yet.
            </p>
        `;

        return;
    }


    entries.forEach(
        ([date, record]) => {

            const xp =
                recordXP(record);


            const completed =
                questCountForRecord(
                    record
                );


            const isPerfect =
                xp === 100;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "journal-entry" +
                (
                    isPerfect
                    ? " perfect"
                    : ""
                );


            const dateObj =
                new Date(
                    date +
                    "T12:00:00"
                );


            const pretty =
                dateObj
                .toLocaleDateString(
                    undefined,
                    {
                        weekday:
                            "short",

                        month:
                            "short",

                        day:
                            "numeric",

                        year:
                            "numeric"
                    }
                );


            const weightText =
                record.weight !==
                    undefined
                ? ` • ⚖️ ${Number(
                    record.weight
                  ).toFixed(1)} lb`
                : "";


            const waterText =
                `💧 ${Number(
                    record.water || 0
                )} oz`;


            const perfectText =
                isPerfect
                ? `
                    <div class="journal-perfect">
                        ✨ PERFECT DAY
                    </div>
                `
                : "";


            const events =
                journalEvents[
                    date
                ] || [];


            const eventHTML =
                events.length > 0
                ? `
                    <div class="journal-events">

                        ${events.map(
                            event => `
                                <div
                                    class="journal-event ${event.type}"
                                >
                                    ${event.text}
                                </div>
                            `
                        ).join("")}

                    </div>
                `
                : "";


            div.innerHTML = `
                <div class="journal-header">

                    <div>

                        <div class="journal-date">
                            ${pretty}
                        </div>

                        ${perfectText}

                    </div>

                    <div class="journal-xp">
                        ${xp} XP
                    </div>

                </div>


                <div class="journal-meta">

                    ${completed}/5 quests

                    •

                    ${waterText}

                    ${weightText}

                </div>


                ${eventHTML}
            `;


            container
                .appendChild(
                    div
                );
        }
    );
}


/* ============================
   BLOODWORK RAID
============================ */

function daysUntilRaid() {

    const today =
        new Date(
            TODAY +
            "T12:00:00"
        );

    const target =
        new Date(
            BLOODWORK_RAID_TARGET_DATE +
            "T12:00:00"
        );

    return Math.ceil(
        (
            target -
            today
        ) /
        86400000
    );
}


function renderRaidReadiness() {

    const container =
        document.getElementById(
            "raidReadiness"
        );

    const saved =
        getRaidResults();

    if (saved) {

        container.innerHTML = `
            <div class="raid-readiness-title">
                ⚔️ Raid Completed
            </div>

            <div class="raid-readiness-meta">
                Follow-up bloodwork has been logged.
            </div>
        `;

        return;
    }


    const days =
        daysUntilRaid();


    if (days > 0) {

        container.innerHTML = `
            <div class="raid-readiness-title">
                Raid Countdown
            </div>

            <div class="raid-readiness-big">
                ${days} days
            </div>

            <div class="raid-readiness-meta">
                Target encounter date:
                Feb 18, 2027
            </div>
        `;

        return;
    }


    container.innerHTML = `
        <div class="raid-readiness-title">
            ⚔️ RAID READY
        </div>

        <div class="raid-readiness-meta">
            The six-month follow-up window has arrived.
        </div>
    `;
}

function getRaidResults() {

    return JSON.parse(
        localStorage.getItem(
            "health-bloodwork-raid"
        )
    ) || null;
}


function saveRaidResultsData(
    data
) {

    localStorage.setItem(
        "health-bloodwork-raid",
        JSON.stringify(data)
    );
}


function formatBloodworkValue(
    metric,
    value
) {

    const numeric =
        Number(value);


    if (
        metric.id === "ratio"
    ) {

        return numeric.toFixed(1);
    }


    return metric.unit
       ? `${numeric} ${metric.unit}`
       : String(numeric);
}


function bloodworkStatus(
    metric,
    value
) {

    return metric.normal(
        Number(value)
    );
}

function classifyRaidMetric(
    metric,
    newValue
) {

    const baseline =
        metric.baseline;

    const baselineInRange =
        bloodworkStatus(
            metric,
            baseline
        );

    const newInRange =
        bloodworkStatus(
            metric,
            newValue
        );


    if (
        !baselineInRange &&
        newInRange
    ) {

        return {
            category:
                "entered-range",

            label:
                "Entered Reference Range"
        };
    }


    /*
      HDL improves upward.
      Everything else here improves downward.
    */

    const improved =
        metric.id === "hdl"
        ? newValue > baseline
        : newValue < baseline;


    const worsened =
        metric.id === "hdl"
        ? newValue < baseline
        : newValue > baseline;


    if (improved) {

        return {
            category:
                "improved",

            label:
                "Improved"
        };
    }


    if (worsened) {

        return {
            category:
                "worsened",

            label:
                "Moved Away From Baseline"
        };
    }


    return {
        category:
            "held",

        label:
            "Held the Line"
    };
}


function renderBaselineBloodwork() {

    const container =
        document.getElementById(
            "baselineBloodwork"
        );


    container.innerHTML =
        "";


    BLOODWORK_BASELINE.metrics
    .forEach(
        metric => {

            const inRange =
                bloodworkStatus(
                    metric,
                    metric.baseline
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "bloodwork-row";


            row.innerHTML = `
                <div class="bloodwork-row-top">

                    <span class="bloodwork-name">
                        ${metric.name}
                    </span>

                    <span class="bloodwork-value">
                        ${formatBloodworkValue(
                            metric,
                            metric.baseline
                        )}
                    </span>

                </div>

                <div class="bloodwork-reference">
                    Reference:
                    ${metric.reference}
                </div>

                <span
                    class="bloodwork-status ${
                        inRange
                        ? "in-range"
                        : "out-range"
                    }"
                >
                    ${
                        inRange
                        ? "Within reference"
                        : "Outside reference"
                    }
                </span>
            `;


            container
            .appendChild(
                row
            );
        }
    );
}


function buildRaidResultFields() {

    const container =
        document.getElementById(
            "raidResultFields"
        );


    container.innerHTML =
        "";


    const saved =
        getRaidResults();


    BLOODWORK_BASELINE.metrics
    .forEach(
        metric => {

            const field =
                document.createElement(
                    "div"
                );


            field.className =
                "raid-result-field";


            const savedValue =
                saved &&
                saved.results
                ? saved.results[
                    metric.id
                  ]
                : "";


            field.innerHTML = `
                <label
                    for="raid-${metric.id}"
                >
                    ${metric.name}
                </label>

                <div class="small muted">
                    Baseline:
                    ${formatBloodworkValue(
                        metric,
                        metric.baseline
                    )}
                    •
                    Reference:
                    ${metric.reference}
                </div>

                <input
                    id="raid-${metric.id}"
                    data-raid-metric="${metric.id}"
                    type="number"
                    inputmode="decimal"
                    step="0.1"
                    value="${savedValue}"
                >
            `;


            container
            .appendChild(
                field
            );
        }
    );


    if (
        saved &&
        saved.date
    ) {

        document
        .getElementById(
            "raidTestDate"
        )
        .value =
            saved.date;
    }
}


function renderRaidComparison() {

    const saved =
        getRaidResults();


    const container =
        document.getElementById(
            "raidComparison"
        );


    if (
        !saved ||
        !saved.date ||
        !saved.results
    ) {

        container
        .classList
        .add(
            "hidden"
        );

        return;
    }


    const date =
        new Date(
            saved.date +
            "T12:00:00"
        );


    const prettyDate =
        date.toLocaleDateString(
            undefined,
            {
                month:
                    "long",

                day:
                    "numeric",

                year:
                    "numeric"
            }
        );


    let rows = "";


    BLOODWORK_BASELINE.metrics
    .forEach(
        metric => {

            const newValue =
                Number(
                    saved.results[
                        metric.id
                    ]
                );


            if (
                !Number.isFinite(
                    newValue
                )
            ) {

                return;
            }


            const delta =
                newValue -
                metric.baseline;


            const deltaText =
                delta === 0
                ? "No change"
                : `${
                    delta > 0
                    ? "+"
                    : ""
                  }${delta.toFixed(
                      metric.id ===
                          "ratio"
                      ? 1
                      : 0
                  )}`;


            const inRange =
                bloodworkStatus(
                    metric,
                    newValue
                );


            rows += `
                <div class="raid-comparison-row">

                    <div class="bloodwork-name">
                        ${metric.name}
                    </div>

                    <div class="raid-comparison-values">

                        <div class="raid-old-value">
                            ${formatBloodworkValue(
                                metric,
                                metric.baseline
                            )}
                        </div>

                        <div class="raid-arrow">
                            →
                        </div>

                        <div class="raid-new-value">
                            ${formatBloodworkValue(
                                metric,
                                newValue
                            )}
                        </div>

                    </div>

                    <div class="raid-delta">
                        Change:
                        ${deltaText}
                        ${
                            metric.unit
                            ? ` ${metric.unit}`
                            : ""
                        }
                    </div>

                    <span
                        class="bloodwork-status ${
                            inRange
                            ? "in-range"
                            : "out-range"
                        }"
                    >
                        ${
                            inRange
                            ? "Within reference"
                            : "Outside reference"
                        }
                    </span>

                </div>
            `;
        }
    );


    container.innerHTML = `
        <div class="raid-comparison-title">
            ⚔️ Raid Results
        </div>

        <div class="raid-comparison-date">
            Follow-up test:
            ${prettyDate}
        </div>

        ${rows}

        <div class="raid-result-actions">

            <button
                class="raid-edit-btn"
                id="editRaidResults"
                type="button"
            >
                Edit Raid Results
            </button>

        </div>
    `;


    container
    .classList
    .remove(
        "hidden"
    );


    document
    .getElementById(
        "editRaidResults"
    )
    .addEventListener(
        "click",
        openRaidEntry
    );
}


function renderRaidResolution() {

    const saved =
        getRaidResults();

    const container =
        document.getElementById(
            "raidResolution"
        );


    if (
        !saved ||
        !saved.results
    ) {

        container.classList
            .add(
                "hidden"
            );

        return;
    }


    let enteredRange = 0;
    let improved = 0;
    let held = 0;
    let worsened = 0;

    let rows = "";


    BLOODWORK_BASELINE.metrics
    .forEach(
        metric => {

            const newValue =
                Number(
                    saved.results[
                        metric.id
                    ]
                );


            if (
                !Number.isFinite(
                    newValue
                )
            ) {

                return;
            }


            const outcome =
                classifyRaidMetric(
                    metric,
                    newValue
                );


            if (
                outcome.category ===
                    "entered-range"
            ) {
                enteredRange++;
            }

            else if (
                outcome.category ===
                    "improved"
            ) {
                improved++;
            }

            else if (
                outcome.category ===
                    "held"
            ) {
                held++;
            }

            else if (
                outcome.category ===
                    "worsened"
            ) {
                worsened++;
            }


            rows += `
                <div class="raid-outcome">

                    <strong>
                        ${metric.name}
                    </strong>

                    <div class="raid-outcome-note">
                        ${outcome.label}
                    </div>

                </div>
            `;
        }
    );


    const positive =
        enteredRange +
        improved;


    const resultBanner =
        positive >= 5
        ? `
            <div class="raid-victory">
                🏆 MAJOR RAID VICTORY
            </div>
        `
        : positive >= 3
        ? `
            <div class="raid-victory">
                ⚔️ RAID VICTORY
            </div>
        `
        : `
            <div class="raid-victory">
                📜 RAID COMPLETE
            </div>
        `;


    container.innerHTML = `
        <div class="raid-resolution-title">
            Raid Resolution
        </div>

        ${resultBanner}

        <div class="raid-resolution-grid">

            <div class="raid-resolution-stat">
                <strong>
                    ${enteredRange}
                </strong>
                <span>
                    ENTERED RANGE
                </span>
            </div>

            <div class="raid-resolution-stat">
                <strong>
                    ${improved}
                </strong>
                <span>
                    IMPROVED
                </span>
            </div>

            <div class="raid-resolution-stat">
                <strong>
                    ${held}
                </strong>
                <span>
                    HELD
                </span>
            </div>

            <div class="raid-resolution-stat">
                <strong>
                    ${worsened}
                </strong>
                <span>
                    MOVED AWAY
                </span>
            </div>

        </div>

        ${rows}
    `;


    container.classList
        .remove(
            "hidden"
        );
}


function openRaidEntry() {

    buildRaidResultFields();


    document
    .getElementById(
        "raidEntryPanel"
    )
    .classList
    .remove(
        "hidden"
    );


    document
    .getElementById(
        "toggleRaidEntry"
    )
    .classList
    .add(
        "hidden"
    );
}


function closeRaidEntry() {

    document
    .getElementById(
        "raidEntryPanel"
    )
    .classList
    .add(
        "hidden"
    );


    document
    .getElementById(
        "toggleRaidEntry"
    )
    .classList
    .remove(
        "hidden"
    );
}


function saveBloodworkRaid() {

    const date =
        document
        .getElementById(
            "raidTestDate"
        )
        .value;


    if (!date) {

        toast(
            "Select the bloodwork date"
        );

        return;
    }


    const results = {};


    let valid = true;


    BLOODWORK_BASELINE.metrics
    .forEach(
        metric => {

            const input =
                document
                .getElementById(
                    `raid-${metric.id}`
                );


            const value =
                Number(
                    input.value
                );


            if (
                input.value === "" ||
                !Number.isFinite(value) ||
                value < 0
            ) {

                valid = false;
                return;
            }


            results[
                metric.id
            ] = value;
        }
    );


    if (!valid) {

        toast(
            "Enter every raid result"
        );

        return;
    }


    const data = {

        date:
            date,

        results:
            results,

        savedAt:
            new Date()
            .toISOString()

    };


    saveRaidResultsData(
        data
    );


    closeRaidEntry();

    renderRaidComparison();

    renderRaidReadiness();
   
    renderRaidResolution();
   
   
    toast(
        "⚔️ Bloodwork Raid saved"
    );
}


/* ============================
   CAMPAIGN VIEW
============================ */

function renderCampaign() {

    const lost =
        Math.max(
            0,
            START_WEIGHT -
            currentWeight
        );

    document
    .getElementById(
        "campaignWeight"
    )
    .textContent =
        currentWeight
        .toFixed(1);

    document
    .getElementById(
        "poundsLost"
    )
    .textContent =
        lost.toFixed(1);

    document
    .getElementById(
        "campaignXP"
    )
    .textContent =
        lifetimeXP();

    document
    .getElementById(
        "perfectDays"
    )
    .textContent =
        countPerfectDays();


    const milestoneList =
        document.getElementById(
            "milestoneList"
        );

    milestoneList.innerHTML =
        "";

    BOSSES.forEach(
        boss => {

            const defeated =
                currentWeight <=
                boss.target;

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "milestone" +
                (
                    defeated
                    ? " complete"
                    : ""
                );

            row.innerHTML = `
                <div class="milestone-icon">
                    ${defeated
                        ? "✅"
                        : "👹"}
                </div>

                <div>
                    <strong>
                        ${boss.target} lb
                    </strong>

                    <div class="small muted">
                        ${boss.name}
                    </div>
                </div>
            `;

            milestoneList
                .appendChild(row);
        }
    );
}


/* ============================
   ACHIEVEMENT UI
============================ */

function renderAchievements() {

    const unlocked =
        evaluateAchievements();

    const unlockedIds =
        Object.keys(
            unlocked
        );


    document
    .getElementById(
        "achievementCount"
    )
    .textContent =
        `${unlockedIds.length} / ${ACHIEVEMENTS.length}`;


    const percent =
        Math.round(
            (
                unlockedIds.length /
                ACHIEVEMENTS.length
            ) * 100
        );


    document
    .getElementById(
        "achievementPercent"
    )
    .textContent =
        `${percent}%`;


    document
    .getElementById(
        "achievementBar"
    )
    .style.width =
        `${percent}%`;


    const list =
        document.getElementById(
            "achievementList"
        );


    list.innerHTML = "";


    ACHIEVEMENTS.forEach(
        achievement => {

            const isUnlocked =
                !!unlocked[
                    achievement.id
                ];


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "achievement-item" +
                (
                    isUnlocked
                    ? ""
                    : " achievement-locked"
                );


            let name =
                achievement.name;

            let description =
                achievement.description;

            let icon =
                achievement.icon;


            if (
                achievement.secret &&
                !isUnlocked
            ) {

                name =
                    "Secret Achievement";

                description =
                    "Requirement unknown.";

                icon =
                    "❓";
            }


            let dateText = "";


            if (isUnlocked) {

                const unlockedAt =
                    unlocked[
                        achievement.id
                    ].unlockedAt;


                if (unlockedAt) {

                    const date =
                        new Date(
                            unlockedAt
                        );


                    dateText = `
                        <div class="achievement-date">
                            Unlocked
                            ${date.toLocaleDateString()}
                        </div>
                    `;
                }
            }


            row.innerHTML = `
                <div class="achievement-top">

                    <div class="achievement-icon">
                        ${isUnlocked
                            ? icon
                            : "🔒"}
                    </div>

                    <div class="achievement-info">

                        <div class="achievement-name">
                            ${name}
                        </div>

                        <div class="achievement-description">
                            ${description}
                        </div>

                        ${dateText}

                    </div>

                </div>
            `;


            list.appendChild(
                row
            );
        }
    );


    renderRecentAchievement(
        unlocked
    );
}


function renderRecentAchievement(
    unlocked
) {

    const container =
        document.getElementById(
            "recentAchievement"
        );


    const entries =
        Object.entries(
            unlocked
        )
        .filter(
            ([id, data]) =>
                data.unlockedAt
        )
        .sort(
            ([, a], [, b]) =>
                b.unlockedAt
                .localeCompare(
                    a.unlockedAt
                )
        );


    if (
        entries.length === 0
    ) {

        container.innerHTML =
            `<p class="small muted">
                No achievements unlocked yet.
            </p>`;

        return;
    }


    const [
        id,
        data
    ] =
        entries[0];


    const achievement =
        ACHIEVEMENTS.find(
            item =>
                item.id === id
        );


    if (!achievement) {
        return;
    }


    container.innerHTML = `
        <div class="recent-unlock">

            <div class="small muted">
                RECENTLY UNLOCKED
            </div>

            <strong>
                ${achievement.icon}
                ${achievement.name}
            </strong>

            <div class="small muted">
                ${achievement.description}
            </div>

        </div>
    `;
}


document
.getElementById(
    "toggleRaidEntry"
)
.addEventListener(
    "click",
    openRaidEntry
);


document
.getElementById(
    "cancelRaidEntry"
)
.addEventListener(
    "click",
    closeRaidEntry
);


document
.getElementById(
    "saveRaidResults"
)
.addEventListener(
    "click",
    saveBloodworkRaid
);


/* ============================
   MAIN UPDATE
============================ */

function updateUI() {

    autoHydrationQuest();

    const xp =
        recordXP(
            todayRecord
        );

    const lifeXP =
        lifetimeXP();

    document
    .getElementById(
        "dailyXP"
    )
    .textContent =
        xp;

    document
    .getElementById(
        "dailyXPBar"
    )
    .style.width =
        `${xp}%`;

    document
    .getElementById(
        "streakCount"
    )
    .textContent =
        calculateStreak();

    document
    .getElementById(
        "currentWeightTop"
    )
    .textContent =
        currentWeight
        .toFixed(1);

    document
    .getElementById(
        "lifetimeXP"
    )
    .textContent =
        `${lifeXP} Lifetime XP`;

    document
    .getElementById(
        "levelText"
    )
    .textContent =
        `Level ${playerLevel()}`;

    document
    .getElementById(
        "perfectBanner"
    )
    .classList.toggle(
        "hidden",
        xp !== 100
    );


    /*
      Quest states
    */

    document
    .querySelectorAll(
        ".quest"
    )
    .forEach(
        (quest, index) => {

            quest.classList.toggle(
                "completed",
                !!todayRecord
                    .quests[index]
            );
        }
    );


    /*
      Water
    */

    document
    .getElementById(
        "waterAmount"
    )
    .textContent =
        todayRecord.water;

    const waterPercent =
        Math.min(
            100,
            (
                todayRecord.water /
                HYDRATION_TARGET
            ) * 100
        );

    document
    .getElementById(
        "waterBar"
    )
    .style.width =
        `${waterPercent}%`;

    saveHistory();

    updateBossUI();

    renderAchievements();
   
    renderHistory();
   
    renderCampaign();

    renderBaselineBloodwork();

    renderRaidReadiness();
   
    renderRaidComparison();
   
    renderRaidResolution();
}


/* ============================
   NAVIGATION
============================ */

const views = {
    today:
        document.getElementById(
            "todayView"
        ),

    history:
        document.getElementById(
            "historyView"
        ),

    campaign:
        document.getElementById(
            "campaignView"
        )
};

const titles = {
    today:
        "Today's Quests",

    history:
        "History",

    campaign:
        "Campaign"
};

document
.getElementById(
    "toggleAchievements"
)
.addEventListener(
    "click",
    () => {

        const list =
            document.getElementById(
                "achievementList"
            );


        const isHidden =
            list.classList
            .contains(
                "hidden"
            );


        list.classList.toggle(
            "hidden"
        );


        document
        .getElementById(
            "toggleAchievements"
        )
        .textContent =
            isHidden
            ? "Hide Achievement Codex"
            : "View Achievement Codex";
    }
);
  
document
.querySelectorAll(
    ".nav-btn"
)
.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const selected =
                    button.dataset.view;

                Object.entries(
                    views
                )
                .forEach(
                    ([name, element]) => {

                        element
                        .classList.toggle(
                            "hidden",
                            name !== selected
                        );
                    }
                );

                document
                .querySelectorAll(
                    ".nav-btn"
                )
                .forEach(
                    nav =>
                        nav
                        .classList
                        .remove(
                            "active"
                        )
                );

                button
                    .classList
                    .add(
                        "active"
                    );

                document
                .getElementById(
                    "pageTitle"
                )
                .textContent =
                    titles[selected];

                window.scrollTo({
                    top: 0,
                    behavior:
                        "smooth"
                });
            }
        );
    }
);


/* ============================
   TOAST
============================ */

let toastTimer;

function toast(message) {

    const element =
        document.getElementById(
            "toast"
        );

    element.textContent =
        message;

    element.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {
                element
                .classList
                .remove(
                    "show"
                );
            },
            1800
        );
}


/* ============================
   EXPORT / IMPORT
============================ */

function exportCampaign() {

    const backup = {
        app: "health-campaign",
        version: 1,
        exportedAt:
            new Date().toISOString(),

         data: {
             currentWeight:
                 currentWeight,
         
             history:
                 history,
         
             achievements:
                 getUnlockedAchievements(),
         
             bloodworkRaid:
                 getRaidResults()
         }
    };

    const json =
        JSON.stringify(
            backup,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    const filenameDate =
        localDateKey();

    link.href = url;

    link.download =
        `health-campaign-${filenameDate}.json`;

    document.body
        .appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(
        url
    );
    
    
    const exportedAt =
        new Date().toISOString();
    
    
    localStorage.setItem(
        "health-last-export",
        exportedAt
    );
    
    
    updateLastExportDisplay();
    
    
    toast(
        "💾 Campaign exported"
    );
}


document
.getElementById(
    "exportData"
)
.addEventListener(
    "click",
    exportCampaign
);


/* ============================
   IMPORT FILE HANDLING
============================ */

let pendingImport = null;


document
.getElementById(
    "importData"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "importFile"
        )
        .click();
    }
);


document
.getElementById(
    "importFile"
)
.addEventListener(
    "change",
    handleImportFile
);


function handleImportFile(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    const reader =
        new FileReader();


    reader.onload =
        () => {

            try {

                const backup =
                    JSON.parse(
                        reader.result
                    );

                validateBackup(
                    backup
                );

                pendingImport =
                    backup;

                showImportPreview(
                    backup
                );

            }

            catch (error) {

                pendingImport =
                    null;

                toast(
                    "❌ Invalid campaign backup"
                );

                console.error(
                    "Import failed:",
                    error
                );
            }


            /*
              Reset the file input so
              the same backup can be
              selected again later.
            */

            event.target.value =
                "";
        };


    reader.onerror =
        () => {

            pendingImport =
                null;

            toast(
                "❌ Could not read backup"
            );

            event.target.value =
                "";
        };


    reader.readAsText(
        file
    );
}


function validateBackup(
    backup
) {

    if (
        !backup ||
        backup.app !==
            "health-campaign"
    ) {

        throw new Error(
            "This file is not a Health Campaign backup."
        );
    }


    if (
        backup.version !== 1
    ) {

        throw new Error(
            "Unsupported backup version."
        );
    }


    if (
        !backup.data ||
        typeof backup.data !==
            "object"
    ) {

        throw new Error(
            "Backup data is missing."
        );
    }


    if (
        !backup.data.history ||
        typeof backup.data.history !==
            "object" ||
        Array.isArray(
            backup.data.history
        )
    ) {

        throw new Error(
            "Campaign history is invalid."
        );
    }

   if (
       backup.data.achievements !==
           undefined &&
       (
           typeof backup.data.achievements !==
               "object" ||
           backup.data.achievements ===
               null ||
           Array.isArray(
               backup.data.achievements
           )
       )
   ) {
   
       throw new Error(
           "Achievement data is invalid."
       );
   }

    const weight =
        Number(
            backup.data.currentWeight
        );


    if (
        !Number.isFinite(weight) ||
        weight < 100 ||
        weight > 500
    ) {

        throw new Error(
            "Current weight is invalid."
        );
    }


    Object.entries(
        backup.data.history
    )
    .forEach(
        ([date, record]) => {

            if (
                !/^\d{4}-\d{2}-\d{2}$/
                .test(date)
            ) {

                throw new Error(
                    `Invalid history date: ${date}`
                );
            }


            if (
                !record ||
                typeof record !==
                    "object"
            ) {

                throw new Error(
                    `Invalid record for ${date}`
                );
            }


            if (
                !Array.isArray(
                    record.quests
                ) ||
                record.quests.length !==
                    QUESTS.length
            ) {

                throw new Error(
                    `Invalid quest data for ${date}`
                );
            }


            if (
                !record.quests.every(
                    value =>
                        typeof value ===
                        "boolean"
                )
            ) {

                throw new Error(
                    `Invalid quest values for ${date}`
                );
            }


            const water =
                Number(
                    record.water || 0
                );


            if (
                !Number.isFinite(water) ||
                water < 0
            ) {

                throw new Error(
                    `Invalid hydration data for ${date}`
                );
            }


            if (
                record.weight !==
                    undefined
            ) {

                const recordWeight =
                    Number(
                        record.weight
                    );


                if (
                    !Number.isFinite(
                        recordWeight
                    ) ||
                    recordWeight < 100 ||
                    recordWeight > 500
                ) {

                    throw new Error(
                        `Invalid weight for ${date}`
                    );
                }
            }
        }
    );
}


function showImportPreview(
    backup
) {

    const container =
        document.getElementById(
            "importPreview"
        );

    const records =
        Object.keys(
            backup.data.history
        ).length;

    const weight =
       Number(
           backup.data
               .currentWeight
       );
   
   const achievements =
       backup.data.achievements
       ? Object.keys(
           backup.data.achievements
         ).length
       : 0;
   
   const exportDate =
        new Date(
            backup.exportedAt
        );

    const prettyDate =
        Number.isNaN(
            exportDate.getTime()
        )
        ? "Unknown"
        : exportDate
            .toLocaleString();


    container.innerHTML = `
        <strong>
            Import Campaign?
        </strong>

        <p class="small muted">
            Current weight:
            ${weight.toFixed(1)} lb
            <br>

            Daily records:
            ${records}
            <br>
            
            Achievements:
            ${achievements}
            <br>
            
            Exported:
            ${prettyDate}
        </p>

        <p class="small">
            Importing will replace
            the campaign data stored
            on this device.
        </p>

        <div class="import-actions">

            <button
                class="import-confirm"
                id="confirmImport"
            >
                Import
            </button>

            <button
                class="import-cancel"
                id="cancelImport"
            >
                Cancel
            </button>

        </div>
    `;

    container
        .classList
        .remove(
            "hidden"
        );


    document
    .getElementById(
        "confirmImport"
    )
    .addEventListener(
        "click",
        confirmImport
    );


    document
    .getElementById(
        "cancelImport"
    )
    .addEventListener(
        "click",
        cancelImport
    );
}

function confirmImport() {

    if (!pendingImport)
        return;


    history =
        pendingImport
            .data
            .history;


    currentWeight =
        Number(
            pendingImport
                .data
                .currentWeight
        );


    localStorage.setItem(
        "health-history",
        JSON.stringify(
            history
        )
    );


   localStorage.setItem(
       "health-weight",
       String(
           currentWeight
       )
   );
   
   
   /*
     Restore permanent achievement
     unlocks when included in the backup.
   */
   
   if (
       pendingImport.data
           .achievements &&
       typeof pendingImport.data
           .achievements ===
           "object"
   ) {
   
       localStorage.setItem(
           "health-achievements",
           JSON.stringify(
               pendingImport.data
                   .achievements
           )
       );
   }
   
   else {

      /*
        Older v1 backups did not
        include achievement data.
        Clear existing unlocks so
        they can be reconstructed
        from imported history.
      */
   
      localStorage.removeItem(
          "health-achievements"
      );
   
   }
   
   
   /*
     Restore Bloodwork Raid data
     when included in the backup.
   */
   
   if (
       pendingImport.data
           .bloodworkRaid
   ) {
   
       localStorage.setItem(
           "health-bloodwork-raid",
           JSON.stringify(
               pendingImport.data
                   .bloodworkRaid
           )
       );
   }
   
   else {
   
       /*
         Older backups did not
         include Bloodwork Raid data.
       */
   
       localStorage.removeItem(
           "health-bloodwork-raid"
       );
   }
   
   
   /*
   Make sure today's record
   exists after import.
   */

    if (!history[TODAY]) {

        history[TODAY] = {
            quests: [
                false,
                false,
                false,
                false,
                false
            ],
            water: 0
        };
    }


    todayRecord =
        history[TODAY];


    saveHistory();

    pendingImport =
        null;


    document
    .getElementById(
        "importPreview"
    )
    .classList
    .add(
        "hidden"
    );


    updateUI();


    toast(
        "✅ Campaign imported"
    );
}


function cancelImport() {

    pendingImport =
        null;

    document
    .getElementById(
        "importPreview"
    )
    .classList
    .add(
        "hidden"
    );
}


/* ============================
   BACKUP STATUS
============================ */

function updateLastExportDisplay() {

    const element =
        document.getElementById(
            "lastExportText"
        );


    if (!element) {
        return;
    }


    const stored =
        localStorage.getItem(
            "health-last-export"
        );


    if (!stored) {

        element.textContent =
            "Never";

        return;
    }


    const date =
        new Date(
            stored
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        element.textContent =
            "Unknown";

        return;
    }


    element.textContent =
        date.toLocaleString(
            undefined,
            {
                month:
                    "short",

                day:
                    "numeric",

                year:
                    "numeric",

                hour:
                    "numeric",

                minute:
                    "2-digit"
            }
        );
}


/* ============================
   INITIALIZE
============================ */

document
.getElementById(
    "todayDate"
)
.textContent =
    new Date()
    .toLocaleDateString(
        undefined,
        {
            weekday:
                "long",

            month:
                "long",

            day:
                "numeric"
        }
    );

buildQuestList();

updateUI();

updateLastExportDisplay();
