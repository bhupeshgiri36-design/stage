import { create } from 'zustand';
import { soundEffects } from '../services/soundEffects.js';
import { speechService } from '../services/speechService.js';
import confetti from 'canvas-confetti';

// 5 Chair World Coordinates for Inferno (Left) & Titans (Right)
// Team Inferno desk center: [-4.5, 0, -0.6], rotation: 0.35
// Team Titans desk center:  [4.5, 0, -0.6], rotation: -0.35
const chairOffsets = [-1.8, -0.9, 0, 0.9, 1.8];

const INITIAL_CHAIRS = [
  ...chairOffsets.map((x, idx) => {
    const angle = 0.35;
    const localX = x;
    const localZ = -0.45;
    const worldX = -4.5 + Math.cos(angle) * localX + Math.sin(angle) * localZ;
    const worldZ = -0.6 - Math.sin(angle) * localX + Math.cos(angle) * localZ;
    return {
      id: `inferno-seat-${idx}`,
      team: 'inferno',
      seatIndex: idx,
      worldPos: [worldX, 0, worldZ],
      worldRot: angle,
      isOccupied: true,
      isUnlocked: false,
      contestantId: `c-inferno-${idx}`,
    };
  }),
  ...chairOffsets.map((x, idx) => {
    const angle = -0.35;
    const localX = x;
    const localZ = -0.45;
    const worldX = 4.5 + Math.cos(angle) * localX + Math.sin(angle) * localZ;
    const worldZ = -0.6 - Math.sin(angle) * localX + Math.cos(angle) * localZ;
    return {
      id: `titans-seat-${idx}`,
      team: 'titans',
      seatIndex: idx,
      worldPos: [worldX, 0, worldZ],
      worldRot: angle,
      isOccupied: true,
      isUnlocked: false,
      contestantId: `c-titans-${idx}`,
    };
  }),
];

// Names matching exact reference images:
// Team Inferno: KABIR, AMAN, VIRAL, RIYA, SAHIL
// Team Titans:  ARYAN, ROHAN, DEV, NIKHIL, NEHA
const INITIAL_CONTESTANTS = {
  'c-inferno-0': {
    id: 'c-inferno-0',
    name: 'Kabir',
    nickname: 'The Strategist',
    team: 'inferno',
    seatIndex: 0,
    chairId: 'inferno-seat-0',
    avatarId: 'boy-1',
    jerseyNumber: 7,
    role: 'Captain',
    score: 250,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[0].worldPos,
    currentRot: INITIAL_CHAIRS[0].worldRot,
    walkProgress: 0,
    catchphrase: 'Tera bhai kabhi haar nahi manta!',
  },
  'c-inferno-1': {
    id: 'c-inferno-1',
    name: 'Aman',
    nickname: 'Flame Ace',
    team: 'inferno',
    seatIndex: 1,
    chairId: 'inferno-seat-1',
    avatarId: 'boy-2',
    jerseyNumber: 18,
    role: 'Hype Ace',
    score: 210,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[1].worldPos,
    currentRot: INITIAL_CHAIRS[1].worldRot,
    walkProgress: 0,
    catchphrase: 'Pure fire on stage!',
  },
  'c-inferno-2': {
    id: 'c-inferno-2',
    name: 'Viral',
    nickname: 'Buzzer King',
    team: 'inferno',
    seatIndex: 2,
    chairId: 'inferno-seat-2',
    avatarId: 'boy-3',
    jerseyNumber: 23,
    role: 'Buzzer Master',
    score: 190,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[2].worldPos,
    currentRot: INITIAL_CHAIRS[2].worldRot,
    walkProgress: 0,
    catchphrase: 'Speed over everything!',
  },
  'c-inferno-3': {
    id: 'c-inferno-3',
    name: 'Riya',
    nickname: 'Blaze Queen',
    team: 'inferno',
    seatIndex: 3,
    chairId: 'inferno-seat-3',
    avatarId: 'girl-1',
    jerseyNumber: 9,
    role: 'Trivia Sniper',
    score: 240,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[3].worldPos,
    currentRot: INITIAL_CHAIRS[3].worldRot,
    walkProgress: 0,
    catchphrase: 'Mind games win trophies!',
  },
  'c-inferno-4': {
    id: 'c-inferno-4',
    name: 'Sahil',
    nickname: 'Wildcard',
    team: 'inferno',
    seatIndex: 4,
    chairId: 'inferno-seat-4',
    avatarId: 'boy-4',
    jerseyNumber: 11,
    role: 'Defensive Anchor',
    score: 170,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[4].worldPos,
    currentRot: INITIAL_CHAIRS[4].worldRot,
    walkProgress: 0,
    catchphrase: 'Inferno stands tall!',
  },

  // Team Titans
  'c-titans-0': {
    id: 'c-titans-0',
    name: 'Aryan',
    nickname: 'Ice Wolf',
    team: 'titans',
    seatIndex: 0,
    chairId: 'titans-seat-0',
    avatarId: 'boy-5',
    jerseyNumber: 10,
    role: 'Captain',
    score: 270,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[5].worldPos,
    currentRot: INITIAL_CHAIRS[5].worldRot,
    walkProgress: 0,
    catchphrase: 'Titans freeze the competition!',
  },
  'c-titans-1': {
    id: 'c-titans-1',
    name: 'Arhan',
    nickname: 'Thunder Beast',
    team: 'titans',
    seatIndex: 1,
    chairId: 'titans-seat-1',
    avatarId: 'boy-1',
    jerseyNumber: 44,
    role: 'Power Striker',
    score: 200,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[6].worldPos,
    currentRot: INITIAL_CHAIRS[6].worldRot,
    walkProgress: 0,
    catchphrase: 'Cold calculations only!',
  },
  'c-titans-2': {
    id: 'c-titans-2',
    name: 'Dev',
    nickname: 'Shield Ace',
    team: 'titans',
    seatIndex: 2,
    chairId: 'titans-seat-2',
    avatarId: 'boy-2',
    jerseyNumber: 33,
    role: 'Tactician',
    score: 220,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[7].worldPos,
    currentRot: INITIAL_CHAIRS[7].worldRot,
    walkProgress: 0,
    catchphrase: 'Unbreakable Titan defense!',
  },
  'c-titans-3': {
    id: 'c-titans-3',
    name: 'Nikhil',
    nickname: 'Viper',
    team: 'titans',
    seatIndex: 3,
    chairId: 'titans-seat-3',
    avatarId: 'boy-3',
    jerseyNumber: 88,
    role: 'Rapid Buzzer',
    score: 180,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[8].worldPos,
    currentRot: INITIAL_CHAIRS[8].worldRot,
    walkProgress: 0,
    catchphrase: 'Fastest finger in the arena!',
  },
  'c-titans-4': {
    id: 'c-titans-4',
    name: 'Neha',
    nickname: 'Phoenix Cryo',
    team: 'titans',
    seatIndex: 4,
    chairId: 'titans-seat-4',
    avatarId: 'girl-2',
    jerseyNumber: 99,
    role: 'Strategist',
    score: 230,
    isBuzzed: false,
    state: 'seated',
    currentPos: INITIAL_CHAIRS[9].worldPos,
    currentRot: INITIAL_CHAIRS[9].worldRot,
    walkProgress: 0,
    catchphrase: 'Cool head, golden victory!',
  },
};

export const useStageStore = create((set, get) => ({
  currentScene: 'welcome',
  currentCamera: 'cam1_wide',
  orbitAngle: 0,

  anchor: {
    name: 'Tera Bhai Anchor',
    title: 'Grand Show Host',
    isSpeaking: false,
    currentDialogue: 'Hello everyone! Welcome to CHAMPIONS TERA BHAI! The stage is set for an epic clash!',
    gesture: 'welcome',
    isAutoSpeechEnabled: true,
  },

  chairs: INITIAL_CHAIRS,
  contestants: INITIAL_CONTESTANTS,
  activeContestantAtPodiumId: null,
  trackingTargetPos: [0, 1.4, 0],

  infernoScore: 1060,
  titansScore: 1100,
  buzzedContestantId: null,

  activeQuestion: {
    category: 'POP CULTURE & SHOWTIME',
    question: 'Who coined the legendary catchphrase: "Tera Bhai Shuru Karta Hai Toh Khatam Karke Hi Chhodta Hai"?',
    options: ['The Anchor', 'Team Inferno Captain', 'The Studio DJ', 'Special Guest Judge'],
    correctIndex: 0,
    points: 100,
  },

  isMuted: false,
  isSpeechEnabled: true,
  isMotionBlurEnabled: true,
  motionBlurIntensity: 1.0,
  toggleMotionBlur: () => set((s) => ({ isMotionBlurEnabled: !s.isMotionBlurEnabled })),
  setMotionBlurIntensity: (val) => set({ motionBlurIntensity: val }),

  setScene: (scene) => {
    soundEffects.playCameraWhoosh();
    set({ currentScene: scene });

    // Scene-specific host dialogue & camera suggestion
    const { setAnchorDialogue, setCamera } = get();
    switch (scene) {
      case 'welcome':
        setCamera('cam1_wide');
        setAnchorDialogue('Welcome everyone to Champions Tera Bhai! Look at this magnificent arena tonight!', 'welcome');
        break;
      case 'team_intro':
        setCamera('cam3_inferno');
        setAnchorDialogue('Team Inferno on my left, Team Titans on my right! Two squads, one crown!', 'point-left');
        break;
      case 'quiz':
        setCamera('cam2_anchor');
        setAnchorDialogue('We move into the Quiz Arena! Keep your eyes on the giant LED screen!', 'mic-raise');
        break;
      case 'challenge':
        setCamera('cam1_wide');
        setAnchorDialogue('The physical challenge is now active! Time is ticking down!', 'welcome');
        break;
      case 'face_off':
        setCamera('cam2_anchor');
        setAnchorDialogue('FACE-OFF ARENA! One question, one hit on the buzzer! Who will claim the points?!', 'mic-raise');
        break;
      case 'results':
        setCamera('cam1_wide');
        setAnchorDialogue('Let us look at the scoreboard! The scores are razor close!', 'point-right');
        break;
      case 'winner':
        get().triggerCrowningCelebration();
        break;
    }
  },

  setCamera: (cam) => {
    soundEffects.playCameraWhoosh();
    set({ currentCamera: cam });
  },

  updateOrbitAngle: (delta) => {
    set((state) => ({ orbitAngle: state.orbitAngle + delta }));
  },

  setAnchorDialogue: (text, gesture = 'welcome') => {
    set((state) => ({
      anchor: {
        ...state.anchor,
        currentDialogue: text,
        gesture: gesture,
        isSpeaking: true,
      },
    }));

    speechService.speak(
      text,
      () => {
        set((state) => ({ anchor: { ...state.anchor, isSpeaking: true } }));
      },
      () => {
        set((state) => ({ anchor: { ...state.anchor, isSpeaking: false } }));
      }
    );
  },

  // -------------------------------------------------------------
  // CHAIR AND CONTESTANT INTERACTION & WALKING
  // -------------------------------------------------------------
  callContestantToPodium: (contestantId) => {
    const { contestants, chairs, setAnchorDialogue, setCamera } = get();
    const contestant = contestants[contestantId];
    if (!contestant || contestant.state !== 'seated') return;

    soundEffects.playChairUnlock();

    // 1. Unlock chair
    set({
      chairs: chairs.map((c) => (c.id === contestant.chairId ? { ...c, isUnlocked: true, isOccupied: false } : c)),
      contestants: {
        ...contestants,
        [contestantId]: {
          ...contestant,
          state: 'standing_up',
          walkProgress: 0,
        },
      },
      activeContestantAtPodiumId: contestantId,
    });

    // 2. Host voice call
    setAnchorDialogue(
      `Calling ${contestant.name} from ${contestant.team === 'inferno' ? 'Team Inferno' : 'Team Titans'} to center stage! Step up to the golden podium!`,
      contestant.team === 'inferno' ? 'point-left' : 'point-right'
    );

    // 3. Switch to Entrance Tracking Camera
    setCamera('cam5_tracking');

    // 4. Sitting to standing transition, then begin walk
    setTimeout(() => {
      set((state) => ({
        contestants: {
          ...state.contestants,
          [contestantId]: {
            ...state.contestants[contestantId],
            state: 'walking_to_podium',
          },
        },
      }));
    }, 600);
  },

  sendContestantBackToChair: (contestantId) => {
    const { contestants, setAnchorDialogue, setCamera } = get();
    const contestant = contestants[contestantId];
    if (!contestant || contestant.state !== 'at_podium') return;

    setAnchorDialogue(`Great performance, ${contestant.name}! Head back to your battle station!`, 'welcome');
    setCamera('cam5_tracking');

    // Begin turning around and walking back
    set({
      contestants: {
        ...contestants,
        [contestantId]: {
          ...contestant,
          state: 'turning_around',
        },
      },
    });

    setTimeout(() => {
      set((state) => ({
        contestants: {
          ...state.contestants,
          [contestantId]: {
            ...state.contestants[contestantId],
            state: 'walking_to_chair',
          },
        },
      }));
    }, 500);
  },

  updateContestantMotion: (contestantId, delta) => {
    const { contestants, chairs } = get();
    const c = contestants[contestantId];
    if (!c) return;

    const chair = chairs.find((ch) => ch.id === c.chairId);
    if (!chair) return;

    // Podium standing target position:
    // Inferno stands slightly left of podium [-0.85, 0, 1.4], Titans stands slightly right [0.85, 0, 1.4]
    const podiumTargetX = c.team === 'inferno' ? -0.85 : 0.85;
    const podiumTargetZ = 1.4;

    const startX = chair.worldPos[0];
    const startZ = chair.worldPos[2];

    if (c.state === 'walking_to_podium') {
      const newProgress = Math.min(1, c.walkProgress + delta * 0.45);
      // Smooth Hermite interpolation for natural walk along curved stage
      const t = newProgress;
      const curX = startX + (podiumTargetX - startX) * t;
      const curZ = startZ + (podiumTargetZ - startZ) * t;

      // Calculate facing direction
      const dx = podiumTargetX - curX;
      const dz = podiumTargetZ - curZ;
      const angle = Math.atan2(dx, dz);

      const hasReached = newProgress >= 1;

      set({
        contestants: {
          ...contestants,
          [contestantId]: {
            ...c,
            walkProgress: newProgress,
            currentPos: [curX, 0, curZ],
            currentRot: angle,
            state: hasReached ? 'at_podium' : 'walking_to_podium',
          },
        },
        trackingTargetPos: [curX, 1.2, curZ],
      });

      if (hasReached) {
        soundEffects.playApplause();
        // Face audience at podium
        set((state) => ({
          contestants: {
            ...state.contestants,
            [contestantId]: {
              ...state.contestants[contestantId],
              currentRot: 0,
            },
          },
          currentCamera: 'cam2_anchor',
        }));
      }
    } else if (c.state === 'walking_to_chair') {
      const newProgress = Math.max(0, c.walkProgress - delta * 0.45);
      const t = newProgress;
      const curX = startX + (podiumTargetX - startX) * t;
      const curZ = startZ + (podiumTargetZ - startZ) * t;

      // Facing back towards chair
      const dx = startX - curX;
      const dz = startZ - curZ;
      const angle = Math.atan2(dx, dz);

      const hasReturned = newProgress <= 0;

      set({
        contestants: {
          ...contestants,
          [contestantId]: {
            ...c,
            walkProgress: newProgress,
            currentPos: [curX, 0, curZ],
            currentRot: angle,
            state: hasReturned ? 'sitting_down' : 'walking_to_chair',
          },
        },
        trackingTargetPos: [curX, 1.2, curZ],
      });

      if (hasReturned) {
        setTimeout(() => {
          set((state) => ({
            chairs: state.chairs.map((ch) =>
              ch.id === c.chairId ? { ...ch, isOccupied: true, isUnlocked: false } : ch
            ),
            contestants: {
              ...state.contestants,
              [contestantId]: {
                ...state.contestants[contestantId],
                state: 'seated',
                currentPos: chair.worldPos,
                currentRot: chair.worldRot,
              },
            },
            activeContestantAtPodiumId: null,
            currentCamera: c.team === 'inferno' ? 'cam3_inferno' : 'cam4_titans',
          }));
        }, 600);
      }
    }
  },

  triggerBuzzer: (contestantId) => {
    const { contestants, setAnchorDialogue } = get();
    const contestant = contestants[contestantId];
    if (!contestant) return;

    soundEffects.playBuzzer();

    set({
      buzzedContestantId: contestantId,
      contestants: {
        ...contestants,
        [contestantId]: {
          ...contestant,
          isBuzzed: true,
          score: contestant.score + 50,
          state: 'buzzing',
        },
      },
    });

    setAnchorDialogue(
      `BUZZER LOCKED IN by ${contestant.name} for ${contestant.team === 'inferno' ? 'Team Inferno' : 'Team Titans'}! +50 Points!`,
      'mic-raise'
    );

    setTimeout(() => {
      set((state) => ({
        buzzedContestantId: null,
        contestants: {
          ...state.contestants,
          [contestantId]: {
            ...state.contestants[contestantId],
            isBuzzed: false,
            state: state.contestants[contestantId].state === 'buzzing' ? 'seated' : state.contestants[contestantId].state,
          },
        },
      }));
    }, 3200);
  },

  triggerBuzzerDuel: () => {
    const { contestants, triggerBuzzer, setAnchorDialogue } = get();
    soundEffects.playSuspenseDrone();
    setAnchorDialogue('Hands hovering on buzzers! 3... 2... 1... HIT THE BUZZER!', 'mic-raise');

    setTimeout(() => {
      const seatedContestants = Object.values(contestants).filter((c) => c.state === 'seated');
      if (seatedContestants.length > 0) {
        const winner = seatedContestants[Math.floor(Math.random() * seatedContestants.length)];
        triggerBuzzer(winner.id);
      }
    }, 2400);
  },

  awardPoints: (team, points) => {
    if (points > 0) {
      soundEffects.playCorrectDing();
      soundEffects.playApplause();
    }
    set((state) => ({
      infernoScore: team === 'inferno' ? Math.max(0, state.infernoScore + points) : state.infernoScore,
      titansScore: team === 'titans' ? Math.max(0, state.titansScore + points) : state.titansScore,
    }));
  },

  triggerCrowningCelebration: () => {
    soundEffects.playThemeStinger();
    soundEffects.playApplause();

    const { infernoScore, titansScore, setAnchorDialogue } = get();
    const winnerName = infernoScore >= titansScore ? 'TEAM INFERNO' : 'TEAM TITANS';

    setAnchorDialogue(
      `THE MOMENT OF GLORY! With heart, intelligence, and fire, ${winnerName} LIFTS THE GOLDEN CROWN OF CHAMPIONS TERA BHAI!`,
      'celebrate'
    );

    confetti({
      particleCount: 160,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#38bdf8', '#ffffff'],
    });

    setTimeout(() => {
      confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
    }, 450);
  },

  summonFriendToChair: (chairId, friend) => {
    const { chairs, contestants, setAnchorDialogue } = get();
    const chair = chairs.find((c) => c.id === chairId);
    if (!chair) return;

    soundEffects.playChairUnlock();

    const newContestantId = `c-custom-${Date.now()}`;
    const newContestant = {
      id: newContestantId,
      name: friend.name,
      nickname: friend.nickname,
      team: chair.team,
      seatIndex: chair.seatIndex,
      chairId: chair.id,
      avatarId: friend.avatarId,
      jerseyNumber: friend.jerseyNumber,
      role: friend.role,
      score: 150,
      isBuzzed: false,
      state: 'seated',
      currentPos: chair.worldPos,
      currentRot: chair.worldRot,
      walkProgress: 0,
      catchphrase: friend.catchphrase,
    };

    set({
      chairs: chairs.map((c) => (c.id === chairId ? { ...c, isOccupied: true, isUnlocked: false, contestantId: newContestantId } : c)),
      contestants: {
        ...contestants,
        [newContestantId]: newContestant,
      },
    });

    setAnchorDialogue(
      `Welcoming our new friend ${friend.name} to ${chair.team === 'inferno' ? 'Team Inferno' : 'Team Titans'}! Chair unlocked!`,
      chair.team === 'inferno' ? 'point-left' : 'point-right'
    );

    soundEffects.playApplause();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: chair.team === 'inferno' ? ['#f43f5e', '#fbbf24'] : ['#38bdf8', '#fbbf24'],
    });
  },

  toggleMute: () => {
    const muted = soundEffects.toggleMute();
    set({ isMuted: muted });
  },

  toggleSpeech: () => {
    const enabled = speechService.toggleSpeech();
    set({ isSpeechEnabled: enabled });
  },
}));
