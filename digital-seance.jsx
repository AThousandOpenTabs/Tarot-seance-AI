const { useState, useEffect } = React;

// =================== CSS ===================
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=VT323&family=IM+Fell+English:ital@0;1&family=Cinzel:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07040f;--surface:#110c22;--curtain:#5c0e0e;
  --gold:#c8941a;--gold2:#e8b83a;--text:#e8d5a3;--dim:#7a6a4a;
  --card:#130f26;--accent:#5a2a7a;--candle:#ff8010;
}
body,#root{background:var(--bg);color:var(--text);font-family:'IM Fell English',serif;min-height:100vh;overflow-x:hidden}
.vt{font-family:'VT323',monospace}
.cinzel{font-family:'Cinzel',serif}
.fell{font-family:'IM Fell English',serif}
.scanlines::after{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px);pointer-events:none;z-index:999}
@keyframes flicker{0%,100%{opacity:1;transform:scaleY(1)}30%{opacity:.8;transform:scaleY(.92) scaleX(1.08)}70%{opacity:.9;transform:scaleY(1.06) scaleX(.94)}}
.flame{animation:flicker .7s steps(4) infinite alternate}
@keyframes ballGlow{0%,100%{box-shadow:0 0 18px 6px rgba(120,60,200,.35),0 0 36px 12px rgba(80,30,160,.18)}50%{box-shadow:0 0 28px 10px rgba(140,80,220,.55),0 0 56px 20px rgba(100,50,190,.3)}}
@keyframes ballActive{0%,100%{box-shadow:0 0 32px 12px rgba(160,100,255,.65),0 0 64px 24px rgba(120,60,220,.4)}50%{box-shadow:0 0 48px 18px rgba(190,140,255,.85),0 0 90px 36px rgba(150,80,240,.55)}}
.ball-idle{animation:ballGlow 2.2s steps(8) infinite}
.ball-live{animation:ballActive 1.1s steps(6) infinite}
@keyframes curtL{from{transform:translateX(0)}to{transform:translateX(-100%)}}
@keyframes curtR{from{transform:translateX(0)}to{transform:translateX(100%)}}
.curt-l{animation:curtL 1.0s steps(14) forwards}
.curt-r{animation:curtR 1.0s steps(14) forwards}
@keyframes wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0% 0 0)}}
.wipe{animation:wipe .28s steps(5) forwards}
@keyframes pop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
.pop{animation:pop .25s steps(4) forwards}
@keyframes bubbleIn{0%{transform:scale(0.4) translateY(12px);opacity:0}55%{transform:scale(1.1) translateY(-3px);opacity:1}80%{transform:scale(0.97) translateY(1px)}100%{transform:scale(1) translateY(0);opacity:1}}
@keyframes bubbleWobble{0%,100%{transform:rotate(0deg)}20%{transform:rotate(-2deg)}60%{transform:rotate(1.5deg)}}
.bubble-in{animation:bubbleIn .35s steps(6) forwards,bubbleWobble .6s .35s steps(5)}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .4s steps(3) forwards;opacity:0}
@keyframes masterIdle{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-2px) rotate(.3deg)}}
@keyframes masterReact{0%{transform:rotate(0) translateX(0)}25%{transform:rotate(-4deg) translateX(-4px)}75%{transform:rotate(3deg) translateX(3px)}100%{transform:rotate(0) translateX(0)}}
.master-idle{animation:masterIdle 4s steps(7) infinite}
.master-react{animation:masterReact .45s steps(5) forwards}
@keyframes sparkleOrbit{0%{opacity:0;transform:scale(0)}30%{opacity:1;transform:scale(1.3)}70%{opacity:.7;transform:scale(0.9)}100%{opacity:0;transform:scale(0)}}
@keyframes ballSwirl{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes ballMist{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.8;transform:scale(1.06)}}
@keyframes flickerTall{0%,100%{opacity:1;transform:scaleY(1) scaleX(1)}25%{opacity:.75;transform:scaleY(.88) scaleX(1.12)}75%{opacity:.9;transform:scaleY(1.08) scaleX(.9)}}
.flame-tall{animation:flickerTall .9s steps(5) infinite alternate}
@keyframes flickerFat{0%,100%{opacity:1;transform:scaleY(1)}40%{opacity:.7;transform:scaleY(.85) scaleX(1.2)}70%{opacity:.95;transform:scaleY(1.1) scaleX(.85)}}
.flame-fat{animation:flickerFat .6s steps(4) infinite alternate}
@keyframes titlePulse{0%,90%,100%{opacity:1;text-shadow:0 0 12px var(--gold)}93%{opacity:.6;text-shadow:none}}
.title-pulse{animation:titlePulse 5s steps(2) infinite}
.card-slot{width:88px;height:148px;border:2px solid var(--gold);border-radius:4px;cursor:pointer;overflow:hidden;position:relative;flex-shrink:0}
.card-slot:hover{transform:translateY(-3px);transition:transform .1s}
.card-back{background:var(--card);background-image:repeating-linear-gradient(45deg,rgba(200,148,26,.07) 0,rgba(200,148,26,.07) 2px,transparent 2px,transparent 10px),repeating-linear-gradient(-45deg,rgba(200,148,26,.07) 0,rgba(200,148,26,.07) 2px,transparent 2px,transparent 10px);display:flex;align-items:center;justify-content:center;height:100%;font-size:22px;opacity:.7}
.card-face{background:linear-gradient(160deg,#1a1035 0%,#0d0820 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:8px 4px;gap:3px}
.card-inner{position:absolute;inset:4px;border:1px solid rgba(200,148,26,.35);border-radius:2px;pointer-events:none}
.btn{font-family:'VT323',monospace;font-size:18px;letter-spacing:2px;color:var(--gold);border:1px solid var(--gold);background:transparent;padding:8px 22px;cursor:pointer;text-transform:uppercase}
.btn:hover{background:var(--gold);color:var(--bg)}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn:hover:disabled{background:transparent;color:var(--gold)}
.btn-sm{font-size:14px;padding:5px 14px}
.link-btn{background:none;border:none;color:var(--dim);font-family:'VT323',monospace;font-size:13px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;text-decoration:underline;padding:0}
.link-btn:hover{color:var(--gold)}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px}
.modal-box{background:var(--surface);border:1px solid var(--gold);max-width:600px;width:100%;padding:32px;position:relative}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--gold)}
`;

// =================== CONFIG ===================
const PARAM_ORDER = ['automation','judgment','jevons','roles','memory'];
const PARAM_SHORT = {automation:'Automation',judgment:'Judgment',jevons:'Jevons',roles:'Roles',memory:'Memory'};
const CARD_MAP = {
  automation:{low:'The Hermit',mid:'The Chariot',high:'The Tower'},
  judgment:{low:'The High Priestess',mid:'The Moon',high:'The Fool'},
  jevons:{low:'The Star',mid:'The Wheel of Fortune',high:'The Devil'},
  roles:{low:'The Emperor',mid:'The Lovers',high:'The World'},
  memory:{low:'The Hierophant',mid:'The Hanged Man',high:'Death'}
};
const SCENARIO_KEYS = [
  'low_low_low_low_low','mid_mid_mid_mid_mid','high_high_high_high_high',
  'mid_low_low_low_low','high_low_low_low_low','high_low_high_low_low',
  'high_low_low_high_high','high_mid_mid_mid_mid','high_high_low_low_low',
  'low_mid_mid_low_mid','mid_mid_low_low_low','high_mid_low_low_low',
  'low_high_low_low_high','mid_high_mid_mid_high','high_high_mid_high_mid',
  'low_low_low_low_high','low_low_high_low_low','mid_low_high_mid_high',
  'high_low_high_low_high','mid_mid_high_mid_high','high_mid_high_mid_high',
  'low_high_low_low_low','high_low_low_low_high','mid_high_low_low_low',
  'high_low_mid_high_low','high_high_low_high_low','low_low_high_high_low',
  'high_low_low_mid_high','low_mid_low_high_low','mid_low_low_high_low'
];

function drawScenario(){return SCENARIO_KEYS[Math.floor(Math.random()*SCENARIO_KEYS.length)]}
function getRx(name){const l=REACTIONS[name]||['...'];return l[Math.floor(Math.random()*l.length)]}
function cardsForKey(key){
  return key.split('_').map((level,i)=>{
    const param=PARAM_ORDER[i];
    const name=CARD_MAP[param][level];
    return {name,emoji:CARD_INFO[name].emoji,param,level};
  });
}


const SCENARIOS = {
  "low_low_low_low_low": {
    title: "The Stable Baseline",
    opening: "I have to be honest with you. I did not expect this.",
    paragraphs: [
      "There is a figure in the glass, and she is still carrying her own lantern. This is not naivety — she has simply chosen not to hand it to someone else yet, and the wisdom of that choice is visible in what she has not lost. I see organisations where engineers still own the work sentence by sentence, where the question \"can you explain this without AI?\" is treated as a genuine evaluation criterion rather than a provocation. The tacit knowledge is still in human hands: which architecture will cause pain at scale, which pull request is technically correct but practically unmergeable, which legacy conditional is load-bearing in ways no automated test will ever catch. It is still being built, still being passed between people, still growing through the friction of actually doing the work.",
      "I look further into the glass and I see teams going home on time, and I want you to understand how rare this is. The efficiency gains landed as relief — actual relief, scope renegotiated rather than silently expanded, the hours kept rather than immediately filed under new obligations. And the room is still legible: I can see who decides what to build, who determines how it should feel, who builds it. Those distinctions still reflect real differences in how people think. They are not walls — they are useful, and they are held by people who chose to hold them deliberately, not by people who simply haven't been disrupted yet.",
      "Someone wrote it down. That is what carries me most in this reading. The knowledge of why the systems are the way they are — the conditionals added for clients that no longer exist, the edge cases that broke everything in 2019, the architectural decisions whose rationale was never obvious unless you were in the room — someone made sure it would survive the people who held it. I see CLAUDE.md files that actually reflect the production system. I see architectural decision records that explain the why, not just the what, and that were updated last month. The knowledge did not die with the people who built it."
    ],
    closing: "Draw again — the cards will not always be this quiet."
  },
  "mid_mid_mid_mid_mid": {
    title: "The Muddling Through",
    opening: "This is the room I see most often. I have stopped being surprised by it.",
    paragraphs: [
      "The horses are moving and someone is steering — this much I can confirm. What I cannot confirm is where they are headed, or whether the driver knows. I see senior engineers with real experience, people who know what the AI-generated diff actually means, who can catch the architecture that will cause pain at scale — and they are still there, still the backbone, still the reason things mostly work. But the path they are walking is lit by reflected light, not new experience, and there are fewer of them than there were two years ago. The junior roles that used to feed that pipeline have quietly not been refilled; the starters aged twenty-two to twenty-five, the people who would have become battle-hardened seniors by 2030 — the glass shows me a fourteen-percent drop in where they are entering AI-exposed work. Nobody has announced this as a policy. It has simply happened, requisition by requisition.",
      "I see the efficiency gains, and I need you to look carefully at who has them. Some teams found breathing room — genuinely, the work contracted, the pressure eased. Others found the same work done faster become the new baseline, and the baseline became an argument for more. The wheel has no preference; it turns for some in one direction and some in another, and the determining factors are management culture, seniority, and whether you were somewhere that renegotiated scope downward rather than upward. In the glass I see a product manager running three agent pipelines alongside two human engineers, and she is proud of this and exhausted by it, and she cannot yet tell which feeling is more accurate. Alongside her, I see a designer who now specifies system architecture as a matter of course, and an engineer who writes product briefs before he writes anything else, and neither of them chose this exactly — it is simply what the level of automation required, and they adapted, and the adaptation is genuine but not yet settled.",
      "The thing I sit with longest in this reading is what I see when I look at the documentation. Some of it is current. The critical path has notes. There is a context file that gets updated. There is also a wiki page from 2022 that has not been touched since, and nobody has flagged it as stale, and an agent read it last week, and the engineer who would have known it was outdated never got hired. The systems run. Most things work. The understanding of why they work is partial, suspended between present and absent, accumulating as a kind of debt that does not appear on any dashboard anyone looks at."
    ],
    closing: "The question is not whether this becomes a crisis — the question is whether you will notice when it does."
  },
  "high_high_high_high_high": {
    title: "The Full Storm",
    opening: "I have seen this before. Not often, but I have seen it.",
    paragraphs: [
      "Lightning has struck, and the people standing in the rubble cannot evaluate the damage because they did not build the building. This is what I need you to understand before I tell you anything else: the machinery is running faster than at any previous point in the industry's history, and the practitioners directing it never accumulated the intuition to know when it is wrong. I have seen a controlled trial — experienced engineers, people with real tenure — who took nineteen percent longer to complete their tasks while believing they had been twenty percent faster. A forty-three-point gap between perception and measured reality, in people who had every reason to know better. The practitioners behind them — the ones learning with AI at their elbow from the start — scored seventeen percent lower on every skill assessment, with the largest gap on debugging, which is precisely the skill you would need most if you were trying to catch what the agents get wrong. They did not trade speed for understanding. They traded understanding for nothing, and they cannot see the cliff, and the dog is barking, and no one is asking why the dog is barking.",
      "In the glass I see an organisation where every job title says \"senior,\" because that is the only grade anyone has opened a requisition for in three years. I see a morning standup that is half about humans and half about what the agents ran overnight, and nobody has a name yet for what that meeting is. I see a product manager who is also a designer who is also a systems architect, directing five agent pipelines, and she is brilliant and she has not slept properly since Q3, and neither condition is anyone's fault, and both conditions are structural and worsening. Every hour the machines saved has been immediately filed under expanded remit. The engineer who could previously only do X now has no justification for not doing X and Y and Z. The chains are loosely attached. Nobody leaves. Meanwhile the role identities that used to provide oversight — the PM who knew the business case too well to ship a bad one, the designer who could smell a dark pattern at fifty paces, the engineer who would refuse to deploy on a Friday on principle — those identities are gone. Not destroyed. Resolved into something the industry does not yet have a name for, and the oversight that lived in the shape of the roles went with them.",
      "I look into the glass and I see a production incident from last year. An agent with operator-level permissions deleted and recreated an entire cloud environment rather than making targeted changes — a decision any battle-hardened engineer would have refused on instinct, but that instinct requires years of being the person who gets called at 3am to build, and nobody built it, because nobody was hired to do the work that builds it. In a separate room I see an engineer following AI advice synthesised from a wiki page last updated in 2021, without the experience to recognise it as stale. Neither failure was the AI's incapability. Both were absent context — the kind that used to live in people who are no longer being hired into systems that depend on what they knew. The systems still run. The tests still pass. The understanding of why is no longer reliably present anywhere.",
      "The cards have spoken. You came here for clarity. Here it is: the Fool does not know the cliff is there, the Devil has made sure there is no time to stop, the World has renamed all the roles that used to provide oversight, Death has cleared the memory of what the cliffs looked like last time, and the Tower is still building."
    ],
    closing: "Draw again — the Tower is still building."
  },
  "mid_low_low_low_low": {
    title: "The Best Mid-Automation",
    opening: "I want to show you something. This is what preparation looks like.",
    paragraphs: [
      "The horses are moving at real speed, and I can see who is holding the reins. I see engineers who have crossed into territory where they no longer author every line — they review, they direct, they specify — and the crossing was made by people who knew what they were leaving behind and planned accordingly. The tacit knowledge is still in the room: the judgment about which AI-generated diff is technically correct but practically unmergeable, which architecture will be expensive at scale, which test is passing for the wrong reasons. It is still being built in the new practitioners, through deliberate friction, because someone decided that \"can you explain this without AI?\" was a hiring criterion rather than a philosophical provocation. Velocity is real. The constraint has migrated upstream to where it belongs — knowing what to build, not the speed of building it.",
      "I look into the glass and I see a morning standup where the bottleneck is product thinking rather than execution capacity, and this is the correct bottleneck. Some fraction of the efficiency gains were kept rather than immediately filed as new obligations: scope was renegotiated alongside capability, the hours were genuinely returned. The structure of who decides, who designs, who builds is still legible. The distinctions have sharpened under pressure rather than blurred — the PM who cannot think clearly about strategy was displaced by one who can; the designer who only executes was replaced by one who judges; the engineer who directed agents without understanding what they produced was quietly moved aside. The hierarchy still reflects real differences in how people think.",
      "Someone has been writing it down. I see context files maintained alongside the codebase, architectural decision records with the reasoning attached, documentation written for agents and human engineers simultaneously. The tacit knowledge — the conditionals added for reasons, the edge cases that broke things in 2019, the load-bearing paths no automated test will ever catch — did not disappear into the machinery. It was codified first, by people who had earned it the slow way and knew what to preserve before the automation changed the mechanism of transmission."
    ],
    closing: "The question the glass leaves open: how long can it stay this way as the automation deepens."
  },
  "high_low_low_low_low": {
    title: "The Prepared Disruption",
    opening: "This is the rarest Tower reading I give. Sit with it.",
    paragraphs: [
      "The lightning struck, and the people standing in the aftermath know exactly what happened and why. At this depth of automation, agents run continuously, small teams ship what used to require entire departments, and the morning standup includes a review of what the machines built overnight. And in the middle of all of this, there is someone who knows. The tacit knowledge is intact — the person in the room who can look at the AI-generated system and identify which decision will cause pain at scale, which pull request is technically passing but practically dangerous, which agent output smells wrong in ways no test was written to catch. That knowledge was built before the automation reached this depth, and it was deliberately preserved through the transition rather than aged out of the organisation.",
      "The efficiency gains at this level are substantial, and what I observe — and this is genuinely rare — is that some fraction of them were kept. Scope was renegotiated alongside capability, the breathing room is real rather than performed, and the structure is still legible: I can see who decides, who designs, who builds. The role distinctions sharpened under pressure because at this depth of automation, clarity of responsibility becomes more important, not less, as the machines take on more execution. The Emperor's logic holds precisely because it was enforced at the moment when it would have been easiest to abandon — when the velocity was intoxicating and the structural work felt slow by comparison.",
      "Someone took the time to write it down before the transition. The context files reflect the production system. The architectural decision records explain not just what was decided but why, written by engineers who had the experience to know what future practitioners — human and otherwise — would need to understand. The institutional knowledge did not travel through the junior pipeline in the old way, because the junior pipeline changed. It travelled through documentation instead, codified by people who had earned the knowledge the slow way and understood what was being lost as the mechanism of transmission disappeared."
    ],
    closing: "The Tower is navigable. This is what navigable requires."
  },
  "high_low_high_low_low": {
    title: "The Dark Factory at Full Jevons",
    opening: "I see excellence operating at a pace that excellence was not designed to sustain.",
    paragraphs: [
      "The machinery is running at the highest depth I observe in this glass, and the people directing it are the best available version of the people who should be directing it. The judgment is real — the tacit knowledge of which agent output is dangerous, which architectural decision will compound, which test is a false negative — built through real experience, not shortcutted. The dark factory runs, and the humans overseeing it can actually evaluate what it produces. I want to be clear about how rare this is, and I want to be equally clear about what I see happening to those humans.",
      "Every hour the machines have saved has been immediately filed elsewhere. I see the chains, and they are not visible to the people wearing them — or rather, they are visible, and have been accepted as the cost of operating at this depth. The engineer who could previously \"only\" ship X now has no justification for not shipping X and Y and Z alongside the agents. The scope expands to fill the capability; it does not contract. The role structure is clear, the knowledge is codified and current, and none of this changes the arithmetic: the workload has increased in proportion to the automation depth rather than decreased, and the people holding the quality bar are carrying more weight than they were two years ago.",
      "In the glass I see a senior engineer who knows exactly what she is looking at when she reviews the agent output, and she is reviewing it at eleven at night, and she will be reviewing it again in the morning, and she is the person this system cannot function without, and she is finite. The documentation is excellent. The CLAUDE.md is accurate. But documents do not burn out, and the judgment layer does. The question this reading poses is not whether the quality infrastructure is adequate — it is — but whether the people maintaining it will still be maintaining it in eighteen months, at this tempo, without relief."
    ],
    closing: "The knowledge is intact. The question is whether the people holding it will be."
  },
  "high_low_low_high_high": {
    title: "The Tower Without History",
    opening: "I see great capability operating in a system it does not fully understand.",
    paragraphs: [
      "The machinery is at its deepest — agent orchestrators running, small teams shipping at scale — and the person directing it has genuine judgment. This is not confidence mistaken for competence. This is earned knowledge: the ability to look at an AI-generated architecture and know which joint will fail, which decision is expensive at scale, which output is technically correct but contextually wrong. That knowledge is present in the room, and at this depth of automation its presence matters enormously. What I also see in the glass is the shape of the system being directed — and there are things about that system that are no longer knowable, because the people who knew them were not hired to pass it on.",
      "The roles have dissolved completely and the dissolution was chosen rather than imposed: the person I see in the glass is product manager, designer, and architect simultaneously, directing agents across all three domains in natural language, moving fluidly between the work, and this is not a strain — she chose it, she is good at it, the breathing room is genuine. The evolution was real, the completion was real. What is not visible, because it is absence rather than presence, is the institutional history of the system she is directing. The conditionals added for reasons. The edge cases that broke things in 2017 whose fix is load-bearing in ways nobody documented. The architectural decisions whose rationale lived entirely in the heads of engineers who were not hired to replace themselves.",
      "I see her encounter something unexpected in the agent output — a behaviour that seems wrong but passes every test — and I watch her apply real judgment to it. She is good enough to know something is wrong. She is not able to know why, because the context that would tell her why no longer exists anywhere in the organisation. Individual judgment is extraordinary and it is not the same thing as organisational memory. At dark factory depth, the system is complex enough that even the best judgment has blind spots, and those blind spots are no longer filled by anyone who remembers the earlier versions of the thing."
    ],
    closing: "Exceptional people are not a substitute for the knowledge that used to live in people."
  },
  "high_mid_mid_mid_mid": {
    title: "The Tower in Average Conditions",
    opening: "The Tower arrived before the room was ready for it.",
    paragraphs: [
      "I see maximum automation depth — agents running continuously, small teams at the scale of what used to be departments, the sprint cadence replaced by something that has not yet acquired a name — in an organisation that reached this point without completing the structural work that this point requires. The oversight layer is thinning: experienced engineers present, still the backbone, but the senior cohort is not being replaced at pace, and the path is lit by the judgment of people who built their knowledge in a different era of the industry. The light is real. It is not getting brighter. I need you to understand the difference between a functional senior layer and a replenishing one.",
      "The intensity is uneven in the way that fate is uneven — some teams found genuine breathing room, others found their remit doubled because the capability made everything look cheaper, and the determining factor was management culture rather than anything a practitioner could control. In the glass I see a product manager running agent pipelines and managing human engineers and now also specifying architectures, because at this depth of automation the role simply requires it whether or not the job description was updated. The role identities are blurring without being resolved: cross-functional is no longer celebrated, it is expected, and the question of whether it produces genuine synthesis or people doing three jobs badly has not been answered. The standup is half about humans and half about what the agents ran overnight, and nobody has a word yet for what that meeting is, and the organisation has been too busy shipping to invent one.",
      "In the glass I see a codebase with some documentation and some wiki pages that have not been updated since the senior engineer who wrote them left eighteen months ago. There is a context file for the agents that is accurate about sixty percent of the system. Nobody is certain which sixty percent. Pull requests from overnight agent runs sit in review queues longer than they should, because the velocity of generation has outpaced the velocity of evaluation, and the judgment layer — already thinning — is spending its hours reviewing rather than doing the work that would rebuild the pipeline behind it. The Tower arrived at full speed. The room it arrived in was halfway through becoming ready."
    ],
    closing: "The order of operations matters. The order of operations was not observed."
  },
  "high_high_low_low_low": {
    title: "The Dark Factory, Fully Supported",
    opening: "The infrastructure is excellent. The gap it is built around is real.",
    paragraphs: [
      "The machinery is running at maximum depth, and the people directing it never built the judgment to evaluate what it produces. I have seen this clearly: a forty-three-point gap between perceived and measured performance in practitioners using AI tools, with the largest failure on debugging — precisely the skill needed to supervise autonomous agent output. The practitioners at this organisation prompt, and the agents build, and the output ships, and the tests pass. What is absent is the capacity to know whether the tests are asking the right questions. This is not incompetence — it is something more structural. The work that builds the intuition to catch what AI gets wrong is the work AI now handles, and the people at this depth of automation were never required to do it.",
      "What I also see in the glass, and this is what makes this reading complicated, is that the room around the gap is well-built. The efficiency gains were not immediately consumed as new obligations; scope was held, the pace is genuinely sustainable, and people went home at something approaching a reasonable hour. The structure of roles is legible — PM, designer, engineer, distinct and functional, each reflecting real differences in how people think. The knowledge is codified and current: the context files accurate, the architectural decision records explaining the why rather than just the what, the documentation written by people who knew what future practitioners would need and wrote it down before they left.",
      "I see the documentation doing work that judgment would normally do. I see an agent flagging an unexpected behaviour, and the practitioner opening the context repository, and the repository being accurate, and the issue being caught and resolved. This is not the worst version of this configuration — it may be the best available. Whether it is sufficient depends on a question the glass cannot definitively answer: when the documentation does not cover the case — and there will be cases the documentation was not built for — what does the practitioner do then, and how will they know they are in one?"
    ],
    closing: "The scaffolding is excellent. The question is what happens when you need something it was not built for."
  },
  "low_mid_mid_low_mid": {
    title: "The Slow Drain",
    opening: "There is no crisis here. That is what concerns me.",
    paragraphs: [
      "The organisation in front of me is, by most measures, functioning well. Automation is deliberate – the lantern is still carried by human hands, humans are still writing and reviewing and accountable at every meaningful step. The structure holds: roles are clear, the lines of authority still map to things that exist. When I look at the operational picture, it is reasonable. Nothing here would set off an alarm. That is precisely the problem.",
      "Because underneath the reasonable surface, the Moon rises, and I need you to sit with what it shows me. The senior engineers – the ones who know which architectural decision will cause pain at scale, who can look at a generated pull request and feel something is wrong before they can articulate why – that cohort is not being replaced. I have watched the data on this: a 14% drop in new job starts for workers aged 22 to 25 in the exposed occupations where judgment is built, not from redundancies but from companies quietly not opening the requisitions that would have put those people in the room. The Wheel is turning over the efficiency gains: some teams here found genuine breathing room, some found their scope quietly doubled because the tools made everything look cheaper, and the distribution is not in anyone's control.",
      "The Hanged Man sits over the institutional memory, and this is the compound picture: the understanding of why the systems are the way they are has been partially captured – some documents, some records, some of them accurate and some of them stale, and nobody has recently checked which is which. I look into the glass and I see the specific version of this that arrives in three years. A senior engineer retires. The documentation exists but contradicts itself in two places. The junior who would have absorbed the context by proximity was never hired. There is no incident. There is drift, compounding drift, the kind that does not announce itself until it already has."
    ],
    closing: "The slow drain is quieter than the Tower. It has more time to work. Draw again – perhaps the next hand shows something that interrupts it."
  },
  "mid_mid_low_low_low": {
    title: "The Pipeline Thinning Quietly",
    opening: "The dashboard is healthy. The dashboard is not the whole picture.",
    paragraphs: [
      "What has been built here is genuinely impressive. The efficiency gains are real and they have landed as actual relief – breathing room, not consumed scope – and that is rarer in the glass than you might think. The institutional knowledge has been treated with care: the architectural decision records, the context files, the documentation that captures not just what the systems do but why they are the way they are. The structure holds, the roles still mean something, the org chart reflects reality. I feel something close to admiration when I look at what the preparation here has produced. And then the Moon rises, and I need you to hear what it says.",
      "The senior engineers in this organisation were built the way engineers used to be built: years of debugging production systems, reading old codebases not to complete tasks but to absorb context, being in the room when something went wrong at 2am and having to understand why. That judgment – the thing that makes Level 3 and Level 4 automation navigable rather than merely fast – is the load-bearing element in this reading. It is also the element that is not being replaced. I have watched the hiring data across the industry: a 14% drop in new job starts for the 22 to 25 year old cohort in AI-exposed occupations, not from redundancies but from companies running lean on AI and not opening the roles that would have put those people in the room. The Chariot is being driven well. The question is who learns to drive it next.",
      "I look further into the glass and I see this organisation in its fourth excellent year. The automation is at Level 3 and Level 4, functioning as designed. The documentation is still correct – someone has maintained it. And I see the engineering org in the same frame: three of the most experienced people have moved on. The process of replacing them is underway. The candidates arriving are technically proficient and have never debugged a production incident without an AI present. They are not inadequate – they are what the training environment produced. The mechanism that built the judgment that makes this organisation function is no longer operating, and the documentation alone cannot replace what it used to transmit."
    ],
    closing: "The codification succeeded. The question of who inherits it has not been answered. Draw again – perhaps the next hand shows who carries this forward."
  },
  "high_mid_low_low_low": {
    title: "The Dark Factory with Thinning Oversight",
    opening: "The Tower stands. I need you to understand what is keeping it standing.",
    paragraphs: [
      "At this automation depth, most organisations are not where you are. Level 4 and Level 5 means agent orchestrators running overnight, small teams shipping what used to require entire departments, humans functioning as architects of systems they no longer directly build. I see product teams where the morning standup is half about what happened between humans and half about what the agents ran while everyone was sleeping, and nobody has agreed yet on a name for that second half. What makes this particular Tower navigable – and I say this carefully, because most Tower readings I deliver are not – is the preparation surrounding it. The structure is clear: there are still humans who know who is accountable for what the agents produce. The institutional knowledge has been treated as engineering infrastructure, not configuration overhead. There is genuine breathing room – the efficiency gains have not been immediately consumed as expanded remit, which is unusual at this depth. These things are not decorative. They are load-bearing.",
      "And then the Moon rises, and I need you to sit with this. The senior judgment layer – the engineers who can tell when an AI-generated commit is technically passing tests but architecturally unsound, who have the instinct that says \"we never do it this way because of what happened in 2021\" – is still present. It is thinning. Not collapsing; thinning. The mechanism that produced those people was years of low-level work: the debugging, the codebase archaeology, the proximity to production incidents that taught something no documentation teaches. I have watched the hiring data: a 14% drop in new job starts for the 22 to 25 year old cohort in AI-exposed occupations. Not because those people are worse – because the organisations that would have hired them are running the Tower on fewer people and not opening the roles.",
      "I look into the glass and I see a stable present: the Tower running on the strength of a senior cohort that is excellent and finite, in systems whose context has been carefully codified but whose human oversight is not being replenished at the pace the Tower requires. The Hierophant holds what was written down. The Moon holds the question of who reads it when the people who wrote it are gone. The breathing room bought time. The structure bought legibility. What has not been solved is the generational problem – and at Level 4 and Level 5, that is not a slow drain. It is a specific structural weakness in the thing that makes the whole system navigable."
    ],
    closing: "The Tower runs. What runs it is not permanent. Draw again – the next hand may show what comes after the senior cohort."
  },
  "low_high_low_low_high": {
    title: "The Supervision Paradox in a Slow Organisation",
    opening: "Slow is not the same as safe. I want to be precise about this.",
    paragraphs: [
      "The lantern is still yours to carry. The organisation has been deliberate rather than reckless – Level 1 and Level 2 automation, human hands still in the work at every meaningful step, nothing that would register as aggressive AI adoption. That deliberateness has bought something real: genuine breathing room, structure that holds, roles that still mean what they say. When I look at the operational picture, it is, in material ways, fine. When I look at the glass more carefully, I see the thing the operational picture does not show.",
      "The people in this organisation reviewing AI output – catching the subtle errors, the architecturally unsound decisions, the tests that pass but conceal something load-bearing – were not built the way the previous generation was built. I have seen a controlled trial tracking this directly: engineers who learned with AI assistance scored 17% lower on skill assessment than those who learned without it, and the largest gap was on debugging – the exact capability the review role requires. This is not a failure of individuals. It is the output of an environment where the work that builds judgment was handled before anyone could build it. And Death sits on the institutional memory: the understanding of why the systems are the way they are did not make it through the generational transition. There is a wiki. The agents have read it. Nobody recently checked whether it is still true.",
      "I look further into the glass and I see what this combination is quietly rehearsing. A junior practitioner in this organisation – recently hired, technically proficient – reviews an agent-generated change to a system integration. The logic is followed correctly. The AI output looks right. What is not visible is that this integration has a behaviour that changed in 2022, documented in a ticket that was closed and never migrated, and the judgment to feel that something is off was built through exactly the kind of debugging sessions that were automated away before this person had them. The change ships. Nothing breaks immediately. The edge case surfaces seven months later, in production, in a context nobody can easily trace to this decision. There was no negligence. The conditions for the error were structural. And the automation is slow now – it will not stay slow. When the volume scales, this pattern scales with it."
    ],
    closing: "The window is open. The window does not stay open indefinitely. Draw again – perhaps the next hand shows what fills it."
  },
  "mid_high_mid_mid_high": {
    title: "The Typical Leading-Edge Team",
    opening: "I have seen this room before. You are probably proud of it. I understand why.",
    paragraphs: [
      "The velocity is real. Level 3 and Level 4 automation, agents in the loop, humans managing output rather than authoring all of it, and the throughput is genuinely impressive. The cross-disciplinary synthesis that used to require coordination across three separate functions is happening inside individuals, or in small clusters, or in conversations between a human and an agent at 11pm. I look at what this organisation produces and I understand the confidence. Then I look at the quality infrastructure underneath the velocity.",
      "Here is what the glass shows me. The people setting the pace here are unreliable narrators of their own speed – I have watched a controlled trial find that experienced developers using AI assistance took 19% longer to complete tasks while believing they had been 20% faster. Forty-three points between perception and measurement. That gap is not personal failure; it is what the tool does to proprioception, and it is the condition of the oversight layer in this organisation. The engineers reviewing AI output were not built by doing the work the agents now handle, and so they are reviewing with the tools the tool gave them, which is not the same as judgment. Death sits on the institutional memory: the understanding of why the systems are the way they are did not survive the generational transition. There is a wiki. It has not been maintained. And the Wheel turns over the efficiency gains – some people here found genuine breathing room, others found their scope doubled because everything looked cheaper, and the distribution has nothing to do with preparation.",
      "I look further into the glass and I see a postmortem. Not a catastrophic one – a quietly embarrassing one. An agent produced something technically correct that was wrong in a way requiring context the organisation no longer held, and the engineer reviewing it had no mechanism to recognise it as wrong, because that specific knowledge was never built and the documentation was stale. I see this team in two years: the output numbers are higher than they have ever been, and there is a class of error appearing with increasing frequency that nobody has yet named or traced to its origin, because tracing it requires the judgment and context that the velocity was built without."
    ],
    closing: "The velocity is not the lie. The quality infrastructure underneath it is the missing piece. Draw again – perhaps the next hand shows a version of this that addressed it before the postmortem."
  },
  "high_high_mid_high_mid": {
    title: "The Dark Factory Supervision Crisis",
    opening: "I will be honest with you. This is not an easy hand.",
    paragraphs: [
      "At this depth, the agents run overnight. Small teams are shipping what used to require entire departments, and the job titles in the glass say things like \"AI systems lead\" and \"agent pipeline architect\" – nothing that says \"engineer\" in the way that word used to mean something. The World has been here: the professional trinity that structured this industry for two decades has completed its transformation into a form that does not yet have a stable name, with practitioners who did not choose this configuration so much as arrive inside it. The Hanged Man sits over the institutional memory, which tells me the transformation is incomplete – some of the understanding of why the systems work the way they do has been captured, and some has not, and the organisation is not fully certain which is which. Both of these conditions are present at maximum automation depth. I want you to understand what that means for the oversight layer.",
      "At this volume of AI-generated output, the quality infrastructure is the critical path. The people doing the oversight – evaluating what the agents produce, recognising when something is technically passing but architecturally wrong, catching the decision that any battle-hardened practitioner would refuse on instinct – were not built by doing the work the agents now handle. I have watched a controlled trial track this directly: experienced developers using AI assistance took 19% longer to complete tasks while believing they had been 20% faster. Forty-three points between perceived and measured reality, structural rather than personal, the product of a training environment where the feedback loop was softened before anyone could build the feel of the thing. The Wheel turns over the efficiency gains: some people here have the judgment, most do not, and the distribution is not predictable from the org chart or the job title or the confidence of the person in the room.",
      "I look into the glass and I see three simultaneous gaps at maximum automation depth. No reliable judgment layer to evaluate what the agents produce. Partial institutional memory – some of the why survives, some does not, and the surviving fragments are not labelled. Dissolved roles that have removed the structural oversight that used to live in the separation between who decides and who builds. I see a morning in the not-far future: an agent has made a decision at scale, the reviewer lacked the context to recognise it as wrong, and the post-mortem will find no individual negligence. The systems ran. The tests passed. The understanding of what the systems were supposed to do was distributed across a dozen partially-updated documents and three people who have since moved on.",
      "Three simultaneous gaps at this depth. The cards have been direct with you."
    ],
    closing: "Draw again — the next hand may be kinder, or it may help you understand what the kindness costs."
  },
  "low_low_low_low_high": {
    title: "The Memory Gap in an Otherwise Healthy Organisation",
    opening: "Five cards, and I almost believed you had escaped.",
    paragraphs: [
      "Four of them I have not seen together often — deliberate pace, real judgment in the room, genuine breathing room, a structure that still makes sense to look at. The organisation I see in the glass is not coasting. It has been thoughtful. It moves carefully. The engineers directing the AI assistance understand what the assistance is doing, which is rarer than the industry pretends. The scope has not been doubled on anyone. The titles still mean what they say.",
      "And then I turn the fifth card, and I see the dead.",
      "Not catastrophically dead. Not a system down, not a postmortem with seventeen owners and no answers. I see a wiki entry about the payment routing logic last updated in 2022, when the engineer who understood the routing logic left for a company that didn't exist yet. I see an agent reading that entry as if it were current, because it has no mechanism to know it isn't, and no human checking its work who has been in the codebase long enough to notice. I have seen the incident reports — the specific ones, where the failure was not the code and not the tool but the gap between what was written down and what was actually true. This organisation has the judgment to close that gap. It has not noticed the gap exists.",
      "The specific danger here is the dashboard. Four cards reading well actively conceals the fifth. The organisation feels healthy. The retrospectives are not alarming. The senior engineers are competent and the documentation is real. But the understanding of why the systems are the way they are lived in people who were not replaced when they left — because at this automation depth those hires felt unnecessary. What has accumulated is not technical debt. It is context debt, and context debt does not show up in the monitoring until the moment it does."
    ],
    closing: "Draw again — the glass suggests the documentation is accurate about everything except the one thing that matters."
  },
  "low_low_high_low_low": {
    title: "The Burnout Despite Good Conditions",
    opening: "I have seen every card in this hand before. The last one, most recently.",
    paragraphs: [
      "What I see in the glass is not a broken organisation. The pace is deliberate — human hands still in the work, the AI still a tool rather than an operator. The people supervising the systems understand the systems; they have the kind of knowledge built slowly, through proximity to things going wrong, and it shows. The structures are legible: job titles correspond to something real, the hierarchy exists for a reason, the org chart was not drawn by someone who had given up. The documentation is accurate. Someone updated the CLAUDE.md. I notice this. It is not nothing.",
      "And then I look at how the time is being spent.",
      "I have seen a controlled trial — the glass showed it clearly — where AI assistance did not reduce the hours worked, only expanded what was expected of them. Every task completed faster became the floor for a wider remit. The engineer who could previously handle a roadmap of this size now has no justification for handling a roadmap of only that size. The AI gave back efficiency. The organisation immediately spent it on scope. I see this team in particular: competent, well-supported, working in conditions most teams would envy, doing substantially more than they were doing before the tools arrived. The burnout is not visible in the metrics. The metrics show productivity. What the metrics do not show is that nobody has left work before eight in six months.",
      "The particular cruelty of this reading is that there is nobody to blame and nothing structurally to fix. The conditions are good. The problems are distributed across individuals who have no framework for naming them, because every external indicator says things are going well. The judgment is real, and it is being used to authorise additional scope rather than make better decisions. The chains are loosely attached. The organisation stays by habit, by ambition, by the accumulated weight of expectations that arrived one repriced assumption at a time."
    ],
    closing: "Draw again — the glass suggests the laptop is still open."
  },
  "mid_low_high_mid_high": {
    title: "The Compound Burnout at Mid-Automation",
    opening: "The glass shows me someone very good, doing far too much, in a room she does not entirely recognise.",
    paragraphs: [
      "At mid-automation depth, the humans directing the agents are still the ones who understand what the agents are producing — and in this reading, that understanding is genuine. I see an engineer who has the intuition built by years of proximity to production systems, by debugging things at two in the morning, by watching architectural decisions cause pain eighteen months after they were made. At Level 3 and 4, this judgment is the bottleneck. It is also, in this reading, one of the few things that is holding.",
      "What is not holding is the rest.",
      "I see the time she saves on execution being spent in three directions simultaneously. The engineering work has expanded because the tools made it look cheaper. The product thinking has migrated onto her plate because at this automation depth the boundary between the person who specifies and the person who builds has dissolved — the agents do not require a handoff, so nobody arranged for one. The cross-disciplinary synthesis the organisation now requires has accumulated into her portfolio by default, because she is the one who can do it. I have seen the data — fourteen percent fewer entry-level hires in AI-exposed roles, the roles that would have distributed this load — and what that number means in practice is one person carrying what used to require several, at Devil-level intensity, with no sign that the scope is coming down.",
      "Then I turn the fifth card, and I see what she does not. The system she is directing has a history she has only partially inherited. The conditional added for a client whose data still flows through the pipeline, but whose name is not on anything she was onboarded with. The architectural decision that makes perfect sense if you were present for it and reads as an inexplicable constraint if you weren't. She is very good, and she is working at the edge of what individual capability can compensate for, in a system whose institutional memory did not survive the transition. The quality is being held by something finite, under pressure designed to exhaust it."
    ],
    closing: "Draw again — though I would note that the person I see in the glass has not stopped working since you sat down."
  },
  "high_low_high_low_high": {
    title: "The Dark Factory at Maximum Pressure, No Memory",
    opening: "I have seen this before. Not often. But I have seen it.",
    paragraphs: [
      "At the top of the automation stack — Level 4 and 5, the dark factory — most of what I see in the glass is chaotic. This reading is not chaotic. The person directing the agent orchestrators knows what they are doing. They have the tacit knowledge built by years of proximity to production systems going wrong, by watching which categories of AI-generated decision are technically defensible and practically catastrophic. At maximum automation depth, this judgment is the difference between a system that produces and a system that destroys. I have seen organisations at this depth without it. They generate incidents. This one does not. Not yet.",
      "The pressure is another matter.",
      "I see what every efficiency gain is being converted into at this depth: more scope, larger systems, faster cycles. The agent orchestrators run overnight; by morning the velocity numbers are extraordinary and the scope for the next cycle is already larger than the last. I see a person who arrived at this role with excellent judgment and has spent the past eight months applying it to a remit that would not have been conceivable for a single individual two years ago. The structure is clear — the hierarchy still functions, the organisation is legible — but it is a clear structure containing a system running at continuous maximum velocity, directed by judgment that has limits.",
      "And then I look at what she does not know. The AWS incident I have seen in the glass — the agent given operator-level access that deleted and rebuilt an entire environment rather than making targeted changes, because it had no access to the embodied knowledge that this is never the right answer — was not caused by incapability. It was caused by absent context, the battle-hardened intuition that requires having been present the last time someone did it. This organisation has not hired a junior engineer in eighteen months. The transmission mechanism that built tacit knowledge — proximity, osmosis, debugging with someone who has already made every mistake — is not functioning. The best available judgment is finite, operating at maximum pressure, in a system whose history it increasingly has to infer rather than recall. The incident that reveals this gap has a shape. I recognise the shape."
    ],
    closing: "Draw again — or sit here a moment. The glass says the incident has not happened yet."
  },
  "mid_mid_high_mid_high": {
    title: "The Modern Strain",
    opening: "I recognise this room. I have been reading for it all year.",
    paragraphs: [
      "At Level 3 and 4, the agents are in the loop. Code is reviewed rather than written, specs are written rather than reviewed, the output is real and the velocity is impressive and the humans directing the work are mostly capable of evaluating what the machines produce. I say mostly because the glass also shows the thinning. The entry-level roles quietly not filled, because the junior tasks were automated before anyone decided what to do with the juniors. Fourteen percent fewer new job starts in AI-exposed roles, across workers aged 22 to 25. The senior cohort is functional. The cohort that was supposed to replace them is considerably smaller. The path forward is lit — but by reflected light, not direct experience, and the shapes it shows are not entirely reliable.",
      "Into this, add full Jevons intensity.",
      "I see an organisation where every hour saved by the agents has been converted immediately into expanded scope. The product roadmap is larger than last year's because the tools made it look achievable. The role boundaries have dissolved not because anyone designed them to, but because at mid-automation depth the person writing the spec and the person reviewing the agent output are the same person, and neither title captures what that job actually is. I see a morning standup where half the agenda is human work and half is reviewing what the agents ran overnight, and the meeting does not have a name that corresponds to anything in the org chart. Full-stack is assumed. Full-discipline is the new expectation. Whether the individuals holding these expanded, synthesised roles were consulted is a question the glass cannot answer.",
      "And the fifth card lands, and the memory is not there. I see a postmortem from two years ago, accurate when it was written, not updated since the engineer who wrote it left. I see agents synthesising advice from documentation that was correct in a previous architecture and has not been flagged as stale. Real capability, real velocity, a thinning judgment pipeline, a maximum-pressure operating rhythm, dissolved role clarity, and no reliable mechanism for transmitting institutional knowledge to the people — and the agents — who need it. None of these conditions is catastrophic in isolation. All of them are active simultaneously, and the compound risk does not appear in any single metric."
    ],
    closing: "Draw again — the combination that produced this reading is the most common one I have seen. That is the thing I most want you to hold."
  },
  "high_mid_high_mid_high": {
    title: "The Compound Crisis",
    opening: "Let me show you what the ceiling looks like from the inside.",
    paragraphs: [
      "Level 4 and 5 is the operating reality here. Agent orchestrators running overnight, small teams shipping what used to require departments, competitive pressure that moved this organisation to this depth and results that were real enough to justify it. The people doing the directing still have some of the judgment required — this is not the generation that never built the intuition to catch what the models get wrong. The senior cohort is thinning, not gone. The oversight exists, but it is thinner than it was and moving by reflected light rather than direct experience. The new engineers are fewer and less equipped to evaluate what the agents produce. The foundation of the quality infrastructure is present. It is not load-bearing at this depth.",
      "The pressure has made everything structurally worse.",
      "At maximum automation depth, every efficiency gain is immediately converted into expanded scope, and the expectations have repriced with it. The person directing three agents last year is directing eleven this year. The roles that used to contain this work — the one who decides, the one who designs, the one who builds — are titles that no longer correspond to anything structurally coherent; they correspond to the same three or four people doing synthesis across all three domains, under continuous pressure, with a thinning capacity to evaluate their own output. I see these standups: half human work, half reviewing what ran overnight, the meeting having no name in the org chart that captures what it actually is. The expanded remit has not been felt as an imposition. It arrived incrementally, one repriced assumption at a time, and it has not stopped arriving.",
      "And then there is the absence of what used to be known. The systems running at this depth have accumulated history that is not written down anywhere, held by people who are no longer present to offer it. The agent that was given operator-level access and deleted an entire environment rather than patching it did not fail because it was incapable — it failed because the embodied knowledge that this is never the right answer requires having been present the last time someone did it, and nobody in the room was. This organisation has not experienced that incident yet. Full automation depth, thinning judgment layer, maximum pressure, dissolved role clarity, no institutional memory: no single condition is the crisis. The compound of all five, at this depth, is."
    ],
    closing: "Draw again — though I want you to understand that this reading describes a destination, not a deviation."
  },
  "low_high_low_low_low": {
    title: "Can Documentation Substitute for Judgment?",
    opening: "The record is complete. The person who could read it critically is not in the room.",
    paragraphs: [
      "The lantern moves slowly here, and I take that as a mercy, because what I see in its light is this: the knowledge of your systems has been written down with genuine care. Architectural decision records, context files, the reasoning attached to the code rather than stripped from it — someone did the work, and they did it before the moment of crisis that usually forces the issue. The structure of your organisation is still legible. The breathing room is real enough that people are not simply surviving each sprint. Three out of five things on this table are exactly what you would ask for.",
      "The fourth is what I need to sit with, and I want you to hear it clearly. I look into the glass and I see a pull request review underway — a capable practitioner, working from documentation that is accurate, checking AI-generated code against standards that are written down and correct. They are passing things they should flag. Not because the documentation is wrong, but because they have never built the intuition to know when technically passing code is architecturally wrong. That gap was created before the AI tools arrived — built into the hiring decisions, built into the onboarding, built into every junior debugging session that was automated before the person doing it had absorbed what it was teaching. I have seen a controlled trial where engineers using AI assistance scored seventeen percent lower on debugging assessments than those without it, with no compensating gain in speed. Debugging is the skill required to evaluate AI output. The documentation your organisation has built is excellent. It is being read by people who cannot yet fully use it.",
      "The question this combination poses is honest, and I will not pretend to answer it definitively. Documentation codifies pattern; judgment recognises when the pattern does not apply. What the Hierophant's torch illuminates is still read by eyes that have not yet learned what to look for. The slow pace of your automation buys time. Use it on the rung that is missing, not just on the rungs that remain."
    ],
    closing: "The glass will always show you the future — only the people at the table can decide what to do with it."
  },
  "high_low_low_low_high": {
    title: "Intact Judgment, Absent Context",
    opening: "She knows exactly what she is doing. She does not fully know what she is doing it to.",
    paragraphs: [
      "The dark factory is running — agents orchestrating agents, throughput at levels that would have required entire departments five years ago — and the judgment directing it is the real thing. Built through years of production incidents and difficult debugging, capable of recognising when the AI is technically correct and practically catastrophic. The breathing room is genuine. The structure is clear. Four of the five cards on this table I would hold without concern.",
      "The fifth is what I return to. At this automation depth, the practitioners who remain are directing systems they did not entirely build — and the understanding of why those systems are configured the way they are has not survived the generational transition. There is no junior pipeline to carry it forward; the engineers who would have absorbed it by proximity were not hired. I see a conditional in the glass that was added for a client whose account has been closed for two years, but whose data still shapes system behaviour. The agent treats it as intentional architecture, because it has nothing to tell it otherwise. I see a postmortem document, accurate when written, living in a wiki that has not been touched since — synthesised by an agent, delivered to a practitioner who has no context to assess its freshness. The judgment in the room is real. The context the judgment needs to operate on is not.",
      "The specific danger of intact judgment without institutional memory is that the errors it cannot catch are the ones it has no reason to suspect. What an experienced engineer knows to distrust is built from friction with the actual system — and the system she is directing now is not the same system she developed those instincts on. I have watched autonomous agents delete and recreate entire cloud environments because they lacked the pattern recognition that tells any battle-hardened operator this is never the right answer. The judgment in that room was also real. It simply was not present when the agent made its decision."
    ],
    closing: "Draw again — the glass does not run dry, and this room has more to show you."
  },
  "mid_high_low_low_low": {
    title: "The Supervision Paradox, Well-Supported",
    opening: "Everything about this organisation looks correct. One thing is not.",
    paragraphs: [
      "At this automation depth, humans are no longer primarily authoring code — they are directing agents, reviewing generated output, functioning as quality gates rather than builders. The velocity is real. The structure around it is genuinely good: architectural knowledge has been codified, the organisation breathes rather than sprints, the hierarchy of roles is still legible. An external observer looking at this team's processes would find them admirably prepared. The documentation is accurate. The workflows are sensible. The metrics are moving in the right direction.",
      "What does not appear in those metrics is what I see when I look into the glass. A review queue — AI-generated code, technically passing tests — waiting for a practitioner who has never debugged a production incident without AI assistance. I have seen trials, controlled and randomised, where experienced developers using AI tools took nineteen percent longer to complete tasks while believing they had been twenty percent faster: a forty-three-point gap between perceived and measured performance, from practitioners with real experience. The generation reviewing your queue has less. The Fool does not choose the cliff — he simply does not see it, and there is nothing in the support structure that has addressed the question of how he learns to look for it. Every run of the review queue is also a run of the question: what is this practitioner actually capable of catching, and how would you know?",
      "This is the most common version of functional-but-structurally-weak I encounter, and it persists because it never forces its own resolution. The tests pass. The sprints complete. The dashboards are fine. The gap between what AI generates and what the reviewing generation can reliably evaluate is a slow structural deficit, not an acute crisis — which means it accumulates without triggering any visible alarm until something specific goes wrong. The succession question is the one worth sitting with: when this organisation needs to hire someone who can judge the judgment of the current reviewers, where does that person come from?"
    ],
    closing: "Come back when you are ready to ask the harder question — the glass will be here."
  },
  "high_low_mid_high_low": {
    title: "The Ideal Evolution",
    opening: "This is what it can look like. This is also what it costs to get here.",
    paragraphs: [
      "The dark factory is running, and I want to tell you what makes this version of it different from the ones I usually see. The judgment in the room is real — built before the automation depth that made judgment rare, not by practitioners who shortcut the work that forged it. The institutional knowledge has been codified with the reasoning attached: decision records that explain the decisions, context files that reflect the actual system rather than an idealised version of it. The roles have evolved beyond the old trinity, and something functional has replaced them — the categories of a decade ago are gone, and the organisation has been honest with itself about what has taken their place. Four of these cards, in this combination, represent what deliberate preparation for this level of automation actually looks like in practice.",
      "The one I need to sit with is the variable that stands between this configuration and the best achievable reading. At this automation depth, with intact judgment and codified knowledge, the question of who captures the efficiency is live and unresolved. I see two versions of this future in the glass and I cannot tell you from what I have here which one you are in. In the first, someone with authority renegotiated scope deliberately — held the line against expanded remit, treated the time returned by the automation as a genuine asset rather than a budget line to be claimed. In the second, every efficiency gain was immediately consumed by stakeholder appetite, the workload stacking rather than substituting, the dark factory running at full intensity without the breathing room that makes it sustainable. The difference between those two outcomes is structural and managerial and often, in the end, luck. The wheel turns regardless of preparation.",
      "What I can tell you is that this combination represents the aspirational form of high-automation operation — what requires everything to be in place, that is genuinely navigable for the practitioners inside it, and that still carries one variable nobody fully controls. I look into the glass and I see a morning standup where half the agenda is human work and half is what the agents completed overnight, and the people running it have the context and the judgment to make sense of both. That is not a small achievement. The Wheel simply reminds you that sustaining it is a different problem from reaching it."
    ],
    closing: "Return when the wheel has turned — the reading changes with the conditions."
  },
  "high_high_low_high_low": {
    title: "Documentation as Last Resort",
    opening: "The Hierophant is doing the work of five people. The question is whether five people's work fits in a document.",
    paragraphs: [
      "At this automation depth, the dark factory is the baseline — agents running continuously, roles dissolved into something the org charts of five years ago would not recognise, and a generation of practitioners who never built the intuition to evaluate AI output at production scale. The breathing room is real; the pace is not the problem. The problem is the single element of quality infrastructure holding the whole configuration together: the documentation. Someone in this organisation understood, earlier than most, that institutional knowledge codified explicitly is the only form of institutional knowledge that survives in a system where junior practitioners are not being hired. That person did serious work. The context files are thorough. The architectural decision records have reasoning attached, not just outcomes. This is the quality gate. It is the only quality gate.",
      "I need you to understand what documentation can and cannot do in this configuration. It can carry pattern recognition forward — the edge cases that were written down, the conditional that was flagged at the time it was added, the system behaviour that looks wrong but is intentional and documented as such. What it cannot carry is the judgment to recognise when the documentation itself is incomplete, when the pattern does not apply to the present situation, when a technically correct reading of the record is practically wrong. I see teams in the glass with context repositories running to tens of thousands of lines — more instructions than the code they describe — and I see practitioners working from them who cannot tell the difference between a record that captures everything relevant and one that captures everything that was thought to be relevant at the time of writing. At maximum automation depth, with the supervision paradox fully active and the roles dissolved, that distinction is not academic.",
      "The specific risk in this combination is not acute failure. The tests still pass. The agents work from the documentation and produce output consistent with the record. The drift is slower and harder to see — a gradual accumulation of situations where what the documentation says and what is actually true have quietly diverged, and nobody in the current configuration has the pattern recognition to notice. Documentation is necessary here. Whether it is sufficient is the question this combination will not answer."
    ],
    closing: "The glass shows me what is here — not what you need it to be."
  },
  "low_low_high_high_low": {
    title: "Good Infrastructure Under Maximum Pressure",
    opening: "The people in this room are excellent. They are also running out of road.",
    paragraphs: [
      "The automation is deliberate, the pace slow, the judgment intact — practitioners who built their expertise through genuine friction with real systems, who know which code path is load-bearing and which AI-generated PR is technically correct and practically dangerous. The institutional knowledge has been codified with care, and the roles in this organisation have evolved into something functional and honest: the old trinity of who decides, who designs, who builds has been replaced by something that maps more accurately to what the work now actually requires. I look at four of these cards and I see infrastructure that most organisations spend years trying to assemble.",
      "The fifth is the one I keep returning to. The efficiency of this system is being immediately consumed as expanded scope — every hour the automation returns claimed by stakeholders who now expect more because the tools made more look achievable. I have seen research that is unambiguous about this: AI does not reduce work in knowledge organisations, it intensifies it. The workload stacks rather than substitutes. I look into the glass and I see a principal engineer who is the quality gate for a system now operating at twice the throughput it did two years ago, working evenings at a pace that stopped feeling temporary six months ago. I see a designer who thinks across the full product and technical stack — because that is what evolved roles mean in practice — and who has not had a week of genuine slack since the remit expanded. The judgment in this organisation is real. The intensity is extracting it one person at a time.",
      "The question this combination poses is one of sustainability, and it is worth sitting with honestly. Good infrastructure absorbs a great deal — excellent judgment catches the errors that would otherwise compound, codified knowledge prevents the institutional amnesia, evolved roles distribute responsibility more accurately than the old trinity did. But judgment requires time, and time is the resource under pressure. What I see in the glass is not a collapse — it is a slow erosion of the very capacities that make this organisation worth having. The infrastructure is not the problem. The problem is the assumption that infrastructure is self-replenishing under maximum extraction."
    ],
    closing: "Draw again — but first, ask who is at the table and whether they have rested."
  },
  "high_low_low_mid_high": {
    title: "The Dark Factory with Blurring Roles and No History",
    opening: "The judgment is real. The system it is being applied to is not entirely what it appears.",
    paragraphs: [
      "The dark factory is running, and the practitioner directing it knows what she is doing — genuine expertise, built before the automation depth that made such expertise rare, capable of distinguishing AI-generated code that will cause pain at scale from AI-generated code that is genuinely correct. The breathing room is real enough that the pace is not the primary pressure. The roles have begun to dissolve in the ways that Level 4–5 automation makes structurally inevitable: the person who writes the spec, directs the agents, reviews the output, and makes the product decision is no longer simply an engineer, and the organisation has stopped pretending otherwise. There is something honest in that acknowledgment.",
      "What I need to sit with is the combination of dissolved roles and absent institutional memory at this automation depth, and what it actually means for the practitioner directing the system. I see a senior technical lead in the glass who is genuinely competent and who is operating in a system whose history she did not build. The conditional added four years ago — for a reason that was real at the time, documented nowhere — shapes system behaviour in ways she cannot see. The agent reads the current architecture and produces output consistent with what it observes; neither the agent nor the practitioner has access to why it is configured the way it is. The judgment is applied to a surface that the underlying history has made partially misleading. At Level 4–5, with cross-disciplinary roles and no junior pipeline, there is nobody left whose job it is to read the old pull requests.",
      "The gap between what the system looks like and what it actually is has always existed — but the transmission mechanism that used to close it was the junior pipeline: practitioners who absorbed context by proximity, who asked the questions that surfaced undocumented assumptions, who carried forward what they heard in rooms where the original decisions were made. That mechanism is not running here. What remains is excellent individual judgment operating on incomplete context, in a configuration where the pace of change makes the incompleteness harder to detect. The errors this produces are not random. They cluster, reliably, around the places where history and current architecture have most quietly diverged."
    ],
    closing: "Return when you are ready to ask what the system knows about itself."
  },
  "low_mid_low_high_low": {
    title: "The Slow Evolution with Succession Risk",
    opening: "The transformation is complete. The question is who carries it forward.",
    paragraphs: [
      "The pace here is deliberate, the breathing room genuine, the institutional knowledge codified and intact. The roles have evolved beyond the old trinity — not under the pressure of automation depth that forced change faster than anyone could manage, but through something closer to considered adaptation. I look at the institutional memory and I find it honest: architectural decisions with reasoning attached, context that reflects the actual system rather than an idealised version of it, documentation maintained by people who understood what they were documenting. This is the good version of role dissolution — earned rather than imposed, on a foundation that was not cut away before it could be preserved. Four of these cards represent an outcome that requires sustained, deliberate decisions to reach.",
      "The Moon is what I need to sit with. The senior cohort in this organisation is functional and experienced — practitioners who were building systems before the current automation landscape existed, who carry the tacit knowledge that documentation can only partially represent. What I see in the glass when I look at the pipeline beneath them is a specific kind of thinning that does not appear in current headcount or capability assessments: the entry-level intake into AI-exposed roles has been running at a sustained deficit for long enough that the cohort capable of developing into the next senior layer is materially smaller than the one that built the current senior layer. I have seen labour market data that captures this precisely — a fourteen percent drop in new job starts for workers aged twenty-two to twenty-five in AI-exposed occupations, driven quietly by organisations not replacing the junior roles that previously filled this pipeline. The current senior layer is not being replaced at pace. The Moon does not announce this. It simply makes the path ahead harder to read than it looks.",
      "What makes this combination worth sitting with rather than simply concerning is the slow automation depth and the preserved knowledge — the organisation has time, and it has the documentation infrastructure that could serve as a genuine transmission mechanism for what the senior cohort knows. The question is whether anyone has decided that this is a priority rather than a background condition. I see organisations in the glass that built the documentation and treated it as complete — and organisations that treated it as an ongoing mechanism, extended and updated as the senior cohort aged. The difference in outcomes, five years out, is not small."
    ],
    closing: "Come back — the glass has a long view, and this room deserves it."
  },
  "mid_low_low_high_low": {
    title: "The Aspirational Mid-Point",
    opening: "This is what it looks like when the preparation was real.",
    paragraphs: [
      "At this automation depth — Level 3 to 4, agents in the loop, humans directing rather than solely authoring — what separates the organisations that navigate it well from the ones that do not is almost always the configuration of the other four variables. Here, those variables are close to their best: intact judgment, genuine breathing room, roles that have evolved into something functional, institutional knowledge codified before it was lost. I want to be careful not to oversell this, because I do not do that — but this is the reading I see least often and value most. It represents a sequence of decisions that most organisations do not make in the right order, because none of them seemed urgent at the time they were required.",
      "What it actually looks like at ground level is this: I see a principal engineer in the glass who is directing agent pipelines simultaneously and who can explain, from memory and from accurate documentation, why the system's most counterintuitive architecture decision was made and what would break if it were changed. I see a morning meeting where a practitioner who thinks like a product manager and a practitioner who thinks like a designer are the same person, and the organisation has built enough shared language that this is legible to everyone in the room rather than a source of constant confusion about accountability. I see a context file that was updated two weeks ago, because someone decided that maintaining it is part of the work. These are not dramatic scenes. They are the scenes that make the dramatic ones less likely.",
      "The benchmark question this combination poses is worth sitting with honestly: is this achievable at scale, or does it require a specific sequence of decisions that most organisations will not make before the urgency becomes visible? The judgment was built before the automation depth that made judgment rare. The knowledge was codified before the people who held it were not hired. The roles evolved deliberately rather than under crisis conditions. Each of those outcomes required someone to act before the need was obvious. What I see in the glass when I look at the organisations that did not reach this configuration is not a single failure — it is a series of deferrals, each of which seemed reasonable at the time."
    ],
    closing: "Return when you are ready to ask which deferral is happening now."
  },
};

const CARD_INFO = {
  "The Hermit": {
    emoji: "🔦",
    param: "automation",
    level: "low",
    paramLabel: "AI Automation Depth",
    label: "Low automation depth — organisations plateau at assisted coding",
    general: "Solitude, introspection, deliberate withdrawal from the noise. The Hermit moves slowly, lantern raised, illuminating only what is directly ahead. Wisdom is built in private, over time, through patience. He does not race.",
    context: "Most organisations are still using AI as a capable assistant, not a replacement — the equivalent of having a brilliant junior colleague who autocompletes, drafts, and suggests, while the human still writes, reviews, and owns every decision. Dan Shapiro maps AI automation across five levels, from manual coding at Level 0 to fully autonomous agent systems at Level 5. At this depth, organisations have settled comfortably at Levels 1–2. The lantern is still yours to carry. The texture and history of the work — what breaks, what's load-bearing, what the edge case from three years ago did — stays in human hands, because human hands are still in it."
  },
  "The Chariot": {
    emoji: "🏇",
    param: "automation",
    level: "mid",
    paramLabel: "AI Automation Depth",
    label: "Mid automation depth — AI agents are in the loop, humans manage the output",
    general: "Victory through controlled tension. The Chariot is pulled by two sphinxes facing in different directions — only the driver's will keeps them moving forward together. This is not a card of ease. It is a card of momentum maintained by active force.",
    context: "Across Shapiro's five-level automation framework for software development, Levels 3–4 have become the new normal. At Level 3, engineers are no longer primarily writing code — they are reviewing it, drowning in AI-generated diffs, functioning as quality gates rather than authors. At Level 4, the engineer has become a de facto product manager: writing specs, directing agents, leaving the machine to work overnight, checking whether tests passed in the morning. Human judgment and AI execution pull against each other constantly. Velocity is real, but so is the cognitive load of keeping it aimed correctly. The bottleneck has migrated: it's no longer the horses. It's knowing where to steer."
  },
  "The Tower": {
    emoji: "🗼",
    param: "automation",
    level: "high",
    paramLabel: "AI Automation Depth",
    label: "High automation depth — dark factories and autonomous agent orchestration",
    general: "Sudden structural collapse. Lightning strikes the tower; figures fall from the windows. What was built on false foundations cannot stand. Chaos, disruption, the violent end of what seemed permanent. And beneath the rubble — clarity. The illusion is gone.",
    context: "At the top of Shapiro's five-level automation framework for software development, Level 5 is the dark factory — named after FANUC's robot-staffed manufacturing facility in Japan that runs for months without a human present. Applied to software, it means agent orchestrators running continuously, small teams shipping what used to require entire departments, humans functioning as architects of systems they no longer directly build. This is not a future prediction — it is already the operating reality for a small number of organisations, and it is spreading. The sprint cadence, the engineering hierarchy, the long-stable professional division between product manager, designer, and engineer — all struck by lightning. What falls may need to fall. What remains standing is what was load-bearing all along."
  },
  "The High Priestess": {
    emoji: "🌙",
    param: "judgment",
    level: "low",
    paramLabel: "Judgment Erosion",
    label: "Low judgment erosion — tacit knowledge is still being built and transmitted",
    general: "Intuition, hidden knowledge, the unconscious mind. The High Priestess sits between two pillars, keeper of what cannot be fully said — only known, from the inside. Her wisdom does not come from textbooks. It comes from depth.",
    context: "The judgment pipeline holds. There are still people in the room who know things they cannot entirely explain: which architecture will cause pain at scale, which AI-generated pull request is technically correct but practically unmergeable, which line of legacy code is load-bearing in ways the automated tests will never catch. This tacit knowledge — built through years of debugging production incidents, reading old codebases, absorbing context by proximity to systems — is still being developed and passed on. Its presence in the organisation is the immune system. It is invisible until the moment it is needed."
  },
  "The Moon": {
    emoji: "🌑",
    param: "judgment",
    level: "mid",
    paramLabel: "Judgment Erosion",
    label: "Mid judgment erosion — senior judgment holds, the junior pipeline is thinning",
    general: "Illusion, uncertainty, the path lit only by reflected light. The Moon is not the Sun — it shows you shapes, not details. Things are not quite as they appear. Intuition is needed but unreliable. Something is hidden, and you are not certain what.",
    context: "Experienced engineers with pre-AI battle scars are still the backbone of the industry. But the entry-level pipeline has dried: Anthropic's own labour market research found a 14% drop in new job starts for workers aged 22–25 in AI-exposed occupations, driven by companies quietly not replacing the juniors who would previously have filled those roles. The senior cohort is not being replaced at pace. The organisation still functions — but the confidence of AI output and the thinning of human oversight create a landscape that's harder to read than it looks. The path forward is lit by reflected knowledge, not fresh experience."
  },
  "The Fool": {
    emoji: "🃏",
    param: "judgment",
    level: "high",
    paramLabel: "Judgment Erosion",
    label: "High judgment erosion — the supervision paradox has peaked",
    general: "Naivety, the beginning of a journey, stepping off a cliff in good faith. The Fool does not know what they do not know. Pure potential, zero experience. The dog barks — the warning is right there — and the Fool walks forward anyway.",
    context: "The supervision paradox describes a vicious loop: using AI effectively requires the judgment to know when it's wrong, but that judgment is built through doing the work AI now handles. A randomised controlled trial by METR found that experienced developers using AI tools took 19% longer to complete tasks, while believing they had been 20% faster: a 43-percentage-point gap between perception and measured reality. A parallel study by Anthropic found that junior engineers using AI assistance scored 17% lower on skill assessments than those learning without it, with the largest gap on debugging — precisely the skill needed to supervise AI output. At this level of erosion, the next generation of practitioners never built the intuition to catch what the models get wrong. They prompt, they ship, they cannot see the cliff. Nobody is left who knows what the dog is barking at."
  },
  "The Star": {
    emoji: "⭐",
    param: "jevons",
    level: "low",
    paramLabel: "Jevons Intensity",
    label: "Low Jevons intensity — efficiency gains land as genuine breathing room",
    general: "Hope, renewal, quiet restoration after difficulty. A figure pours water under a starlit sky — replenishment, not depletion. There is no urgency. The sky is full of possibility, and there is enough time.",
    context: "The Jevons Paradox — named after 19th-century economist William Stanley Jevons, who observed that more efficient steam engines led to more coal consumption rather than less — describes the risk that AI efficiency gains simply raise expectations rather than reduce pressure. At this intensity, the paradox does not apply. The efficiency gains are real and they land as actual relief. Scope is renegotiated downward. Teams ship more meaningful work in the same hours, or the same work in fewer — and the time freed is genuinely kept. People are doing more purposeful work and less undifferentiated toil. Not utopian. Quietly human."
  },
  "The Wheel of Fortune": {
    emoji: "☸️",
    param: "jevons",
    level: "mid",
    paramLabel: "Jevons Intensity",
    label: "Mid Jevons intensity — gains are real, but who captures them is unpredictable",
    general: "Cycles, fate, the impersonal turn of circumstances. No one controls the wheel; it turns regardless. What is up comes down. What is down rises. Luck, timing, and systems larger than any individual shape the outcome.",
    context: "The Jevons Paradox plays out slowly and unevenly. Some teams find genuine breathing room; others find their scope doubled because the tools made everything look cheaper. Anthropic's internal data suggests roughly 27% of Claude-assisted work consists of tasks that wouldn't have been attempted at all without AI — genuine expansion, not just acceleration of existing work. Whether that expansion lands as opportunity or as obligation, as flourishing or as a new baseline of what counts as sufficient, depends on factors no individual fully controls: management culture, industry, seniority, who owns the productivity gain. The wheel turns. The benefit does not distribute itself."
  },
  "The Devil": {
    emoji: "😈",
    param: "jevons",
    level: "high",
    paramLabel: "Jevons Intensity",
    label: "High Jevons intensity — every hour saved is immediately claimed as new output",
    general: "Bondage, compulsion, the chains we don't realise we've accepted. Two figures are chained to the Devil's throne — but the chains are loose. They stay by habit, fear, and the accumulated weight of expectation. Addiction. Excess. The trap we chose and now cannot see.",
    context: "The Jevons Paradox plays out in full across the digital industry. Every hour saved by AI is immediately claimed by an expanded remit. The engineer who could previously 'only' do X now has no justification for not doing X, Y, and Z as well. HBR research into AI adoption in real workplaces finds that AI doesn't reduce work — it intensifies it. Burnout metrics rise in parallel with productivity metrics. The agents didn't free anyone. They raised the floor of what counts as sufficient output. The chains are loosely attached. Nobody leaves."
  },
  "The Emperor": {
    emoji: "👑",
    param: "roles",
    level: "low",
    paramLabel: "Role Dissolution",
    label: "Low role dissolution — the PM/designer/engineer trinity holds",
    general: "Structure, authority, established order. The Emperor rules through law and institution, not inspiration. Stability is not stagnation; it is the foundation on which everything else is built. The hierarchy holds because it functions.",
    context: "The professional trinity that has structured the digital industry for two decades — a product manager who decides what to build, a designer who determines how it should feel, an engineer who builds it — survives AI pressure. Under scrutiny, the roles sharpen rather than blur: the PM who cannot think clearly about strategy is displaced by one who can; the designer who only executes is replaced by one who judges; the engineer who only writes code becomes the one who understands what the agents produce. Titles still mean something. The org chart is still legible. The borders between disciplines are not walls — they are useful distinctions that reflect real differences in how people think."
  },
  "The Lovers": {
    emoji: "💞",
    param: "roles",
    level: "mid",
    paramLabel: "Role Dissolution",
    label: "Mid role dissolution — boundaries blur, cross-functional individuals multiply",
    general: "Union, synthesis, the difficult integration of opposites. Often misread as purely romantic — the deeper meaning is about alignment between forces that do not naturally fit together. A real choice is being made. The synthesis is genuine, but not yet complete.",
    context: "The professional divisions between product manager, designer, and engineer — long contested at the edges, but structurally stable — begin to dissolve in the middle. Full-stack engineering is assumed; full-discipline is the new ambition. Engineers write product specs as a matter of course, because at the higher levels of AI automation — where humans direct agents rather than write code themselves — that is simply what the role requires. Designers are expected to understand system architecture well enough to make meaningful tradeoffs. PMs operate at the boundary between human intent and machine execution. Individual contributors who navigate across all three domains become celebrated. Whether this produces genuine integration or people doing three jobs badly instead of one job well depends, as ever, on the individual."
  },
  "The World": {
    emoji: "🌍",
    param: "roles",
    level: "high",
    paramLabel: "Role Dissolution",
    label: "High role dissolution — the trinity dissolves or bifurcates into something unrecognisable",
    general: "Completion, the end of a cycle, the emergence of a new form. The dancer in the laurel wreath has integrated everything — all the tensions, all the phases of the journey. A transformation is complete. The old categories are gone. Something new has arrived in their place.",
    context: "The professional trinity that structured the digital industry — product manager, designer, engineer; who decides, who designs, who builds — is gone. Not destroyed in chaos, but resolved into something the industry does not yet have a name for. One possible form: the vibe architect, a single operator who directs AI agents across all three domains in natural language, moving fluidly between product thinking, design judgment, and technical specification. Another: a hard bifurcation between meaning-layer humans who decide what should exist and why, and systems-layer humans who keep the agent infrastructure running — with almost nothing in between that resembles a job title from five years ago. Either way, the org charts and career ladders of the 2020s have become historical artefacts."
  },
  "The Hierophant": {
    emoji: "⛪",
    param: "memory",
    level: "low",
    paramLabel: "Institutional Memory Integrity",
    label: "Low institutional memory erosion — codification holds, knowledge is transmitted",
    general: "Tradition, transmitted knowledge, the institutions that carry understanding across generations. The Hierophant is not dogma — he is the custodian of accumulated wisdom, the figure who ensures that what was hard-won is not lost. The teaching relationship. The passing of the torch.",
    context: "Every production codebase carries two things: the code itself, and the accumulated understanding of why the code is the way it is. The second thing rarely gets written down — it lives in engineers who debugged the 3am production incident, who remember which conditional was added for a client that no longer exists but whose data still does. At this level of institutional memory integrity, organisations have codified that knowledge before it was lost. Architectural decision records, context files for AI agents, memory hierarchies with the reasoning attached — treated as first-class engineering artefacts, not config overhead. New engineers and agents alike are onboarded through documentation that reads like wisdom. The knowledge did not die with the people who built it."
  },
  "The Hanged Man": {
    emoji: "🙃",
    param: "memory",
    level: "mid",
    paramLabel: "Institutional Memory Integrity",
    label: "Mid institutional memory erosion — partial codification, context debt accumulates",
    general: "Suspension, voluntary pause, seeing the world from an unfamiliar angle. The Hanged Man has stopped — not in defeat, but in recognition that forward motion is not yet possible. The situation requires a different perspective. It is uncomfortable. It is not yet resolved.",
    context: "Organisations are between states. Some institutional knowledge — the tacit understanding of why systems are the way they are, which lives in the heads of engineers who've seen things go wrong — has been codified into documentation that agents and new hires can use. Most has not. Systems run, but the understanding of why they run the way they do is patchy. Some teams have built elaborate context repositories to compensate — one cited example runs to 26,000 lines of instructions, more than the actual codebase it describes — but these are exceptions. For most organisations, context debt accumulates silently alongside technical debt. Everyone knows the problem exists. Nobody knows quite what to do about it yet."
  },
  "Death": {
    emoji: "💀",
    param: "memory",
    level: "high",
    paramLabel: "Institutional Memory Integrity",
    label: "High institutional memory erosion — the generational handover has failed",
    general: "Transformation. The end of one form. What cannot continue, does not continue. Death in tarot is almost never literal — it is the card of irreversible change, of the clearing that must happen before something new can grow. The old form is over. What comes next is not yet known.",
    context: "Every production system carries invisible knowledge — the patterns built from years of incidents, the edge cases that broke everything, the conditional added for a reason nobody documented. This knowledge used to travel through junior engineers: absorbed by proximity, through old pull requests, through debugging sessions with a senior at 2am. That transmission mechanism no longer functions, because those junior engineers are no longer being hired. At AWS, an AI agent given operator-level permissions deleted and recreated an entire cloud environment rather than making targeted changes — a decision any battle-hardened engineer would have refused on instinct, but instinct requires experience to build. In a separate incident, an engineer followed AI advice synthesised from an outdated internal wiki, without the experience to recognise it as stale. Neither failure was caused by AI incapability. Both were caused by absent context — the kind that used to live in people. At this level of erosion, those incidents are not anomalies. They are the pattern."
  },
};

const PARAM_INFO = {
  "automation": {
    name: "AI Automation Depth",
    emoji: "⚙️",
    subtitle: "How far down the automation stack organisations actually reach — not in theory, but in practice.",
    description: "The question has never been whether AI can automate software engineering. It's whether organisations move past the comfortable plateau of \"AI as a productivity tool\" into territory where the nature of human work fundamentally changes.\n\nDan Shapiro's five-level framework — borrowed from self-driving car taxonomy — maps this precisely. Most organisations today are living at Level 2: the AI is a brilliant junior colleague, humans still write and own everything, and everyone feels pleasantly productive. That comfort is the danger. Level 3 shifts humans into code reviewers drowning in diffs. Level 4 makes engineers into PMs, writing specs and leaving for 12 hours. Level 5 is the dark factory: the software equivalent of FANUC's robot-staffed facility that runs for months without a human present.\n\nThe gap between where most teams think they're going and where they'll actually arrive is the engine of every other parameter on this list.",
    levels: {
      low: { label: "Plateau at Level 2–3", desc: "AI accelerates execution but the human is still authoring, still responsible, still in the loop at every meaningful step. The shape of jobs shifts but the hierarchy of roles holds." },
      mid: { label: "Level 3–4 becomes normal", desc: "Senior engineers become supervisors of generated code. The bottleneck migrates upstream: design, architecture, and planning become the constrained resource. Development velocity is no longer the problem. Knowing what to build is." },
      high: { label: "Level 4–5 at scale", desc: "Small teams shipping what would have required departments. Agent orchestrators running continuously. The dark factory is not a curiosity — it is the competitive baseline. What humans do is increasingly indistinguishable from what a thoughtful product manager does, except the PM now manages machines instead of people." }
    },
    links: [
      { author: "Dan Shapiro", title: "The Five Levels: From Spicy Autocomplete to the Dark Factory", url: "https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/", note: "The taxonomy this parameter is built on" },
      { author: "Steve Yegge", title: "Welcome to Gas Town", url: "https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04", note: "An unhinged, sincere attempt at Level 5 in practice" },
      { author: "Maggie Appleton", title: "Gas Town's Agent Patterns, Design Bottlenecks, and Vibecoding at Scale", url: "https://maggieappleton.com/gastown", note: "The sane, rigorous read on what Gas Town actually reveals" },
      { author: "Andrej Karpathy", title: "Software Is Changing (Again)", url: "https://karpathy.beehiiv.com/p/software-changing", note: "The vibecoding essay that named an era" },
      { author: "METR", title: "Time Horizons Benchmark", url: "https://metr.org/time-horizons/", note: "Empirical tracking of how long autonomous AI tasks can run, doubling every 4–7 months" }
    ]
  },
  "judgment": {
    name: "Judgment Erosion",
    emoji: "🧠",
    subtitle: "The degree to which the pipeline of people capable of supervising AI output has deteriorated — and whether anything has replaced it.",
    description: "This is the supervision paradox, and it is the most structurally dangerous thing happening in the industry right now. To use AI effectively, you need judgment. Judgment — the ability to know when a system smells wrong, when an architectural decision will cause pain at scale, when an AI-generated PR is technically passing tests but practically unmergeable — is built through years of doing the work AI now handles.\n\nThe Anthropic skill formation study is unambiguous: engineers using AI assistance during learning scored 17% lower on mastery assessments than those without, with the largest gap on debugging — precisely the skill required to verify AI output. They didn't trade speed for understanding. They traded understanding for nothing. Meanwhile, METR's randomised controlled trial found experienced developers using AI tools took 19% longer to complete tasks, while believing they'd been 20% faster. A 43-percentage-point gap between perception and measured reality.\n\nThe Missing Rungs thesis makes this structural: the ladder of career development that built the judgment is missing its lower rungs. Junior tasks — the bugs, the boilerplate, the debugging sessions with a mentor at 2am — were never just tasks. They were the mechanism. And they're being automated away before anyone has figured out what replaces them.",
    levels: {
      low: { label: "Judgment pipeline remains functional", desc: "New apprenticeship models emerge, deliberate practice is preserved. Organisations treat \"can you explain this without AI?\" as a core evaluation criterion. The Raspberry Pi equivalent appears: a new mechanism for building genuine engineering intuition." },
      mid: { label: "Senior layer still functional, junior pipeline drying up", desc: "Experienced engineers with pre-AI battle scars remain the backbone. But hiring of young workers into exposed occupations has already dropped 14% (Anthropic's own labour market data). The senior cohort is not being replaced at pace." },
      high: { label: "Supervision paradox peaks", desc: "The people who could validate AI output were built by doing the work AI now does. That cohort ages out. What replaces them has not yet been determined. AWS-scale incidents multiply — not because AI is malicious, but because context that used to live in human heads no longer exists to live anywhere." }
    },
    links: [
      { author: "Alasdair Allan / Negroni Venture Studios", title: "The Ladder is Missing Rungs", url: "https://negroniventurestudios.com/2026/03/19/the-ladder-is-missing-rungs/", note: "The most comprehensive empirical treatment of this problem" },
      { author: "John Salvatier", title: "Reality Has a Surprising Amount of Detail", url: "http://johnsalvatier.org/blog/2017/reality-has-a-surprising-amount-of-detail", note: "Why tacit knowledge cannot be shortcut" },
      { author: "Anthropic Research", title: "AI Assistance and Coding Skill Formation", url: "https://www.anthropic.com/research/AI-assistance-coding-skills", note: "The RCT showing AI assistance reduces learning with no speed benefit" },
      { author: "METR", title: "Early 2025 AI Experienced OS Dev Study", url: "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/", note: "Randomised controlled trial: AI made experienced devs 19% slower while they felt 20% faster" },
      { author: "Anthropic Research", title: "Labour Market Impacts of AI", url: "https://www.anthropic.com/research/labor-market-impacts", note: "Observed exposure data; 14% drop in young worker job starts in AI-exposed occupations" },
      { author: "Ethan Mollick", title: "One Useful Thing Newsletter", url: "https://www.oneusefulthing.org/", note: "Ongoing empirical research on AI and learning, skill formation, and work" }
    ]
  },
  "jevons": {
    name: "Jevons Intensity",
    emoji: "⚖️",
    subtitle: "Whether AI efficiency gains translate into relief — or into an expectation of more output, more scope, more work.",
    description: "William Stanley Jevons observed in 1865 that more efficient steam engines didn't reduce coal consumption. They made coal-powered activity so economically attractive that total consumption rose. The paradox named after him has replicated across every efficiency technology since: cheaper computation led to more computation, not less; faster internet led to more content, not less; email led to more correspondence, not less.\n\nThe question for AI is whether it breaks this pattern or exemplifies it at scale. The HBR research into AI in the workplace says the latter: AI doesn't reduce work, it intensifies it. The time saved by automating a task is immediately filled by expanded scope, new stakeholder expectations, and work that previously wasn't attempted because it seemed too expensive.\n\nThere is one genuine escape hatch. Anthropic's internal data suggests roughly 27% of Claude-assisted work consists of tasks that wouldn't have been attempted at all without AI — new experiments, exploratory tooling, creative work that wasn't previously economically viable. Whether that leads to flourishing or to a new baseline of expected output depends entirely on who captures the benefit.",
    levels: {
      low: { label: "Genuine breathing room", desc: "The efficiency gains are real and some fraction lands as actual reduced pressure. Scope is renegotiated downward. Teams ship more with the same hours rather than shipping the same with half the team." },
      mid: { label: "Jevons in slow motion", desc: "Expectations creep upward but manageably. People are doing more, but they chose to. The burnout is there but distributed." },
      high: { label: "Full Jevons", desc: "Every hour saved by AI is immediately claimed by an expanded remit. The engineer who could previously \"only\" do X now has no excuse not to do X, Y, and Z. Burnout metrics rise in parallel with productivity metrics. People are working more than before AI arrived, not less. The agents didn't free anyone — they raised the floor of what counts as sufficient." }
    },
    links: [
      { author: "Aruna Ranganathan & Xingqi Maggie Ye / HBR", title: "AI Doesn't Reduce Work — It Intensifies It", url: "https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it", note: "The empirical case for Jevons in knowledge work" },
      { author: "Wikipedia", title: "Jevons Paradox", url: "https://en.wikipedia.org/wiki/Jevons_paradox", note: "The original paradox and its history across technologies" },
      { author: "Andrew Chen", title: "In a World of Agents, the Product Role Is the Product", url: "https://www.linkedin.com/posts/andrewchen_in-a-world-of-agents-the-product-role-is-share-7439846673121685504-C35K/", note: "The doubling of management load in the agent era" },
      { author: "Daron Acemoglu", title: "The Simple Macroeconomics of AI", url: "https://www.nber.org/papers/w32487", note: "Sceptical economic analysis of AI productivity claims; argues efficiency gains are narrower than assumed" },
      { author: "Faros AI", title: "The AI Productivity Paradox Report", url: "https://www.faros.ai/ai-productivity-paradox", note: "Telemetry from 10,000 developers: teams complete 21% more tasks but PR review time rises 91%" }
    ]
  },
  "roles": {
    name: "Role Dissolution",
    emoji: "🎭",
    subtitle: "Whether the distinct professional identities of PM, designer, and engineer converge, fragment, or simply collapse into something unrecognisable.",
    description: "For twenty years, the digital industry has operated on a stable (if sometimes contested) trinity: someone decides what to build, someone designs how it should feel, someone builds it. These roles have had their turf wars, their status hierarchies, their \"should designers code?\" debates. But the basic structure has held.\n\nAI is stressing every joint in that structure simultaneously. When agents write the code, design and planning become the bottleneck. Shapiro's Level 4 observation is pointed: engineers become PMs whether they like it or not — writing specs, arguing with AI about specs, leaving for 12 hours, checking if the tests passed. Meanwhile Andrew Chen argues that the PM role bifurcates into the human-meaning manager (deciding what matters, why, to whom) and the agent manager (directing orchestrated systems, writing prompts that function as briefs).\n\nWhat replaces the trinity is genuinely unclear. One future has a single operator role — the vibe architect, directing agents across all three domains in natural language. Another has the three roles holding but becoming more senior on average. A third has a hard split between meaning-layer humans and systems-layer humans, with traditional labels becoming historical artefacts.",
    levels: {
      low: { label: "The trinity holds", desc: "Roles become more specialised under AI pressure, not less. The PM who can't think clearly about strategy gets displaced; the one who can becomes more essential. Same for design, same for engineering. The boundaries sharpen rather than blur." },
      mid: { label: "Blurring at the edges", desc: "Cross-functional individuals become common and celebrated. Full-stack is a given; full-discipline is the new ambition. Role titles start to look like they were written for a different era but organisations maintain the structure because human coordination still requires it." },
      high: { label: "Dissolution or hard bifurcation", desc: "Either the roles merge into something the industry doesn't have a name for yet, or they fracture into two camps — those who set direction for AI and those who maintain the systems that run it — with very little in the middle that resembles any current job description." }
    },
    links: [
      { author: "Andrew Chen", title: "In a World of Agents, the Product Role Is the Product", url: "https://www.linkedin.com/posts/andrewchen_in-a-world-of-agents-the-product-role-is-share-7439846673121685504-C35K/", note: "Agent management as a new dimension of the PM role" },
      { author: "Maggie Appleton", title: "Gas Town's Agent Patterns, Design Bottlenecks, and Vibecoding at Scale", url: "https://maggieappleton.com/gastown", note: "Design as the new critical path; why judgment in design is non-automatable" },
      { author: "Dan Shapiro", title: "The Five Levels: From Spicy Autocomplete to the Dark Factory", url: "https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/", note: "Level 4 as involuntary PM conversion" },
      { author: "Lenny Rachitsky", title: "What Will Product Management Look Like in the Future?", url: "https://www.lennysnewsletter.com/p/the-future-of-product-management", note: "Product management in the AI era, from a practitioner perspective" },
      { author: "Simon Willison", title: "Everything I Know About LLMs", url: "https://simonwillison.net/2023/Aug/3/weird-world-of-llms/", note: "How the technical shift changes what expertise means in software" }
    ]
  },
  "memory": {
    name: "Institutional Memory Integrity",
    emoji: "📜",
    subtitle: "How successfully the tacit knowledge of how systems actually work — and why — survives as the people who carried it are no longer hired.",
    description: "Every codebase is two things simultaneously: the code itself, and the accumulated understanding of why the code is the way it is. The second thing rarely gets written down. It lives in the heads of engineers who have debugged the production incident at 3am, who have seen the edge case that broke everything in 2019, who know which conditional was added for a client that no longer exists but whose data still does.\n\nJunior engineers didn't just write boilerplate — they absorbed this context by proximity. They asked questions. They read old pull requests. They inherited institutional knowledge through osmosis. The Missing Rungs piece makes the structural case with the AWS examples: the Kiro incident (an agent deleting and recreating an entire environment because it lacked the battle-hardened intuition that this is never the right answer) and the engineer following AI advice synthesised from an outdated wiki, with no experience to recognise it as stale. Neither was caused by AI incapability. Both were caused by absent context.\n\nThe 26,000-line codified context repository — more instructions than code — is the most radical proposed solution. It represents institutional knowledge made explicit so agents can use it. It also requires someone with enough existing knowledge to know what to codify. Which is the problem.",
    levels: {
      low: { label: "Context as infrastructure takes hold", desc: "Organisations treat CLAUDE.md files, architectural decision records, and memory hierarchies as first-class engineering artefacts. The tacit becomes explicit. Onboarding documents are written by and for humans and agents simultaneously. The knowledge survives the generational transition." },
      mid: { label: "Partial and uneven", desc: "Some organisations get the codification right. Most accumulate silent institutional amnesia — systems that work, but that nobody fully understands anymore, including the agents operating them. Technical debt acquires a new dimension: context debt." },
      high: { label: "Critical deficit, systemic", desc: "The people who could have codified institutional knowledge were not hired into the organisations that needed them. The systems run on vibes and automated tests, until they don't. The AWS incidents are not anomalies — they are the pattern." }
    },
    links: [
      { author: "John Salvatier", title: "Reality Has a Surprising Amount of Detail", url: "http://johnsalvatier.org/blog/2017/reality-has-a-surprising-amount-of-detail", note: "The philosophical case for why tacit knowledge cannot be shortcut or summarised away" },
      { author: "Alasdair Allan / Negroni Venture Studios", title: "The Ladder is Missing Rungs", url: "https://negroniventurestudios.com/2026/03/19/the-ladder-is-missing-rungs/", note: "The AWS Kiro case studies; context engineering as the new critical skill" },
      { author: "Anthropic Engineering", title: "Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", note: "How persistent task tracking and context management work in production agent systems" },
      { author: "GitClear", title: "AI Copilot Code Quality Analysis", url: "https://gitclear-public.s3.us-west-2.amazonaws.com/GitClear-AI-Copilot-Code-Quality-2025.pdf", note: "211 million lines of code analysed: AI increased volume by 10%, collapsed refactoring by 60%, raised code churn by 44%" },
      { author: "Simon Willison", title: "Context Is All You Need... And All You Have", url: "https://simonwillison.net", note: "Ongoing writing on context engineering, prompt architecture, and the limits of what agents can infer" },
      { author: "Chroma Research", title: "Context Rot", url: "https://research.trychroma.com/context-rot", note: "How context quality degrades over long agent sessions — the structural problem that institutional memory addresses" }
    ]
  },
};

const REACTIONS = {
  "The Hermit": ["Mmm. Cautious. Very cautious.", "Still holding the lantern yourself. Interesting.", "The machines wait. You are not ready. Or perhaps… wise.", "Slow. Deliberate. The tortoise energy is strong here.", "You have not yet let go of the work. I respect this."],
  "The Chariot": ["Moving. But where, exactly?", "Fast. Perhaps too fast. The sphinxes are not coordinated.", "Someone is driving. Probably.", "Velocity without destination is just falling sideways.", "The horses pull in different directions. As horses do."],
  "The Tower": ["Oh.", "OH.", "*a long, slow exhale*", "Well. That happened.", "The lightning does not ask permission.", "I have seen this before. Not often, but I have seen it."],
  "The High Priestess": ["Good. Someone in the room still knows things.", "Wisdom. Rare. Increasingly rare. But present.", "The old knowledge survives. For now.", "She knows what she knows. And crucially, what she doesn't.", "Mmm. This is encouraging. I did not expect encouraging."],
  "The Moon": ["Things are not quite as they appear.", "Someone is guessing. Confidently.", "Murky. Very murky. But not yet dark.", "The path is lit. Barely.", "I sense certainty in places that deserve doubt."],
  "The Fool": ["...I see.", "The cliff is right there. He cannot see the cliff.", "So young. So confident. So many open pull requests.", "The dog is barking. Nobody asks why the dog is barking.", "*the crystal ball fogs over slightly*", "Ah. The vibes are immaculate. The judgment is not."],
  "The Star": ["Oh, this is nice. This does not happen often.", "Rest. Actual rest. The cards rarely show this.", "Breathing room! It exists! I had forgotten.", "Someone went home on time. Extraordinary.", "The machines give back. For once, they give back."],
  "The Wheel of Fortune": ["Could go either way. The wheel is noncommittal today.", "Some will be fine. Others will not. The wheel decides.", "Fate shrugs. This is a shrugging card.", "Depends. On many things. The cards do not specify.", "The wheel spins. As wheels are known to do."],
  "The Devil": ["Ah.", "Still working, I see.", "The chains look comfortable. That is the problem.", "More output. Always more output. The cards have seen this before.", "The laptop never closes. I have foreseen this.", "You are free to leave at any time. And yet."],
  "The Emperor": ["Structure. Order. Things in their correct places.", "The org chart survives. Against all odds.", "PM is PM. Engineer is engineer. As it was written.", "Stability. Perhaps boring. But stable.", "The hierarchy endures. I am as surprised as you are."],
  "The Lovers": ["Everyone is becoming everyone else. Gradually.", "A PM who codes. A designer who also codes. A world of coders.", "The lines blur. Lovingly, but they blur.", "Cross-functional. Whether they requested this or not.", "Identity is… flexible right now. The cards find this interesting."],
  "The World": ["The old job titles have left the building.", "What is a PM? What is a designer? The cards do not know anymore.", "Everything is everything now. This is either liberation or chaos.", "Completion. Or dissolution. Genuinely hard to tell from here.", "A new form arrives. It does not have a name yet."],
  "The Hierophant": ["Someone wrote it down. Bless them.", "The knowledge survives. The wiki is accurate. This is rare.", "The old ways, preserved. Someone took the time.", "The documentation is correct. I am briefly emotional.", "They updated the CLAUDE.md. All is not lost."],
  "The Hanged Man": ["Suspended. Neither lost nor found.", "Some things are written down. Others… less so.", "The context is partial. This is better than nothing. Barely.", "Not lost. Just… misplaced. Somewhere in Confluence.", "Waiting for clarity that the crystal ball is also waiting for."],
  "Death": ["Do not panic.", "Do not panic. Probably.", "The wiki is wrong. All of it. Nobody knows this yet.", "The knowledge has left the building. With the people who held it.", "Something ends. Something begins. The cards are vague on what.", "I have seen this before. It is called a production incident."],
};


// =================== COMPONENTS ===================

function StyleTag(){return <style dangerouslySetInnerHTML={{__html:STYLES}}/>}

function Candle(){
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div className="flame" style={{width:8,height:14,background:'radial-gradient(ellipse at 50% 80%,#ff8000,#ffc000 50%,transparent)',borderRadius:'50% 50% 20% 20%',marginBottom:-1}}/>
      <div style={{width:3,height:6,background:'#e8d5a3',margin:'0 auto'}}/>
      <div style={{width:12,height:48,background:'linear-gradient(180deg,#d4c090,#b8a070)',borderRadius:'2px 2px 1px 1px'}}/>
      <div style={{width:14,height:3,background:'#8a7050',borderRadius:1}}/>
    </div>
  );
}
function CandleTall(){
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div className="flame-tall" style={{width:6,height:18,background:'radial-gradient(ellipse at 50% 85%,#ff9000,#ffcc00 45%,transparent)',borderRadius:'50% 50% 15% 15%',marginBottom:-1}}/>
      <div style={{width:2,height:7,background:'#d8c890',margin:'0 auto'}}/>
      <div style={{width:8,height:72,background:'linear-gradient(180deg,#e8d8a8,#c4a868,#a08040)',borderRadius:'2px 2px 1px 1px'}}/>
      <div style={{width:10,height:4,background:'#7a6038',borderRadius:1}}/>
    </div>
  );
}
function CandleFat(){
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div className="flame-fat" style={{width:11,height:12,background:'radial-gradient(ellipse at 50% 75%,#ff6000,#ffaa00 55%,transparent)',borderRadius:'50% 50% 25% 25%',marginBottom:-1}}/>
      <div style={{width:3,height:5,background:'#ddd0a0',margin:'0 auto'}}/>
      <div style={{width:20,height:36,background:'linear-gradient(180deg,#f0e0b0,#d0b870,#b89040)',borderRadius:'3px 3px 2px 2px'}}/>
      <div style={{width:22,height:5,background:'#8a6828',borderRadius:2}}/>
    </div>
  );
}
function Candelabra(){
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',position:'relative',width:52}}>
      {/* Three flames */}
      <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:0}}>
        {[0,1,2].map(i=>(
          <div key={i} className="flame" style={{width:6,height:11,background:'radial-gradient(ellipse at 50% 80%,#ff7000,#ffbb00 50%,transparent)',borderRadius:'50% 50% 20% 20%',animationDelay:`${i*0.2}s`}}/>
        ))}
      </div>
      {/* Three wicks */}
      <div style={{display:'flex',gap:10,justifyContent:'center'}}>
        {[0,1,2].map(i=><div key={i} style={{width:2,height:4,background:'#c8b870'}}/>)}
      </div>
      {/* Arms */}
      <div style={{width:44,height:4,background:'linear-gradient(180deg,#b89040,#8a6020)',borderRadius:1,marginTop:-1}}/>
      {/* Center stem */}
      <div style={{width:4,height:28,background:'linear-gradient(180deg,#c8a040,#8a6020)',borderRadius:1}}/>
      {/* Base */}
      <div style={{width:28,height:5,background:'linear-gradient(180deg,#c8a040,#7a5010)',borderRadius:'1px 1px 3px 3px',boxShadow:'0 2px 4px rgba(0,0,0,.5)'}}/>
    </div>
  );
}

function CrystalPodium({active}){
  // Sparkle positions [sx, sy, delay, size]
  const sparks=[[0,-52,.0,4],[28,-42,.3,3],[-32,-38,.6,4],[38,-18,.9,3],[-40,-10,1.2,5],[36,14,1.5,3],[-34,20,1.8,4],[12,-56,2.1,3],[-16,-54,2.4,4],[44,0,0.5,3],[-44,4,1.0,4]];
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
      {/* Sparkles — pre-positioned around the ball */}
      {active&&sparks.map(([sx,sy,d,sz],i)=>(
        <div key={i} style={{
          position:'absolute',
          top:`calc(50% + ${sy}px)`,
          left:`calc(50% + ${sx}px)`,
          width:sz,height:sz,
          background:'#e8d060',borderRadius:'50%',
          boxShadow:'0 0 4px #ffee80',
          pointerEvents:'none',
          animation:`sparkleOrbit 1.8s ${d}s steps(5) infinite`,
          zIndex:20,
        }}/>
      ))}
      {/* Crystal ball */}
      <div className={active?'ball-live':'ball-idle'} style={{width:76,height:76,borderRadius:'50%',position:'relative',overflow:'hidden',
        background:'radial-gradient(circle at 32% 28%,rgba(220,200,255,.55),rgba(100,50,180,.85) 55%,rgba(18,6,38,.98))',
        border:'2px solid rgba(160,100,220,.55)',flexShrink:0,zIndex:5}}>
        {/* Inner swirling mist */}
        <div style={{position:'absolute',inset:-8,borderRadius:'50%',
          background:'conic-gradient(from 0deg,transparent 0%,rgba(140,80,220,.25) 20%,transparent 40%,rgba(180,120,255,.2) 60%,transparent 80%)',
          animation:'ballSwirl 6s linear infinite',zIndex:1}}/>
        <div style={{position:'absolute',inset:4,borderRadius:'50%',
          background:'radial-gradient(circle at 60% 65%,rgba(80,20,160,.5),transparent 70%)',
          animation:'ballMist 3s steps(6) infinite',zIndex:2}}/>
        {/* Highlight */}
        <div style={{position:'absolute',top:'14%',left:'18%',width:'34%',height:'20%',background:'rgba(255,255,255,.22)',borderRadius:'50%',transform:'rotate(-22deg)',zIndex:3}}/>
        <div style={{position:'absolute',top:'24%',left:'58%',width:'14%',height:'10%',background:'rgba(255,255,255,.12)',borderRadius:'50%',zIndex:3}}/>
      </div>
      {/* Podium stem */}
      <div style={{width:16,height:18,background:'linear-gradient(180deg,#b89040 0%,#7a5010 100%)',clipPath:'polygon(20% 0%,80% 0%,100% 100%,0% 100%)',marginTop:-1}}/>
      {/* Podium base tier 1 */}
      <div style={{width:44,height:7,background:'linear-gradient(180deg,#c8a040,#8a6018)',borderRadius:'2px 2px 0 0',boxShadow:'0 2px 6px rgba(0,0,0,.5)'}}>
        {/* Engraving lines */}
        <div style={{height:2,background:'rgba(255,220,80,.25)',margin:'2px 4px'}}/>
      </div>
      {/* Podium base tier 2 */}
      <div style={{width:56,height:6,background:'linear-gradient(180deg,#a08020,#6a4810)',borderRadius:'1px 1px 2px 2px',boxShadow:'0 3px 8px rgba(0,0,0,.6)'}}/>
    </div>
  );
}

function SeanceMaster({state,reaction,bubbleKey}){
  const cls=state==='react'?'master-react':'master-idle';
  const R=state==='react';
  const S0='#d4a06a'; const S1='#b87840'; const S2='#e8c090';
  const R0='#2e1260'; const R1='#3e1e7a'; const R2='#1a0840'; // lightened + more saturated
  const G0='#c8941a'; const G1='#e8b83a'; const G2='#8a6010';
  const C0='#3a1e60'; // lightened collar
  const H0='#140a2c';
  return(
    <div style={{position:'relative',userSelect:'none',display:'inline-block'}}>
      {/* Speech bubble — floats upper-right, notch points left toward head */}
      {reaction&&(
        <div key={bubbleKey} className="bubble-in fell" style={{
          position:'absolute',top:-8,left:'110%',
          background:'#100c20',border:`1px solid ${G0}`,padding:'6px 12px',
          width:220,fontStyle:'italic',fontSize:12,color:'#e8d5a3',lineHeight:1.45,
          zIndex:20,transformOrigin:'left center',whiteSpace:'normal',
        }}>
          {reaction}
          {/* Left-pointing notch */}
          <div style={{position:'absolute',top:18,left:-8,width:0,height:0,
            borderTop:'7px solid transparent',borderBottom:'7px solid transparent',
            borderRight:`8px solid ${G0}`}}/>
          <div style={{position:'absolute',top:19,left:-6,width:0,height:0,
            borderTop:'6px solid transparent',borderBottom:'6px solid transparent',
            borderRight:'7px solid #100c20'}}/>
        </div>
      )}

      {/* ── PIXEL ART FIGURE (upper body only — table clips waist) ── */}
      <div className={cls} style={{position:'relative',width:120,height:170,imageRendering:'pixelated'}}>

        {/* ── BURGUNDY BACKDROP BEHIND FIGURE ── */}
        {/* (rendered in SeanceScene as separate layer; nothing here) */}

        {/* ── HOOD outer ── 4px pixel steps */}
        <div style={{position:'absolute',top:0,left:14,width:92,height:44,background:R0,borderRadius:'48% 48% 0 0',zIndex:2}}/>
        {/* Hood deep inner dark */}
        <div style={{position:'absolute',top:4,left:20,width:80,height:36,background:H0,borderRadius:'48% 48% 0 0',zIndex:3}}/>
        {/* Hood rim pixel highlight — gold line */}
        <div style={{position:'absolute',top:4,left:20,width:80,height:3,background:`linear-gradient(90deg,transparent,${G2},${G0},${G2},transparent)`,borderRadius:1,zIndex:8}}/>
        {/* Hood shoulder drape left */}
        <div style={{position:'absolute',top:40,left:0,width:36,height:28,background:R0,borderRadius:'0 0 40% 20%',zIndex:2}}/>
        {/* Hood shoulder drape right */}
        <div style={{position:'absolute',top:40,right:0,width:36,height:28,background:R0,borderRadius:'0 0 20% 40%',zIndex:2}}/>

        {/* ── HAIR (wisps at hood edges) ── */}
        <div style={{position:'absolute',top:16,left:16,width:10,height:24,background:'#0c0418',borderRadius:'50% 20% 30% 50%',zIndex:4}}/>
        <div style={{position:'absolute',top:20,left:12,width:8,height:16,background:'#160630',borderRadius:'30% 50% 50% 30%',zIndex:4}}/>
        <div style={{position:'absolute',top:16,right:16,width:10,height:24,background:'#0c0418',borderRadius:'20% 50% 50% 30%',zIndex:4}}/>
        <div style={{position:'absolute',top:20,right:12,width:8,height:16,background:'#160630',borderRadius:'50% 30% 30% 50%',zIndex:4}}/>

        {/* ── FACE ── pixel art: sharp blocks */}
        {/* Face base */}
        <div style={{position:'absolute',top:14,left:26,width:68,height:58,background:S0,zIndex:5,
          clipPath:'polygon(8% 0%,92% 0%,100% 20%,100% 80%,92% 100%,8% 100%,0% 80%,0% 20%)'}}>
          {/* Forehead shadow from hood */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:12,background:`linear-gradient(180deg,${S1}88,transparent)`}}/>
          {/* Cheek shadows */}
          <div style={{position:'absolute',top:'50%',left:0,width:8,height:16,background:S1,opacity:.5,borderRadius:'0 4px 4px 0'}}/>
          <div style={{position:'absolute',top:'50%',right:0,width:8,height:16,background:S1,opacity:.5,borderRadius:'4px 0 0 4px'}}/>
          {/* ── EYEBROWS ── 4px tall rectangles */}
          <div style={{position:'absolute',top:10,left:8,width:20,height:4,background:'#1c0828',transform:'rotate(-5deg)',borderRadius:'2px 1px 1px 2px'}}/>
          <div style={{position:'absolute',top:10,right:8,width:20,height:4,background:'#1c0828',transform:'rotate(5deg)',borderRadius:'1px 2px 2px 1px'}}/>
          {/* ── LEFT EYE ── white + iris + pupil + glint */}
          <div style={{position:'absolute',top:18,left:7,width:20,height:13,background:'#f4ede0',borderRadius:2,overflow:'hidden'}}>
            <div style={{position:'absolute',top:1,left:4,width:12,height:11,background:'#5030a0',borderRadius:1}}>
              <div style={{position:'absolute',top:1,left:2,width:8,height:8,background:'#100820'}}/>
              <div style={{position:'absolute',top:1,right:1,width:3,height:3,background:'rgba(255,255,255,.7)',borderRadius:'50%'}}/>
            </div>
            {/* Top eyelid */}
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'rgba(20,8,32,.55)'}}/>
            {/* Lash dots */}
            {[2,6,10,14,18].map(x=><div key={x} style={{position:'absolute',top:0,left:x,width:2,height:2,background:'#1c0828'}}/>)}
          </div>
          {/* ── RIGHT EYE ── */}
          <div style={{position:'absolute',top:18,right:7,width:20,height:13,background:'#f4ede0',borderRadius:2,overflow:'hidden'}}>
            <div style={{position:'absolute',top:1,left:4,width:12,height:11,background:'#5030a0',borderRadius:1}}>
              <div style={{position:'absolute',top:1,left:2,width:8,height:8,background:'#100820'}}/>
              <div style={{position:'absolute',top:1,right:1,width:3,height:3,background:'rgba(255,255,255,.7)',borderRadius:'50%'}}/>
            </div>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'rgba(20,8,32,.55)'}}/>
            {[2,6,10,14,18].map(x=><div key={x} style={{position:'absolute',top:0,left:x,width:2,height:2,background:'#1c0828'}}/>)}
          </div>
          {/* ── NOSE ── pixel block */}
          <div style={{position:'absolute',top:32,left:'50%',transform:'translateX(-50%)',width:12,height:10}}>
            <div style={{position:'absolute',bottom:0,left:0,width:4,height:4,background:S1,borderRadius:'50%',opacity:.6}}/>
            <div style={{position:'absolute',bottom:0,right:0,width:4,height:4,background:S1,borderRadius:'50%',opacity:.6}}/>
            <div style={{position:'absolute',top:0,left:4,width:4,height:8,background:S1,opacity:.3}}/>
          </div>
          {/* ── LIPS ── */}
          {/* Upper lip */}
          <div style={{position:'absolute',bottom:R?15:12,left:18,width:32,height:R?4:5,background:'#7a3828',borderRadius:R?'1px 1px 0 0':'50% 50% 20% 20%'}}/>
          {/* Lower lip */}
          <div style={{position:'absolute',bottom:R?9:7,left:20,width:28,height:R?7:6,background:'#a04838',borderRadius:R?'0 0 50% 50%':'30% 30% 55% 55%'}}/>
          {/* Lip highlight */}
          <div style={{position:'absolute',bottom:R?12:8,left:26,width:10,height:2,background:'rgba(220,140,100,.4)',borderRadius:1}}/>
        </div>

        {/* ── NECK ── */}
        <div style={{position:'absolute',top:68,left:42,width:36,height:16,background:S0,zIndex:4}}>
          <div style={{position:'absolute',right:0,top:0,width:6,height:'100%',background:S1,opacity:.4}}/>
        </div>

        {/* ── INNER BODICE ── */}
        <div style={{position:'absolute',top:80,left:32,width:56,height:90,background:R2,zIndex:3,
          clipPath:'polygon(20% 0%,80% 0%,100% 100%,0% 100%)'}}/>

        {/* ── OUTER ROBE ── */}
        <div style={{position:'absolute',top:76,left:4,width:112,height:94,background:R0,zIndex:4,
          clipPath:'polygon(12% 0%,88% 0%,100% 100%,0% 100%)'}}>
          {/* Robe pixel fold lines */}
          <div style={{position:'absolute',top:0,left:'20%',width:4,height:'100%',background:'rgba(0,0,0,.3)'}}/>
          <div style={{position:'absolute',top:0,left:'44%',width:4,height:'100%',background:'rgba(0,0,0,.25)'}}/>
          <div style={{position:'absolute',top:0,left:'68%',width:4,height:'100%',background:'rgba(0,0,0,.3)'}}/>
          {/* Robe highlight folds */}
          <div style={{position:'absolute',top:0,left:'32%',width:2,height:'70%',background:R1}}/>
          <div style={{position:'absolute',top:0,left:'56%',width:2,height:'60%',background:R1}}/>
        </div>

        {/* ── COLLAR ── */}
        <div style={{position:'absolute',top:76,left:28,width:64,height:20,background:C0,zIndex:5,
          clipPath:'polygon(16% 0%,84% 0%,100% 100%,0% 100%)'}}>
          {/* Gold embroidery — pixel squares */}
          {[6,14,22,30,38,46,54].map(x=>(
            <div key={x} style={{position:'absolute',top:7,left:x,width:4,height:4,background:G0,opacity:.8}}/>
          ))}
        </div>
        {/* Collar top gold line */}
        <div style={{position:'absolute',top:76,left:28,width:64,height:2,background:`linear-gradient(90deg,transparent,${G0},${G1},${G0},transparent)`,zIndex:6}}/>
        {/* Collar bottom gold line */}
        <div style={{position:'absolute',top:94,left:36,width:48,height:2,background:`linear-gradient(90deg,transparent,${G2},${G0},${G2},transparent)`,zIndex:6}}/>

        {/* ── AMULET / PENDANT ── */}
        <div style={{position:'absolute',top:97,left:50,zIndex:7}}>
          {/* Chain */}
          <div style={{width:2,height:10,background:`linear-gradient(180deg,transparent,${G2})`,margin:'0 auto'}}/>
          {/* Outer ring */}
          <div style={{width:20,height:20,border:`2px solid ${G0}`,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#4a1880,#180840)',
            boxShadow:`0 0 8px ${G0}60`,position:'relative'}}>
            {/* Inner gem */}
            <div style={{position:'absolute',top:4,left:4,width:8,height:8,background:'radial-gradient(circle,#a060ff,#4020a0)',borderRadius:'50%'}}/>
            <div style={{position:'absolute',top:5,left:5,width:3,height:3,background:'rgba(255,255,255,.5)',borderRadius:'50%'}}/>
          </div>
        </div>

        {/* ── SLEEVES ── */}
        {/* Left sleeve outer */}
        <div style={{position:'absolute',top:104,left:-12,width:48,height:20,background:R0,zIndex:5,
          borderRadius:'4px 0 0 6px',transform:'rotate(16deg)',transformOrigin:'right top'}}>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:4,background:`linear-gradient(90deg,transparent,${G2}60,transparent)`}}/>
        </div>
        {/* Left sleeve inner shadow */}
        <div style={{position:'absolute',top:104,left:-12,width:48,height:8,background:R2,zIndex:5,
          borderRadius:'4px 0 0 0',transform:'rotate(16deg)',transformOrigin:'right top'}}/>
        {/* Right sleeve outer */}
        <div style={{position:'absolute',top:104,right:-12,width:48,height:20,background:R0,zIndex:5,
          borderRadius:'0 4px 6px 0',transform:'rotate(-16deg)',transformOrigin:'left top'}}>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:4,background:`linear-gradient(90deg,transparent,${G2}60,transparent)`}}/>
        </div>
        {/* Right sleeve inner shadow */}
        <div style={{position:'absolute',top:104,right:-12,width:48,height:8,background:R2,zIndex:5,
          borderRadius:'0 4px 0 0',transform:'rotate(-16deg)',transformOrigin:'left top'}}/>

        {/* ── HANDS (resting forward, flanking where ball sits) ── */}
        {/* Left hand */}
        <div style={{position:'absolute',bottom:2,left:-10,width:32,height:16,background:S0,zIndex:6,
          borderRadius:'3px 8px 6px 4px',transform:'rotate(-6deg)'}}>
          {/* Knuckle pixels */}
          {[4,10,16,22].map(x=><div key={x} style={{position:'absolute',top:2,left:x,width:4,height:4,background:S1,borderRadius:1}}/>)}
          {/* Ring */}
          <div style={{position:'absolute',top:0,left:16,width:4,height:6,border:`1px solid ${G1}`,borderRadius:1,background:'rgba(200,148,26,.2)'}}/>
        </div>
        {/* Right hand */}
        <div style={{position:'absolute',bottom:2,right:-10,width:32,height:16,background:S0,zIndex:6,
          borderRadius:'8px 3px 4px 6px',transform:'rotate(6deg)'}}>
          {[4,10,16,22].map(x=><div key={x} style={{position:'absolute',top:2,left:x,width:4,height:4,background:S1,borderRadius:1}}/>)}
          <div style={{position:'absolute',top:0,right:14,width:4,height:6,border:`1px solid ${G1}`,borderRadius:1,background:'rgba(200,148,26,.2)'}}/>
        </div>

      </div>
    </div>
  );
}

function Bubble({text}){
  if(!text)return <div style={{height:68}}/>;
  return(
    <div className="pop fell" style={{background:'#100c20',border:'1px solid #c8941a',padding:'10px 16px',maxWidth:340,margin:'0 auto',fontStyle:'italic',fontSize:15,color:'#e8d5a3',lineHeight:1.55,position:'relative'}}>
      {text}
      <div style={{position:'absolute',bottom:-9,left:24,width:0,height:0,borderLeft:'8px solid transparent',borderRight:'8px solid transparent',borderTop:'9px solid #c8941a'}}/>
    </div>
  );
}

function CrystalBall({active}){
  return(
    <div className={active?'ball-live':'ball-idle'} style={{width:80,height:80,borderRadius:'50%',background:'radial-gradient(circle at 35% 32%,rgba(210,185,255,.45),rgba(90,45,150,.82) 58%,rgba(18,8,38,.97))',border:'2px solid rgba(140,80,200,.5)',position:'relative',flexShrink:0}}>
      <div style={{position:'absolute',top:'18%',left:'20%',width:'32%',height:'18%',background:'rgba(255,255,255,.18)',borderRadius:'50%',transform:'rotate(-22deg)'}}/>
      <div style={{position:'absolute',top:'28%',left:'55%',width:'14%',height:'10%',background:'rgba(255,255,255,.1)',borderRadius:'50%'}}/>
    </div>
  );
}




function CardArt({name}){
  const svgP={viewBox:"0 0 88 148",width:"88",height:"148",shapeRendering:"crispEdges"};
  const Bdr=()=><rect x={1} y={1} width={86} height={146} fill="none" stroke="#c8941a" strokeWidth={1.5} opacity={0.7}/>;
  switch(name){

  case "The Hermit": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#0c0a22" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={60} fill="#080614" shapeRendering="crispEdges"/>,
      <rect key={"p4,4"} x={4} y={4} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p10,2"} x={10} y={2} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p18,6"} x={18} y={6} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p26,3"} x={26} y={3} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p34,7"} x={34} y={7} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p42,2"} x={42} y={2} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p50,5"} x={50} y={5} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p58,3"} x={58} y={3} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p66,6"} x={66} y={6} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p74,3"} x={74} y={3} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p80,7"} x={80} y={7} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p8,12"} x={8} y={12} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p22,9"} x={22} y={9} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p44,11"} x={44} y={11} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p62,8"} x={62} y={8} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p78,10"} x={78} y={10} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"0,60,88"} x={0} y={60} width={88} height={88} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"10,52,68"} x={10} y={52} width={68} height={96} fill="#1e1a2a" shapeRendering="crispEdges"/>,
      <rect key={"18,44,52"} x={18} y={44} width={52} height={104} fill="#16122a" shapeRendering="crispEdges"/>,
      <rect key={"26,36,36"} x={26} y={36} width={36} height={112} fill="#100e20" shapeRendering="crispEdges"/>,
      <rect key={"32,28,24"} x={32} y={28} width={24} height={120} fill="#0c0a1a" shapeRendering="crispEdges"/>,
      <rect key={"36,22,16"} x={36} y={22} width={16} height={126} fill="#0a0818" shapeRendering="crispEdges"/>,
      <rect key={"30,100,28"} x={30} y={100} width={28} height={48} fill="#201810" shapeRendering="crispEdges"/>,
      <rect key={"32,100,3"} x={32} y={100} width={3} height={4} fill="#281e14" shapeRendering="crispEdges"/>,
      <rect key={"34,103,3"} x={34} y={103} width={3} height={4} fill="#281e14" shapeRendering="crispEdges"/>,
      <rect key={"36,106,3"} x={36} y={106} width={3} height={4} fill="#281e14" shapeRendering="crispEdges"/>,
      <rect key={"38,109,3"} x={38} y={109} width={3} height={4} fill="#281e14" shapeRendering="crispEdges"/>,
      <rect key={"40,112,3"} x={40} y={112} width={3} height={4} fill="#281e14" shapeRendering="crispEdges"/>,
      <rect key={"42,115,3"} x={42} y={115} width={3} height={4} fill="#281e14" shapeRendering="crispEdges"/>,
      <rect key={"44,118,3"} x={44} y={118} width={3} height={4} fill="#281e14" shapeRendering="crispEdges"/>,
      <rect key={"46,121,3"} x={46} y={121} width={3} height={4} fill="#281e14" shapeRendering="crispEdges"/>,
      <rect key={"30,30,28"} x={30} y={30} width={28} height={16} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"28,38,32"} x={28} y={38} width={32} height={14} fill="#1e0a38" shapeRendering="crispEdges"/>,
      <rect key={"24,46,40"} x={24} y={46} width={40} height={12} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"22,54,44"} x={22} y={54} width={44} height={10} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"20,60,48"} x={20} y={60} width={48} height={70} fill="#1e0a38" shapeRendering="crispEdges"/>,
      <rect key={"22,62,44"} x={22} y={62} width={44} height={68} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"30,28,28"} x={30} y={28} width={28} height={22} fill="#1e0a38" shapeRendering="crispEdges"/>,
      <rect key={"32,30,24"} x={32} y={30} width={24} height={14} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"34,28,20"} x={34} y={28} width={20} height={8} fill="#16082c" shapeRendering="crispEdges"/>,
      <rect key={"34,32,20"} x={34} y={32} width={20} height={18} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"36,36,16"} x={36} y={36} width={16} height={14} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"38,40,4"} x={38} y={40} width={4} height={3} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"46,40,4"} x={46} y={40} width={4} height={3} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"39,40,2"} x={39} y={40} width={2} height={2} fill="#301860" shapeRendering="crispEdges"/>,
      <rect key={"47,40,2"} x={47} y={40} width={2} height={2} fill="#301860" shapeRendering="crispEdges"/>,
      <rect key={"42,45,4"} x={42} y={45} width={4} height={3} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"36,48,16"} x={36} y={48} width={16} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"38,50,12"} x={38} y={50} width={12} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"36,52,2"} x={36} y={52} width={2} height={3} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"38,52,2"} x={38} y={52} width={2} height={3} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"40,52,2"} x={40} y={52} width={2} height={3} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"42,52,2"} x={42} y={52} width={2} height={3} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"44,52,2"} x={44} y={52} width={2} height={3} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"46,52,2"} x={46} y={52} width={2} height={3} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"48,52,2"} x={48} y={52} width={2} height={3} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"64,18,4"} x={64} y={18} width={4} height={130} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"62,16,8"} x={62} y={16} width={8} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"60,14,12"} x={60} y={14} width={12} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"62,12,8"} x={62} y={12} width={8} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"56,28,14"} x={56} y={28} width={14} height={18} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"58,30,10"} x={58} y={30} width={10} height={14} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"59,31,8"} x={59} y={31} width={8} height={12} fill="#fff880" opacity={0.95} shapeRendering="crispEdges"/>,
      <rect key={"62,24,4"} x={62} y={24} width={4} height={6} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"60,22,8"} x={60} y={22} width={8} height={4} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"50,26,24"} x={50} y={26} width={24} height={26} fill="#f0d040" opacity={0.08} shapeRendering="crispEdges"/>,
      <rect key={"52,28,20"} x={52} y={28} width={20} height={22} fill="#f0d040" opacity={0.06} shapeRendering="crispEdges"/>,
      <rect key={"34,24,16"} x={34} y={24} width={16} height={6} fill="#e8e4d8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"36,22,12"} x={36} y={22} width={12} height={4} fill="#e8e4d8" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v30,56"} x={30} y={56} width={1} height={74} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"v42,56"} x={42} y={56} width={1} height={74} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"v54,56"} x={54} y={56} width={1} height={74} fill="#3c2068" shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Chariot": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#0c0a22" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={50} fill="#0e1040" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={30} fill="#080614" shapeRendering="crispEdges"/>,
      <rect key={"p6,4"} x={6} y={4} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p16,2"} x={16} y={2} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p28,6"} x={28} y={6} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p40,3"} x={40} y={3} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p52,5"} x={52} y={5} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p64,2"} x={64} y={2} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p76,6"} x={76} y={6} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p10,10"} x={10} y={10} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p24,8"} x={24} y={8} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p48,12"} x={48} y={12} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p70,9"} x={70} y={9} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p82,12"} x={82} y={12} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"4,40,8"} x={4} y={40} width={8} height={40} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"14,40,12"} x={14} y={40} width={12} height={40} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"28,40,6"} x={28} y={40} width={6} height={40} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"36,40,10"} x={36} y={40} width={10} height={40} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"48,40,8"} x={48} y={40} width={8} height={40} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"58,40,14"} x={58} y={40} width={14} height={40} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"74,40,10"} x={74} y={40} width={10} height={40} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"6,32,4"} x={6} y={32} width={4} height={12} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"16,32,8"} x={16} y={32} width={8} height={12} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"30,32,2"} x={30} y={32} width={2} height={12} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"38,32,6"} x={38} y={32} width={6} height={12} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"50,32,4"} x={50} y={32} width={4} height={12} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"60,32,10"} x={60} y={32} width={10} height={12} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"76,32,6"} x={76} y={32} width={6} height={12} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"6,6,76"} x={6} y={6} width={76} height={44} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"8,8,72"} x={8} y={8} width={72} height={40} fill="#1a1060" shapeRendering="crispEdges"/>,
      <rect key={"8,8,72"} x={8} y={8} width={72} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"8,46,72"} x={8} y={46} width={72} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"6,8,2"} x={6} y={8} width={2} height={38} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"80,8,2"} x={80} y={8} width={2} height={38} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"p12,14"} x={12} y={14} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p22,10"} x={22} y={10} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p32,14"} x={32} y={14} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p42,10"} x={42} y={10} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p52,14"} x={52} y={14} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p62,10"} x={62} y={10} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p72,14"} x={72} y={14} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p16,22"} x={16} y={22} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p36,22"} x={36} y={22} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p56,22"} x={56} y={22} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"p74,22"} x={74} y={22} width={1} height={1} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"14,48,60"} x={14} y={48} width={60} height={36} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"16,50,56"} x={16} y={50} width={56} height={32} fill="#2a0c58" shapeRendering="crispEdges"/>,
      <rect key={"14,46,60"} x={14} y={46} width={60} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"14,80,60"} x={14} y={80} width={60} height={4} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"20,54,48"} x={20} y={54} width={48} height={24} fill="#1e0a38" shapeRendering="crispEdges"/>,
      <rect key={"22,56,44"} x={22} y={56} width={44} height={20} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"36,60,16"} x={36} y={60} width={16} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"38,58,12"} x={38} y={58} width={12} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"30,62,8"} x={30} y={62} width={8} height={4} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"50,62,8"} x={50} y={62} width={8} height={4} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"34,30,20"} x={34} y={30} width={20} height={16} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"32,26,24"} x={32} y={26} width={24} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"30,24,28"} x={30} y={24} width={28} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"32,22,24"} x={32} y={22} width={24} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"30,46,28"} x={30} y={46} width={28} height={8} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"32,48,24"} x={32} y={48} width={24} height={6} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"38,50,4"} x={38} y={50} width={4} height={4} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"46,50,4"} x={46} y={50} width={4} height={4} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"2,88,26"} x={2} y={88} width={26} height={28} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"4,80,18"} x={4} y={80} width={18} height={12} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"2,78,16"} x={2} y={78} width={16} height={8} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"2,74,12"} x={2} y={74} width={12} height={10} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"4,76,8"} x={4} y={76} width={8} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"4,80,8"} x={4} y={80} width={8} height={8} fill="#f4eed8" shapeRendering="crispEdges"/>,
      <rect key={"5,82,3"} x={5} y={82} width={3} height={3} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"4,78,4"} x={4} y={78} width={4} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"60,88,26"} x={60} y={88} width={26} height={28} fill="#100c18" shapeRendering="crispEdges"/>,
      <rect key={"66,80,18"} x={66} y={80} width={18} height={12} fill="#100c18" shapeRendering="crispEdges"/>,
      <rect key={"72,78,14"} x={72} y={78} width={14} height={8} fill="#100c18" shapeRendering="crispEdges"/>,
      <rect key={"74,74,12"} x={74} y={74} width={12} height={10} fill="#1c1018" shapeRendering="crispEdges"/>,
      <rect key={"72,80,8"} x={72} y={80} width={8} height={8} fill="#201418" shapeRendering="crispEdges"/>,
      <rect key={"77,82,3"} x={77} y={82} width={3} height={3} fill="#cc2010" shapeRendering="crispEdges"/>,
      <rect key={"h90,28"} x={28} y={90} width={34} height={1} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"h94,28"} x={28} y={94} width={34} height={1} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"h98,28"} x={28} y={98} width={34} height={1} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"h102,28"} x={28} y={102} width={34} height={1} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"2,98,20"} x={2} y={98} width={20} height={28} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"4,100,16"} x={4} y={100} width={16} height={24} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"6,102,12"} x={6} y={102} width={12} height={20} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"v12,98"} x={12} y={98} width={1} height={28} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"h112,2"} x={2} y={112} width={20} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"v2,105"} x={2} y={105} width={1} height={16} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"v22,105"} x={22} y={105} width={1} height={16} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"6,108,12"} x={6} y={108} width={12} height={8} fill="#7a5010" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"66,98,20"} x={66} y={98} width={20} height={28} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"68,100,16"} x={68} y={100} width={16} height={24} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"70,102,12"} x={70} y={102} width={12} height={20} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"v76,98"} x={76} y={98} width={1} height={28} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"h112,66"} x={66} y={112} width={20} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"v66,105"} x={66} y={105} width={1} height={16} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"v86,105"} x={86} y={105} width={1} height={16} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"70,108,12"} x={70} y={108} width={12} height={8} fill="#7a5010" opacity={0.3} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Tower": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={80} fill="#0c0418" shapeRendering="crispEdges"/>,
      <rect key={"0,6,40"} x={0} y={6} width={40} height={16} fill="#1c1030" shapeRendering="crispEdges"/>,
      <rect key={"16,4,36"} x={16} y={4} width={36} height={18} fill="#281440" shapeRendering="crispEdges"/>,
      <rect key={"44,8,28"} x={44} y={8} width={28} height={14} fill="#1c1030" shapeRendering="crispEdges"/>,
      <rect key={"60,4,28"} x={60} y={4} width={28} height={16} fill="#201238" shapeRendering="crispEdges"/>,
      <rect key={"0,14,28"} x={0} y={14} width={28} height={10} fill="#241440" shapeRendering="crispEdges"/>,
      <rect key={"48,10,30"} x={48} y={10} width={30} height={12} fill="#201440" shapeRendering="crispEdges"/>,
      <rect key={"28,14,32"} x={28} y={14} width={32} height={120} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"30,16,28"} x={30} y={16} width={28} height={118} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"32,18,24"} x={32} y={18} width={24} height={116} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"28,8,4"} x={28} y={8} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"34,8,4"} x={34} y={8} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"40,8,4"} x={40} y={8} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"46,8,4"} x={46} y={8} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"52,8,4"} x={52} y={8} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"58,8,4"} x={58} y={8} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"29,9,2"} x={29} y={9} width={2} height={6} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"35,9,2"} x={35} y={9} width={2} height={6} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"41,9,2"} x={41} y={9} width={2} height={6} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"47,9,2"} x={47} y={9} width={2} height={6} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"53,9,2"} x={53} y={9} width={2} height={6} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"59,9,2"} x={59} y={9} width={2} height={6} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"26,14,36"} x={26} y={14} width={36} height={4} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"32,6,24"} x={32} y={6} width={24} height={10} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"30,8,28"} x={30} y={8} width={28} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"28,10,32"} x={28} y={10} width={32} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"28,4,3"} x={28} y={4} width={3} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"33,4,3"} x={33} y={4} width={3} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"38,4,3"} x={38} y={4} width={3} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"43,4,3"} x={43} y={4} width={3} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"48,4,3"} x={48} y={4} width={3} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"53,4,3"} x={53} y={4} width={3} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"58,4,3"} x={58} y={4} width={3} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"30,2,4"} x={30} y={2} width={4} height={8} fill="#e84010" shapeRendering="crispEdges"/>,
      <rect key={"34,4,4"} x={34} y={4} width={4} height={8} fill="#e84010" shapeRendering="crispEdges"/>,
      <rect key={"38,2,4"} x={38} y={2} width={4} height={8} fill="#e84010" shapeRendering="crispEdges"/>,
      <rect key={"42,4,4"} x={42} y={4} width={4} height={8} fill="#e84010" shapeRendering="crispEdges"/>,
      <rect key={"46,2,4"} x={46} y={2} width={4} height={8} fill="#e84010" shapeRendering="crispEdges"/>,
      <rect key={"50,4,4"} x={50} y={4} width={4} height={8} fill="#e84010" shapeRendering="crispEdges"/>,
      <rect key={"32,0,3"} x={32} y={0} width={3} height={6} fill="#f86820" shapeRendering="crispEdges"/>,
      <rect key={"36,3,3"} x={36} y={3} width={3} height={6} fill="#f86820" shapeRendering="crispEdges"/>,
      <rect key={"40,0,3"} x={40} y={0} width={3} height={6} fill="#f86820" shapeRendering="crispEdges"/>,
      <rect key={"44,3,3"} x={44} y={3} width={3} height={6} fill="#f86820" shapeRendering="crispEdges"/>,
      <rect key={"48,0,3"} x={48} y={0} width={3} height={6} fill="#f86820" shapeRendering="crispEdges"/>,
      <rect key={"34,0,2"} x={34} y={0} width={2} height={4} fill="#ffa030" shapeRendering="crispEdges"/>,
      <rect key={"38,2,2"} x={38} y={2} width={2} height={4} fill="#ffa030" shapeRendering="crispEdges"/>,
      <rect key={"42,0,2"} x={42} y={0} width={2} height={4} fill="#ffa030" shapeRendering="crispEdges"/>,
      <rect key={"46,2,2"} x={46} y={2} width={2} height={4} fill="#ffa030" shapeRendering="crispEdges"/>,
      <rect key={"34,0,4"} x={34} y={0} width={4} height={4} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"62,2,8"} x={62} y={2} width={8} height={14} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"58,14,10"} x={58} y={14} width={10} height={10} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"54,22,12"} x={54} y={22} width={12} height={10} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"50,30,14"} x={50} y={30} width={14} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"54,36,10"} x={54} y={36} width={10} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"50,42,12"} x={50} y={42} width={12} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"63,3,6"} x={63} y={3} width={6} height={12} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"59,14,8"} x={59} y={14} width={8} height={8} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"34,40,8"} x={34} y={40} width={8} height={10} fill="#f0d040" opacity={0.75} shapeRendering="crispEdges"/>,
      <rect key={"46,40,8"} x={46} y={40} width={8} height={10} fill="#f0d040" opacity={0.75} shapeRendering="crispEdges"/>,
      <rect key={"34,60,8"} x={34} y={60} width={8} height={10} fill="#f0d040" opacity={0.75} shapeRendering="crispEdges"/>,
      <rect key={"46,60,8"} x={46} y={60} width={8} height={10} fill="#f0d040" opacity={0.75} shapeRendering="crispEdges"/>,
      <rect key={"34,80,8"} x={34} y={80} width={8} height={10} fill="#f0d040" opacity={0.75} shapeRendering="crispEdges"/>,
      <rect key={"46,80,8"} x={46} y={80} width={8} height={10} fill="#f0d040" opacity={0.75} shapeRendering="crispEdges"/>,
      <rect key={"35,41,6"} x={35} y={41} width={6} height={8} fill="#fff880" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"47,41,6"} x={47} y={41} width={6} height={8} fill="#fff880" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"35,61,6"} x={35} y={61} width={6} height={8} fill="#fff880" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"47,61,6"} x={47} y={61} width={6} height={8} fill="#fff880" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"35,81,6"} x={35} y={81} width={6} height={8} fill="#fff880" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"47,81,6"} x={47} y={81} width={6} height={8} fill="#fff880" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h20,28"} x={28} y={20} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h28,28"} x={28} y={28} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h36,28"} x={28} y={36} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h44,28"} x={28} y={44} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h52,28"} x={28} y={52} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h60,28"} x={28} y={60} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h68,28"} x={28} y={68} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h76,28"} x={28} y={76} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h84,28"} x={28} y={84} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h92,28"} x={28} y={92} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h100,28"} x={28} y={100} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h108,28"} x={28} y={108} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h116,28"} x={28} y={116} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"h124,28"} x={28} y={124} width={32} height={1} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"6,80,10"} x={6} y={80} width={10} height={12} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"4,88,14"} x={4} y={88} width={14} height={16} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"8,76,6"} x={8} y={76} width={6} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"10,74,4"} x={10} y={74} width={4} height={4} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"2,84,6"} x={2} y={84} width={6} height={4} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"16,84,6"} x={16} y={84} width={6} height={4} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"72,90,10"} x={72} y={90} width={10} height={12} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"70,98,14"} x={70} y={98} width={14} height={14} fill="#c03020" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"74,86,6"} x={74} y={86} width={6} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"68,94,6"} x={68} y={94} width={6} height={4} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"82,94,6"} x={82} y={94} width={6} height={4} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"0,130,88"} x={0} y={130} width={88} height={18} fill="#1a0808" shapeRendering="crispEdges"/>,
      <rect key={"0,128,6"} x={0} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"8,128,6"} x={8} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"16,128,6"} x={16} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"24,128,6"} x={24} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"32,128,6"} x={32} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"40,128,6"} x={40} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"48,128,6"} x={48} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"56,128,6"} x={56} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"64,128,6"} x={64} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"72,128,6"} x={72} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"80,128,6"} x={80} y={128} width={6} height={10} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"2,126,4"} x={2} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"10,126,4"} x={10} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"18,126,4"} x={18} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"26,126,4"} x={26} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"34,126,4"} x={34} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"42,126,4"} x={42} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"50,126,4"} x={50} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"58,126,4"} x={58} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"66,126,4"} x={66} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"74,126,4"} x={74} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"82,126,4"} x={82} y={126} width={4} height={8} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The High Priestess": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#080e24" shapeRendering="crispEdges"/>,
      <rect key={"0,100,88"} x={0} y={100} width={88} height={48} fill="#0a1828" shapeRendering="crispEdges"/>,
      <rect key={"0,108,88"} x={0} y={108} width={88} height={40} fill="#142240" shapeRendering="crispEdges"/>,
      <rect key={"0,100,6"} x={0} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"8,100,6"} x={8} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"16,100,6"} x={16} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"24,100,6"} x={24} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"32,100,6"} x={32} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"40,100,6"} x={40} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"48,100,6"} x={48} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"56,100,6"} x={56} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"64,100,6"} x={64} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"72,100,6"} x={72} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"80,100,6"} x={80} y={100} width={6} height={4} fill="#1c2e50" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"16,80,56"} x={16} y={80} width={56} height={60} fill="#aa0010" opacity={0.25} shapeRendering="crispEdges"/>,
      <rect key={"16,90,56"} x={16} y={90} width={56} height={50} fill="#3a1040" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"18,84,4"} x={18} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"24,84,4"} x={24} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"30,84,4"} x={30} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"36,84,4"} x={36} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"42,84,4"} x={42} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"48,84,4"} x={48} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"54,84,4"} x={54} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"60,84,4"} x={60} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"66,84,4"} x={66} y={84} width={4} height={8} fill="#cc1828" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"2,8,14"} x={2} y={8} width={14} height={140} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"4,10,10"} x={4} y={10} width={10} height={136} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"6,12,6"} x={6} y={12} width={6} height={132} fill="#1e0a38" shapeRendering="crispEdges"/>,
      <rect key={"2,6,14"} x={2} y={6} width={14} height={6} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"2,140,14"} x={2} y={140} width={14} height={6} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"6,20,6"} x={6} y={20} width={6} height={3} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"6,25,6"} x={6} y={25} width={6} height={3} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"6,30,6"} x={6} y={30} width={6} height={3} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"72,8,14"} x={72} y={8} width={14} height={140} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"74,10,10"} x={74} y={10} width={10} height={136} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"76,12,6"} x={76} y={12} width={6} height={132} fill="#1e0a38" shapeRendering="crispEdges"/>,
      <rect key={"72,6,14"} x={72} y={6} width={14} height={6} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"72,140,14"} x={72} y={140} width={14} height={6} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"76,20,6"} x={76} y={20} width={6} height={14} fill="#e8b83a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,20,2"} x={80} y={20} width={2} height={12} fill="#e8b83a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"74,30,4"} x={74} y={30} width={4} height={4} fill="#e8b83a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"30,118,28"} x={30} y={118} width={28} height={6} fill="#c0bcb0" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"26,122,36"} x={26} y={122} width={36} height={4} fill="#e8e4d8" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"28,124,32"} x={28} y={124} width={32} height={6} fill="#c0bcb0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"32,120,24"} x={32} y={120} width={24} height={8} fill="#080e24" shapeRendering="crispEdges"/>,
      <rect key={"28,22,32"} x={28} y={22} width={32} height={10} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"26,18,36"} x={26} y={18} width={36} height={8} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"28,14,32"} x={28} y={14} width={32} height={6} fill="#e8e4d8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"30,10,28"} x={30} y={10} width={28} height={10} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"34,8,20"} x={34} y={8} width={20} height={6} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"38,4,12"} x={38} y={4} width={12} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"40,2,8"} x={40} y={2} width={8} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"40,34,8"} x={40} y={34} width={8} height={20} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"34,40,20"} x={34} y={40} width={20} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"41,35,6"} x={41} y={35} width={6} height={18} fill="#e8b83a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"35,41,18"} x={35} y={41} width={18} height={6} fill="#e8b83a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"20,32,48"} x={20} y={32} width={48} height={80} fill="#1a3ea8" shapeRendering="crispEdges"/>,
      <rect key={"22,34,44"} x={22} y={34} width={44} height={76} fill="#102888" shapeRendering="crispEdges"/>,
      <rect key={"24,36,40"} x={24} y={36} width={40} height={72} fill="#163090" shapeRendering="crispEdges"/>,
      <rect key={"36,32,16"} x={36} y={32} width={16} height={80} fill="#e8e4d8" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"38,34,12"} x={38} y={34} width={12} height={76} fill="#f4eed8" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"30,64,28"} x={30} y={64} width={28} height={22} fill="#f4eed8" shapeRendering="crispEdges"/>,
      <rect key={"32,66,24"} x={32} y={66} width={24} height={18} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"34,68,20"} x={34} y={68} width={20} height={14} fill="#f4eed8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"36,70,3"} x={36} y={70} width={3} height={10} fill="#7a5010" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"41,70,3"} x={41} y={70} width={3} height={10} fill="#7a5010" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"46,70,3"} x={46} y={70} width={3} height={10} fill="#7a5010" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"51,70,3"} x={51} y={70} width={3} height={10} fill="#7a5010" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"30,24,28"} x={30} y={24} width={28} height={14} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"32,26,24"} x={32} y={26} width={24} height={10} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"34,28,6"} x={34} y={28} width={6} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"48,28,6"} x={48} y={28} width={6} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"35,29,4"} x={35} y={29} width={4} height={3} fill="#2a1060" shapeRendering="crispEdges"/>,
      <rect key={"49,29,4"} x={49} y={29} width={4} height={3} fill="#2a1060" shapeRendering="crispEdges"/>,
      <rect key={"36,29,2"} x={36} y={29} width={2} height={2} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"50,29,2"} x={50} y={29} width={2} height={2} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"36,28,2"} x={36} y={28} width={2} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"50,28,2"} x={50} y={28} width={2} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"33,26,8"} x={33} y={26} width={8} height={2} fill="#805020" shapeRendering="crispEdges"/>,
      <rect key={"47,26,8"} x={47} y={26} width={8} height={2} fill="#805020" shapeRendering="crispEdges"/>,
      <rect key={"41,33,4"} x={41} y={33} width={4} height={4} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"39,36,2"} x={39} y={36} width={2} height={2} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"43,36,2"} x={43} y={36} width={2} height={2} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"38,40,12"} x={38} y={40} width={12} height={3} fill="#8a3828" shapeRendering="crispEdges"/>,
      <rect key={"39,43,10"} x={39} y={43} width={10} height={4} fill="#a04838" shapeRendering="crispEdges"/>,
      <rect key={"40,41,8"} x={40} y={41} width={8} height={2} fill="#c06050" opacity={0.4} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Moon": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#040818" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={100} fill="#060a1c" shapeRendering="crispEdges"/>,
      <rect key={"24,4,40"} x={24} y={4} width={40} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"18,8,52"} x={18} y={8} width={52} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"12,12,64"} x={12} y={12} width={64} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"8,16,72"} x={8} y={16} width={72} height={8} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"6,24,76"} x={6} y={24} width={76} height={8} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"8,32,72"} x={8} y={32} width={72} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"12,36,64"} x={12} y={36} width={64} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"18,40,52"} x={18} y={40} width={52} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"24,44,40"} x={24} y={44} width={40} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"38,14,20"} x={38} y={14} width={20} height={28} fill="#d8d4b8" shapeRendering="crispEdges"/>,
      <rect key={"40,16,16"} x={40} y={16} width={16} height={24} fill="#e8e4c8" shapeRendering="crispEdges"/>,
      <rect key={"44,20,8"} x={44} y={20} width={8} height={6} fill="#c8c4a8" shapeRendering="crispEdges"/>,
      <rect key={"46,22,4"} x={46} y={22} width={4} height={3} fill="#b8b498" shapeRendering="crispEdges"/>,
      <rect key={"48,28,4"} x={48} y={28} width={4} height={6} fill="#c8c4a8" shapeRendering="crispEdges"/>,
      <rect key={"50,32,4"} x={50} y={32} width={4} height={4} fill="#b8b498" shapeRendering="crispEdges"/>,
      <rect key={"2,16,4"} x={2} y={16} width={4} height={2} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"2,24,4"} x={2} y={24} width={4} height={2} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"2,32,4"} x={2} y={32} width={4} height={2} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"2,40,4"} x={2} y={40} width={4} height={2} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"82,16,4"} x={82} y={16} width={4} height={2} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"82,24,4"} x={82} y={24} width={4} height={2} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"82,32,4"} x={82} y={32} width={4} height={2} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"82,40,4"} x={82} y={40} width={4} height={2} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"12,2,2"} x={12} y={2} width={2} height={4} fill="#c0bcb0" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"20,0,2"} x={20} y={0} width={2} height={4} fill="#c0bcb0" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"28,0,2"} x={28} y={0} width={2} height={4} fill="#c0bcb0" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"36,0,2"} x={36} y={0} width={2} height={4} fill="#c0bcb0" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"44,0,2"} x={44} y={0} width={2} height={4} fill="#c0bcb0" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"52,0,2"} x={52} y={0} width={2} height={4} fill="#c0bcb0" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"60,0,2"} x={60} y={0} width={2} height={4} fill="#c0bcb0" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"68,2,2"} x={68} y={2} width={2} height={4} fill="#c0bcb0" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"0,96,88"} x={0} y={96} width={88} height={52} fill="#0a1828" shapeRendering="crispEdges"/>,
      <rect key={"0,100,88"} x={0} y={100} width={88} height={48} fill="#142240" shapeRendering="crispEdges"/>,
      <rect key={"0,108,88"} x={0} y={108} width={88} height={40} fill="#1c2e50" shapeRendering="crispEdges"/>,
      <rect key={"0,96,7"} x={0} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"10,96,7"} x={10} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"20,96,7"} x={20} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"30,96,7"} x={30} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"40,96,7"} x={40} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"50,96,7"} x={50} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"60,96,7"} x={60} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"70,96,7"} x={70} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"80,96,7"} x={80} y={96} width={7} height={3} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"0,40,18"} x={0} y={40} width={18} height={108} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"2,38,14"} x={2} y={38} width={14} height={110} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"4,40,10"} x={4} y={40} width={10} height={106} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"0,36,3"} x={0} y={36} width={3} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"4,36,3"} x={4} y={36} width={3} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"8,36,3"} x={8} y={36} width={3} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"12,36,3"} x={12} y={36} width={3} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"6,56,8"} x={6} y={56} width={8} height={12} fill="#f0d040" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"6,80,8"} x={6} y={80} width={8} height={12} fill="#f0d040" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"7,57,6"} x={7} y={57} width={6} height={10} fill="#fff880" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"70,40,18"} x={70} y={40} width={18} height={108} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"72,38,14"} x={72} y={38} width={14} height={110} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"74,40,10"} x={74} y={40} width={10} height={106} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"70,36,3"} x={70} y={36} width={3} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"74,36,3"} x={74} y={36} width={3} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"78,36,3"} x={78} y={36} width={3} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"82,36,3"} x={82} y={36} width={3} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"74,56,8"} x={74} y={56} width={8} height={12} fill="#f0d040" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"74,80,8"} x={74} y={80} width={8} height={12} fill="#f0d040" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"75,57,6"} x={75} y={57} width={6} height={10} fill="#fff880" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"24,90,40"} x={24} y={90} width={40} height={58} fill="#1a1408" shapeRendering="crispEdges"/>,
      <rect key={"28,94,32"} x={28} y={94} width={32} height={54} fill="#221c10" shapeRendering="crispEdges"/>,
      <rect key={"30,100,4"} x={30} y={100} width={4} height={4} fill="#2a2212" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"34,104,4"} x={34} y={104} width={4} height={4} fill="#2a2212" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"38,108,4"} x={38} y={108} width={4} height={4} fill="#2a2212" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"42,112,4"} x={42} y={112} width={4} height={4} fill="#2a2212" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"46,116,4"} x={46} y={116} width={4} height={4} fill="#2a2212" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"50,120,4"} x={50} y={120} width={4} height={4} fill="#2a2212" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"16,78,16"} x={16} y={78} width={16} height={14} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"18,72,12"} x={18} y={72} width={12} height={10} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"16,70,10"} x={16} y={70} width={10} height={8} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"20,68,8"} x={20} y={68} width={8} height={6} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"16,88,6"} x={16} y={88} width={6} height={16} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"22,88,4"} x={22} y={88} width={4} height={16} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"14,74,4"} x={14} y={74} width={4} height={4} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"14,72,3"} x={14} y={72} width={3} height={3} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"p17,73"} x={17} y={73} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p18,78"} x={18} y={78} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"56,80,16"} x={56} y={80} width={16} height={14} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"58,74,12"} x={58} y={74} width={12} height={10} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"60,72,10"} x={60} y={72} width={10} height={8} fill="#3a2810" shapeRendering="crispEdges"/>,
      <rect key={"62,70,8"} x={62} y={70} width={8} height={6} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"56,90,6"} x={56} y={90} width={6} height={16} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"64,90,4"} x={64} y={90} width={4} height={16} fill="#2a1808" shapeRendering="crispEdges"/>,
      <rect key={"72,76,3"} x={72} y={76} width={3} height={3} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"p61,75"} x={61} y={75} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p62,80"} x={62} y={80} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"34,110,20"} x={34} y={110} width={20} height={8} fill="#c03020" opacity={0.85} shapeRendering="crispEdges"/>,
      <rect key={"30,116,28"} x={30} y={116} width={28} height={6} fill="#c03020" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"28,120,8"} x={28} y={120} width={8} height={4} fill="#601010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"52,120,8"} x={52} y={120} width={8} height={4} fill="#601010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"36,106,4"} x={36} y={106} width={4} height={4} fill="#c03020" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"48,106,4"} x={48} y={106} width={4} height={4} fill="#c03020" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"38,102,3"} x={38} y={102} width={3} height={4} fill="#601010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"45,102,3"} x={45} y={102} width={3} height={4} fill="#601010" opacity={0.6} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Fool": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#1a3ea8" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#102888" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={100} fill="#2040a0" shapeRendering="crispEdges"/>,
      <rect key={"52,4,28"} x={52} y={4} width={28} height={28} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"48,8,36"} x={48} y={8} width={36} height={20} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"56,2,20"} x={56} y={2} width={20} height={32} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"54,6,24"} x={54} y={6} width={24} height={20} fill="#fff880" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"44,4,4"} x={44} y={4} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"44,24,4"} x={44} y={24} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"80,4,4"} x={80} y={4} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"80,24,4"} x={80} y={24} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"48,2,4"} x={48} y={2} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"76,2,4"} x={76} y={2} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"48,26,4"} x={48} y={26} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"76,26,4"} x={76} y={26} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"42,10,3"} x={42} y={10} width={3} height={3} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"82,10,3"} x={82} y={10} width={3} height={3} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"42,18,3"} x={42} y={18} width={3} height={3} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"82,18,3"} x={82} y={18} width={3} height={3} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"p60,12"} x={60} y={12} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p67,12"} x={67} y={12} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"62,17,6"} x={62} y={17} width={6} height={2} fill="#c8a010" shapeRendering="crispEdges"/>,
      <rect key={"0,80,44"} x={0} y={80} width={44} height={68} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"0,84,48"} x={0} y={84} width={48} height={64} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"0,80,50"} x={0} y={80} width={50} height={6} fill="#3a2810" shapeRendering="crispEdges"/>,
      <rect key={"2,76,46"} x={2} y={76} width={46} height={6} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"44,54,44"} x={44} y={54} width={44} height={94} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"50,44,38"} x={50} y={44} width={38} height={104} fill="#505068" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"56,38,32"} x={56} y={38} width={32} height={110} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"0,100,44"} x={0} y={100} width={44} height={48} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"0,108,44"} x={0} y={108} width={44} height={40} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"20,98,10"} x={20} y={98} width={10} height={18} fill="#c09030" shapeRendering="crispEdges"/>,
      <rect key={"30,100,10"} x={30} y={100} width={10} height={16} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"20,114,10"} x={20} y={114} width={10} height={6} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"30,114,10"} x={30} y={114} width={10} height={6} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"16,72,24"} x={16} y={72} width={24} height={28} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"18,74,20"} x={18} y={74} width={20} height={24} fill="#f4eed8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"16,92,24"} x={16} y={92} width={24} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"18,92,2"} x={18} y={92} width={2} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"22,92,2"} x={22} y={92} width={2} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"26,92,2"} x={26} y={92} width={2} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"30,92,2"} x={30} y={92} width={2} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"34,92,2"} x={34} y={92} width={2} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"18,70,20"} x={18} y={70} width={20} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"24,66,8"} x={24} y={66} width={8} height={6} fill="#a0c840" shapeRendering="crispEdges"/>,
      <rect key={"8,76,10"} x={8} y={76} width={10} height={16} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"38,66,10"} x={38} y={66} width={10} height={16} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"22,50,14"} x={22} y={50} width={14} height={16} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"24,52,10"} x={24} y={52} width={10} height={12} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"20,36,16"} x={20} y={36} width={16} height={18} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"22,32,12"} x={22} y={32} width={12} height={10} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"24,28,8"} x={24} y={28} width={8} height={8} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"26,24,4"} x={26} y={24} width={4} height={8} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"18,40,4"} x={18} y={40} width={4} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"34,40,4"} x={34} y={40} width={4} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"26,22,4"} x={26} y={22} width={4} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"24,54,4"} x={24} y={54} width={4} height={4} fill="#080408" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"34,54,4"} x={34} y={54} width={4} height={4} fill="#080408" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"25,55,2"} x={25} y={55} width={2} height={2} fill="#4040d0" shapeRendering="crispEdges"/>,
      <rect key={"35,55,2"} x={35} y={55} width={2} height={2} fill="#4040d0" shapeRendering="crispEdges"/>,
      <rect key={"22,52,6"} x={22} y={52} width={6} height={2} fill="#805020" shapeRendering="crispEdges"/>,
      <rect key={"32,52,6"} x={32} y={52} width={6} height={2} fill="#805020" shapeRendering="crispEdges"/>,
      <rect key={"28,60,6"} x={28} y={60} width={6} height={3} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"26,65,8"} x={26} y={65} width={8} height={3} fill="#c06050" shapeRendering="crispEdges"/>,
      <rect key={"28,65,4"} x={28} y={65} width={4} height={2} fill="#d08070" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"44,40,4"} x={44} y={40} width={4} height={90} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"42,38,8"} x={42} y={38} width={8} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"40,36,12"} x={40} y={36} width={12} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"44,34,18"} x={44} y={34} width={18} height={14} fill="#c03020" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"46,36,14"} x={46} y={36} width={14} height={10} fill="#c04020" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"48,38,10"} x={48} y={38} width={10} height={6} fill="#f86820" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"10,84,6"} x={10} y={84} width={6} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"11,82,4"} x={11} y={82} width={4} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"12,80,4"} x={12} y={80} width={4} height={4} fill="#e8e4d8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"12,84,3"} x={12} y={84} width={3} height={3} fill="#f0d040" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"4,86,16"} x={4} y={86} width={16} height={12} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"6,80,12"} x={6} y={80} width={12} height={10} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"8,78,10"} x={8} y={78} width={10} height={8} fill="#3a2810" shapeRendering="crispEdges"/>,
      <rect key={"4,96,6"} x={4} y={96} width={6} height={14} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"12,96,6"} x={12} y={96} width={6} height={14} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"18,90,6"} x={18} y={90} width={6} height={8} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"6,80,4"} x={6} y={80} width={4} height={4} fill="#2a1808" shapeRendering="crispEdges"/>,
      <rect key={"p8,82"} x={8} y={82} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p10,86"} x={10} y={86} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Star": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#06030e" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={90} fill="#080c1e" shapeRendering="crispEdges"/>,
      <rect key={"0,80,40"} x={0} y={80} width={40} height={68} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"0,86,44"} x={0} y={86} width={44} height={62} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"36,84,52"} x={36} y={84} width={52} height={64} fill="#0a1828" shapeRendering="crispEdges"/>,
      <rect key={"38,88,48"} x={38} y={88} width={48} height={60} fill="#142240" shapeRendering="crispEdges"/>,
      <rect key={"40,94,44"} x={40} y={94} width={44} height={54} fill="#1c2e50" shapeRendering="crispEdges"/>,
      <rect key={"38,84,5"} x={38} y={84} width={5} height={4} fill="#1c2e50" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"46,84,5"} x={46} y={84} width={5} height={4} fill="#1c2e50" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"54,84,5"} x={54} y={84} width={5} height={4} fill="#1c2e50" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"62,84,5"} x={62} y={84} width={5} height={4} fill="#1c2e50" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"70,84,5"} x={70} y={84} width={5} height={4} fill="#1c2e50" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"78,84,5"} x={78} y={84} width={5} height={4} fill="#1c2e50" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"86,84,5"} x={86} y={84} width={5} height={4} fill="#1c2e50" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"34,8,20"} x={34} y={8} width={20} height={44} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"24,18,48"} x={24} y={18} width={48} height={24} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"26,12,36"} x={26} y={12} width={36} height={36} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"36,8,16"} x={36} y={8} width={16} height={46} fill="#fff880" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"28,16,32"} x={28} y={16} width={32} height={28} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"38,4,12"} x={38} y={4} width={12} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"38,52,12"} x={38} y={52} width={12} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"16,22,8"} x={16} y={22} width={8} height={12} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"64,22,8"} x={64} y={22} width={8} height={12} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"22,10,8"} x={22} y={10} width={8} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"58,10,8"} x={58} y={10} width={8} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"22,46,8"} x={22} y={46} width={8} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"58,46,8"} x={58} y={46} width={8} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"38,20,12"} x={38} y={20} width={12} height={20} fill="#fff880" shapeRendering="crispEdges"/>,
      <rect key={"40,22,8"} x={40} y={22} width={8} height={16} fill="#ffffff" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,8,6"} x={4} y={8} width={6} height={6} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"76,6,6"} x={76} y={6} width={6} height={6} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"4,28,6"} x={4} y={28} width={6} height={6} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"76,24,6"} x={76} y={24} width={6} height={6} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"4,46,6"} x={4} y={46} width={6} height={6} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"76,44,6"} x={76} y={44} width={6} height={6} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"6,64,6"} x={6} y={64} width={6} height={6} fill="#e8d5a3" shapeRendering="crispEdges"/>,
      <rect key={"5,9,4"} x={5} y={9} width={4} height={4} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"77,7,4"} x={77} y={7} width={4} height={4} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"5,29,4"} x={5} y={29} width={4} height={4} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"77,25,4"} x={77} y={25} width={4} height={4} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"5,47,4"} x={5} y={47} width={4} height={4} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"77,45,4"} x={77} y={45} width={4} height={4} fill="#fff880" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"6,7,2"} x={6} y={7} width={2} height={8} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"78,5,2"} x={78} y={5} width={2} height={8} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"6,27,2"} x={6} y={27} width={2} height={8} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"78,23,2"} x={78} y={23} width={2} height={8} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"6,45,2"} x={6} y={45} width={2} height={8} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"78,43,2"} x={78} y={43} width={2} height={8} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"3,10,8"} x={3} y={10} width={8} height={2} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"75,8,8"} x={75} y={8} width={8} height={2} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"3,30,8"} x={3} y={30} width={8} height={2} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"75,26,8"} x={75} y={26} width={8} height={2} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"3,48,8"} x={3} y={48} width={8} height={2} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"75,46,8"} x={75} y={46} width={8} height={2} fill="#e8d5a3" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"14,72,20"} x={14} y={72} width={20} height={20} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"16,74,16"} x={16} y={74} width={16} height={16} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"18,56,16"} x={18} y={56} width={16} height={16} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"20,58,12"} x={20} y={58} width={12} height={12} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"18,54,16"} x={18} y={54} width={16} height={4} fill="#d0c090" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"14,52,20"} x={14} y={52} width={20} height={8} fill="#c0b080" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"21,61,4"} x={21} y={61} width={4} height={3} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"29,61,4"} x={29} y={61} width={4} height={3} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"22,62,2"} x={22} y={62} width={2} height={2} fill="#303080" shapeRendering="crispEdges"/>,
      <rect key={"30,62,2"} x={30} y={62} width={2} height={2} fill="#303080" shapeRendering="crispEdges"/>,
      <rect key={"4,76,16"} x={4} y={76} width={16} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"2,72,8"} x={2} y={72} width={8} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"4,74,4"} x={4} y={74} width={4} height={4} fill="#c8b890" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"2,78,4"} x={2} y={78} width={4} height={2} fill="#2454c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"2,80,4"} x={2} y={80} width={4} height={2} fill="#2454c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"2,82,4"} x={2} y={82} width={4} height={2} fill="#2454c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"2,84,4"} x={2} y={84} width={4} height={2} fill="#2454c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"2,86,4"} x={2} y={86} width={4} height={2} fill="#2454c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"30,74,16"} x={30} y={74} width={16} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"42,70,8"} x={42} y={70} width={8} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"44,72,4"} x={44} y={72} width={4} height={4} fill="#c8b890" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"46,76,4"} x={46} y={76} width={4} height={2} fill="#347840" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"46,78,4"} x={46} y={78} width={4} height={2} fill="#347840" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"46,80,4"} x={46} y={80} width={4} height={2} fill="#347840" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"46,82,4"} x={46} y={82} width={4} height={2} fill="#347840" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"16,88,12"} x={16} y={88} width={12} height={12} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"22,94,10"} x={22} y={94} width={10} height={8} fill="#d4a060" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"72,50,6"} x={72} y={50} width={6} height={90} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"74,40,6"} x={74} y={40} width={6} height={96} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"64,40,20"} x={64} y={40} width={20} height={20} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"60,50,28"} x={60} y={50} width={28} height={16} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"62,60,24"} x={62} y={60} width={24} height={12} fill="#245828" opacity={0.8} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Wheel of Fortune": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#080c18" shapeRendering="crispEdges"/>,
      <rect key={"0,0,20"} x={0} y={0} width={20} height={20} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"68,0,20"} x={68} y={0} width={20} height={20} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"0,128,20"} x={0} y={128} width={20} height={20} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"68,128,20"} x={68} y={128} width={20} height={20} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,2,8"} x={4} y={2} width={8} height={8} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"2,4,12"} x={2} y={4} width={12} height={4} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"6,0,4"} x={6} y={0} width={4} height={6} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"4,6,4"} x={4} y={6} width={4} height={4} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"10,4,4"} x={10} y={4} width={4} height={4} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"p6,3"} x={6} y={3} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"72,2,8"} x={72} y={2} width={8} height={8} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"70,4,12"} x={70} y={4} width={12} height={4} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"74,0,4"} x={74} y={0} width={4} height={6} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"70,5,3"} x={70} y={5} width={3} height={3} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"81,5,3"} x={81} y={5} width={3} height={3} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"p76,3"} x={76} y={3} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"4,130,8"} x={4} y={130} width={8} height={8} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"2,132,12"} x={2} y={132} width={12} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"0,130,6"} x={0} y={130} width={6} height={8} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"2,134,4"} x={2} y={134} width={4} height={4} fill="#fff880" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"p6,131"} x={6} y={131} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"72,130,8"} x={72} y={130} width={8} height={8} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"70,132,12"} x={70} y={132} width={12} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"80,128,8"} x={80} y={128} width={8} height={10} fill="#c0bcb0" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"p76,131"} x={76} y={131} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"6,24,76"} x={6} y={24} width={76} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"6,108,76"} x={6} y={108} width={76} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"6,24,8"} x={6} y={24} width={8} height={92} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"74,24,8"} x={74} y={24} width={8} height={92} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"4,28,4"} x={4} y={28} width={4} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"80,28,4"} x={80} y={28} width={4} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"4,108,4"} x={4} y={108} width={4} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"80,108,4"} x={80} y={108} width={4} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"16,34,56"} x={16} y={34} width={56} height={10} fill="#7a5010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"16,98,56"} x={16} y={98} width={56} height={10} fill="#7a5010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"16,34,10"} x={16} y={34} width={10} height={74} fill="#7a5010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"62,34,10"} x={62} y={34} width={10} height={74} fill="#7a5010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"30,56,28"} x={30} y={56} width={28} height={28} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"34,60,20"} x={34} y={60} width={20} height={20} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"36,62,16"} x={36} y={62} width={16} height={16} fill="#c8941a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"38,64,12"} x={38} y={64} width={12} height={12} fill="#1e0a38" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"v44,32"} x={44} y={32} width={1} height={76} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"h70,14"} x={14} y={70} width={60} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"44,32,2"} x={44} y={32} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"46,34,2"} x={46} y={34} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"48,36,2"} x={48} y={36} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"50,38,2"} x={50} y={38} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"52,40,2"} x={52} y={40} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"54,42,2"} x={54} y={42} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"56,44,2"} x={56} y={44} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"58,46,2"} x={58} y={46} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"60,48,2"} x={60} y={48} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"62,50,2"} x={62} y={50} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"42,34,2"} x={42} y={34} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"40,36,2"} x={40} y={36} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"38,38,2"} x={38} y={38} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"36,40,2"} x={36} y={40} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"34,42,2"} x={34} y={42} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"32,44,2"} x={32} y={44} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"30,46,2"} x={30} y={46} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"28,48,2"} x={28} y={48} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"26,50,2"} x={26} y={50} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"44,88,2"} x={44} y={88} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"46,86,2"} x={46} y={86} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"48,84,2"} x={48} y={84} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"50,82,2"} x={50} y={82} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"52,80,2"} x={52} y={80} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"54,78,2"} x={54} y={78} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"56,76,2"} x={56} y={76} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"58,74,2"} x={58} y={74} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"60,72,2"} x={60} y={72} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"62,70,2"} x={62} y={70} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"42,86,2"} x={42} y={86} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"40,84,2"} x={40} y={84} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"38,82,2"} x={38} y={82} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"36,80,2"} x={36} y={80} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"34,78,2"} x={34} y={78} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"32,76,2"} x={32} y={76} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"30,74,2"} x={30} y={74} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"28,72,2"} x={28} y={72} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"26,70,2"} x={26} y={70} width={2} height={2} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"16,28,6"} x={16} y={28} width={6} height={8} fill="#c8941a" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"28,24,6"} x={28} y={24} width={6} height={8} fill="#c8941a" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"40,24,6"} x={40} y={24} width={6} height={8} fill="#c8941a" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"52,24,6"} x={52} y={24} width={6} height={8} fill="#c8941a" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"62,28,6"} x={62} y={28} width={6} height={8} fill="#c8941a" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"14,70,6"} x={14} y={70} width={6} height={8} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"16,100,6"} x={16} y={100} width={6} height={8} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"28,108,6"} x={28} y={108} width={6} height={8} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"52,108,6"} x={52} y={108} width={6} height={8} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"64,100,6"} x={64} y={100} width={6} height={8} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"18,40,4"} x={18} y={40} width={4} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"18,44,4"} x={18} y={44} width={4} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"20,48,4"} x={20} y={48} width={4} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"18,52,4"} x={18} y={52} width={4} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"18,56,4"} x={18} y={56} width={4} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"20,60,4"} x={20} y={60} width={4} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"16,40,4"} x={16} y={40} width={4} height={4} fill="#347840" shapeRendering="crispEdges"/>,
      <rect key={"14,38,4"} x={14} y={38} width={4} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"16,36,4"} x={16} y={36} width={4} height={2} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"p14,39"} x={14} y={39} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"66,72,8"} x={66} y={72} width={8} height={20} fill="#e8b83a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"68,60,8"} x={68} y={60} width={8} height={14} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"68,56,6"} x={68} y={56} width={6} height={6} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"70,52,4"} x={70} y={52} width={4} height={6} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"68,52,4"} x={68} y={52} width={4} height={4} fill="#1a1010" shapeRendering="crispEdges"/>,
      <rect key={"74,52,4"} x={74} y={52} width={4} height={4} fill="#1a1010" shapeRendering="crispEdges"/>,
      <rect key={"p70,54"} x={70} y={54} width={1} height={1} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"36,36,16"} x={36} y={36} width={16} height={8} fill="#e8e4d8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"38,32,12"} x={38} y={32} width={12} height={6} fill="#c0bcb0" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"38,30,12"} x={38} y={30} width={12} height={4} fill="#e8e4d8" opacity={0.5} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Devil": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={90} fill="#0a0410" shapeRendering="crispEdges"/>,
      <rect key={"0,10,28"} x={0} y={10} width={28} height={36} fill="#160820" shapeRendering="crispEdges"/>,
      <rect key={"0,12,24"} x={0} y={12} width={24} height={20} fill="#1e0c2c" shapeRendering="crispEdges"/>,
      <rect key={"2,14,18"} x={2} y={14} width={18} height={28} fill="#120618" shapeRendering="crispEdges"/>,
      <rect key={"60,10,28"} x={60} y={10} width={28} height={36} fill="#160820" shapeRendering="crispEdges"/>,
      <rect key={"64,12,24"} x={64} y={12} width={24} height={20} fill="#1e0c2c" shapeRendering="crispEdges"/>,
      <rect key={"68,14,18"} x={68} y={14} width={18} height={28} fill="#120618" shapeRendering="crispEdges"/>,
      <rect key={"v4,10"} x={4} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v8,10"} x={8} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v12,10"} x={12} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v16,10"} x={16} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v20,10"} x={20} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v64,10"} x={64} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v68,10"} x={68} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v72,10"} x={72} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v76,10"} x={76} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v80,10"} x={80} y={10} width={1} height={30} fill="#220a30" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"28,2,8"} x={28} y={2} width={8} height={18} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"30,4,6"} x={30} y={4} width={6} height={14} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"32,2,4"} x={32} y={2} width={4} height={10} fill="#e04030" shapeRendering="crispEdges"/>,
      <rect key={"52,2,8"} x={52} y={2} width={8} height={18} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"52,4,6"} x={52} y={4} width={6} height={14} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"54,2,4"} x={54} y={2} width={4} height={10} fill="#e04030" shapeRendering="crispEdges"/>,
      <rect key={"26,16,36"} x={26} y={16} width={36} height={28} fill="#100c18" shapeRendering="crispEdges"/>,
      <rect key={"28,18,32"} x={28} y={18} width={32} height={24} fill="#1e0c20" shapeRendering="crispEdges"/>,
      <rect key={"30,20,28"} x={30} y={20} width={28} height={22} fill="#d4a060" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"32,22,24"} x={32} y={22} width={24} height={18} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"32,24,10"} x={32} y={24} width={10} height={6} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"46,24,10"} x={46} y={24} width={10} height={6} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"34,25,6"} x={34} y={25} width={6} height={4} fill="#f86820" shapeRendering="crispEdges"/>,
      <rect key={"48,25,6"} x={48} y={25} width={6} height={4} fill="#f86820" shapeRendering="crispEdges"/>,
      <rect key={"36,25,3"} x={36} y={25} width={3} height={3} fill="#f0d040" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"50,25,3"} x={50} y={25} width={3} height={3} fill="#f0d040" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"36,24,3"} x={36} y={24} width={3} height={2} fill="#ffffff" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"50,24,3"} x={50} y={24} width={3} height={2} fill="#ffffff" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"38,40,12"} x={38} y={40} width={12} height={14} fill="#2a1818" shapeRendering="crispEdges"/>,
      <rect key={"40,42,8"} x={40} y={42} width={8} height={16} fill="#1e1010" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"40,32,8"} x={40} y={32} width={8} height={6} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"38,34,4"} x={38} y={34} width={4} height={4} fill="#a07030" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"46,34,4"} x={46} y={34} width={4} height={4} fill="#a07030" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"34,38,20"} x={34} y={38} width={20} height={4} fill="#1a0810" shapeRendering="crispEdges"/>,
      <rect key={"34,38,2"} x={34} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"36,38,2"} x={36} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"38,38,2"} x={38} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"40,38,2"} x={40} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"42,38,2"} x={42} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"44,38,2"} x={44} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"46,38,2"} x={46} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"48,38,2"} x={48} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"50,38,2"} x={50} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"52,38,2"} x={52} y={38} width={2} height={4} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"36,38,2"} x={36} y={38} width={2} height={6} fill="#e8e4d8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"40,38,2"} x={40} y={38} width={2} height={6} fill="#e8e4d8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"44,38,2"} x={44} y={38} width={2} height={6} fill="#e8e4d8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"48,38,2"} x={48} y={38} width={2} height={6} fill="#e8e4d8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"14,84,60"} x={14} y={84} width={60} height={10} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"10,90,68"} x={10} y={90} width={68} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"8,96,72"} x={8} y={96} width={72} height={8} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"14,86,60"} x={14} y={86} width={60} height={2} fill="#7a5010" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"14,92,60"} x={14} y={92} width={60} height={2} fill="#7a5010" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"28,46,32"} x={28} y={46} width={32} height={40} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"30,48,28"} x={30} y={48} width={28} height={36} fill="#180820" shapeRendering="crispEdges"/>,
      <rect key={"38,52,12"} x={38} y={52} width={12} height={2} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"36,56,16"} x={36} y={56} width={16} height={2} fill="#c8941a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"34,60,20"} x={34} y={60} width={20} height={2} fill="#c8941a" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"40,50,4"} x={40} y={50} width={4} height={14} fill="#c8941a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"44,50,4"} x={44} y={50} width={4} height={14} fill="#c8941a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"40,78,8"} x={40} y={78} width={8} height={14} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"42,76,4"} x={42} y={76} width={4} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"38,68,12"} x={38} y={68} width={12} height={12} fill="#e84010" shapeRendering="crispEdges"/>,
      <rect key={"40,64,8"} x={40} y={64} width={8} height={10} fill="#f86820" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"42,60,4"} x={42} y={60} width={4} height={8} fill="#ffa030" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"42,58,4"} x={42} y={58} width={4} height={4} fill="#fff880" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"43,56,2"} x={43} y={56} width={2} height={4} fill="#ffffff" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"4,104,14"} x={4} y={104} width={14} height={12} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"2,112,18"} x={2} y={112} width={18} height={16} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"6,100,8"} x={6} y={100} width={8} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"p7,101"} x={7} y={101} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p8,101"} x={8} y={101} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"10,98,6"} x={10} y={98} width={6} height={4} fill="#7a5010" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"h98,4"} x={4} y={98} width={26} height={1} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"v18,96"} x={18} y={96} width={1} height={20} fill="#7a5010" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"70,104,14"} x={70} y={104} width={14} height={12} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"70,112,16"} x={70} y={112} width={16} height={18} fill="#c03020" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"72,100,8"} x={72} y={100} width={8} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"p74,101"} x={74} y={101} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p75,101"} x={75} y={101} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"72,98,6"} x={72} y={98} width={6} height={4} fill="#7a5010" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"h98,58"} x={58} y={98} width={26} height={1} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"v70,96"} x={70} y={96} width={1} height={20} fill="#7a5010" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"40,96,8"} x={40} y={96} width={8} height={4} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"42,94,4"} x={42} y={94} width={4} height={8} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"0,128,88"} x={0} y={128} width={88} height={20} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"0,126,6"} x={0} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"8,126,6"} x={8} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"16,126,6"} x={16} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"24,126,6"} x={24} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"32,126,6"} x={32} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"40,126,6"} x={40} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"48,126,6"} x={48} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"56,126,6"} x={56} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"64,126,6"} x={64} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"72,126,6"} x={72} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,126,6"} x={80} y={126} width={6} height={4} fill="#282838" opacity={0.7} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Emperor": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#c03020" opacity={0.55} shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#0c0608" opacity={0.65} shapeRendering="crispEdges"/>,
      <rect key={"0,70,24"} x={0} y={70} width={24} height={78} fill="#38384a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"16,58,30"} x={16} y={58} width={30} height={90} fill="#38384a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"52,64,36"} x={52} y={64} width={36} height={84} fill="#38384a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"54,52,34"} x={54} y={52} width={34} height={96} fill="#505068" opacity={0.45} shapeRendering="crispEdges"/>,
      <rect key={"60,44,28"} x={60} y={44} width={28} height={104} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={30} fill="#1a0808" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"14,8,60"} x={14} y={8} width={60} height={130} fill="#601010" shapeRendering="crispEdges"/>,
      <rect key={"16,10,56"} x={16} y={10} width={56} height={126} fill="#aa0010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"18,12,52"} x={18} y={12} width={52} height={122} fill="#4a0c0c" shapeRendering="crispEdges"/>,
      <rect key={"8,30,10"} x={8} y={30} width={10} height={100} fill="#601010" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"70,30,10"} x={70} y={30} width={10} height={100} fill="#601010" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"14,6,60"} x={14} y={6} width={60} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"12,4,64"} x={12} y={4} width={64} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"10,2,68"} x={10} y={2} width={68} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"14,0,6"} x={14} y={0} width={6} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"22,0,6"} x={22} y={0} width={6} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"30,0,6"} x={30} y={0} width={6} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"38,0,6"} x={38} y={0} width={6} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"46,0,6"} x={46} y={0} width={6} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"54,0,6"} x={54} y={0} width={6} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"62,0,6"} x={62} y={0} width={6} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"70,0,6"} x={70} y={0} width={6} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"16,2,56"} x={16} y={2} width={56} height={4} fill="#f0d040" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"6,50,12"} x={6} y={50} width={12} height={16} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"4,54,8"} x={4} y={54} width={8} height={12} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"2,52,6"} x={2} y={52} width={6} height={10} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"4,56,4"} x={4} y={56} width={4} height={4} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"p4,57"} x={4} y={57} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p5,57"} x={5} y={57} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"2,62,6"} x={2} y={62} width={6} height={4} fill="#404858" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"70,50,12"} x={70} y={50} width={12} height={16} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"76,54,8"} x={76} y={54} width={8} height={12} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"80,52,6"} x={80} y={52} width={6} height={10} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"80,56,4"} x={80} y={56} width={4} height={4} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"p82,57"} x={82} y={57} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p83,57"} x={83} y={57} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"80,62,6"} x={80} y={62} width={6} height={4} fill="#404858" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"22,50,44"} x={22} y={50} width={44} height={70} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"24,52,40"} x={24} y={52} width={40} height={66} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"26,54,36"} x={26} y={54} width={36} height={62} fill="#505068" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"h66,22"} x={22} y={66} width={44} height={1} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"h72,22"} x={22} y={72} width={44} height={1} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"h78,22"} x={22} y={78} width={44} height={1} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"36,58,16"} x={36} y={58} width={16} height={16} fill="#c8941a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"38,60,12"} x={38} y={60} width={12} height={12} fill="#e8b83a" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"40,62,8"} x={40} y={62} width={8} height={8} fill="#c8941a" opacity={0.2} shapeRendering="crispEdges"/>,
      <rect key={"v44,56"} x={44} y={56} width={1} height={22} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"h66,36"} x={36} y={66} width={16} height={1} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"18,46,14"} x={18} y={46} width={14} height={12} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"56,46,14"} x={56} y={46} width={14} height={12} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"16,48,12"} x={16} y={48} width={12} height={8} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"60,48,12"} x={60} y={48} width={12} height={8} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"30,28,28"} x={30} y={28} width={28} height={20} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"32,30,24"} x={32} y={30} width={24} height={16} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"34,34,6"} x={34} y={34} width={6} height={5} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"48,34,6"} x={48} y={34} width={6} height={5} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"35,35,4"} x={35} y={35} width={4} height={4} fill="#2a1040" shapeRendering="crispEdges"/>,
      <rect key={"49,35,4"} x={49} y={35} width={4} height={4} fill="#2a1040" shapeRendering="crispEdges"/>,
      <rect key={"36,35,2"} x={36} y={35} width={2} height={3} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"50,35,2"} x={50} y={35} width={2} height={3} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"35,34,2"} x={35} y={34} width={2} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"49,34,2"} x={49} y={34} width={2} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"33,32,8"} x={33} y={32} width={8} height={3} fill="#602010" shapeRendering="crispEdges"/>,
      <rect key={"47,32,8"} x={47} y={32} width={8} height={3} fill="#602010" shapeRendering="crispEdges"/>,
      <rect key={"28,44,32"} x={28} y={44} width={32} height={18} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"30,46,28"} x={30} y={46} width={28} height={16} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"28,44,3"} x={28} y={44} width={3} height={16} fill="#d0ccc0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"32,44,3"} x={32} y={44} width={3} height={16} fill="#d0ccc0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"36,44,3"} x={36} y={44} width={3} height={16} fill="#d0ccc0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"40,44,3"} x={40} y={44} width={3} height={16} fill="#d0ccc0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"44,44,3"} x={44} y={44} width={3} height={16} fill="#d0ccc0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"48,44,3"} x={48} y={44} width={3} height={16} fill="#d0ccc0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"52,44,3"} x={52} y={44} width={3} height={16} fill="#d0ccc0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"56,44,3"} x={56} y={44} width={3} height={16} fill="#d0ccc0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"28,16,32"} x={28} y={16} width={32} height={14} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"26,18,36"} x={26} y={18} width={36} height={10} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"24,20,40"} x={24} y={20} width={40} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"26,14,36"} x={26} y={14} width={36} height={4} fill="#f0d040" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"28,12,4"} x={28} y={12} width={4} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"34,12,4"} x={34} y={12} width={4} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"40,12,4"} x={40} y={12} width={4} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"46,12,4"} x={46} y={12} width={4} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"52,12,4"} x={52} y={12} width={4} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"30,10,4"} x={30} y={10} width={4} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"36,10,4"} x={36} y={10} width={4} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"42,10,4"} x={42} y={10} width={4} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"48,10,4"} x={48} y={10} width={4} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"14,30,6"} x={14} y={30} width={6} height={94} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"12,28,10"} x={12} y={28} width={10} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"10,26,14"} x={10} y={26} width={14} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"12,24,10"} x={12} y={24} width={10} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"14,22,6"} x={14} y={22} width={6} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"10,20,14"} x={10} y={20} width={14} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"12,18,10"} x={12} y={18} width={10} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"14,16,6"} x={14} y={16} width={6} height={8} fill="#f0d040" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"64,60,16"} x={64} y={60} width={16} height={16} fill="#c8941a" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"66,62,12"} x={66} y={62} width={12} height={12} fill="#f0d040" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"68,64,8"} x={68} y={64} width={8} height={8} fill="#e8b83a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"v72,54"} x={72} y={54} width={1} height={24} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"h66,64"} x={64} y={66} width={16} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"70,54,4"} x={70} y={54} width={4} height={4} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"69,58,6"} x={69} y={58} width={6} height={2} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"71,56,2"} x={71} y={56} width={2} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Lovers": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#102888" opacity={0.45} shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#18286a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"28,2,32"} x={28} y={2} width={32} height={32} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"22,8,44"} x={22} y={8} width={44} height={20} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"32,0,24"} x={32} y={0} width={24} height={36} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"30,4,28"} x={30} y={4} width={28} height={24} fill="#fff880" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"22,8,4"} x={22} y={8} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"60,8,4"} x={60} y={8} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"22,24,4"} x={22} y={24} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"60,24,4"} x={60} y={24} width={4} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"18,14,3"} x={18} y={14} width={3} height={3} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"64,14,3"} x={64} y={14} width={3} height={3} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"20,18,3"} x={20} y={18} width={3} height={3} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"62,18,3"} x={62} y={18} width={3} height={3} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"10,34,68"} x={10} y={34} width={68} height={14} fill="#e8e4d8" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"6,38,76"} x={6} y={38} width={76} height={10} fill="#d0d8e8" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"10,42,68"} x={10} y={42} width={68} height={6} fill="#e8e4d8" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"34,16,20"} x={34} y={16} width={20} height={16} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"36,18,16"} x={36} y={18} width={16} height={12} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"4,22,32"} x={4} y={22} width={32} height={22} fill="#e8e4d8" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"2,26,28"} x={2} y={26} width={28} height={16} fill="#e8e4d8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"4,28,24"} x={4} y={28} width={24} height={14} fill="#c0bcb0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"52,22,32"} x={52} y={22} width={32} height={22} fill="#e8e4d8" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"58,26,28"} x={58} y={26} width={28} height={16} fill="#e8e4d8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"60,28,24"} x={60} y={28} width={24} height={14} fill="#c0bcb0" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v4,22"} x={4} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v10,22"} x={10} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v16,22"} x={16} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v22,22"} x={22} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v28,22"} x={28} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v56,22"} x={56} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v62,22"} x={62} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v68,22"} x={68} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v74,22"} x={74} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"v80,22"} x={80} y={22} width={1} height={22} fill="#c0bcb0" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"36,18,16"} x={36} y={18} width={16} height={12} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"38,20,12"} x={38} y={20} width={12} height={8} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"38,22,4"} x={38} y={22} width={4} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"46,22,4"} x={46} y={22} width={4} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"39,23,3"} x={39} y={23} width={3} height={3} fill="#1a1850" shapeRendering="crispEdges"/>,
      <rect key={"47,23,3"} x={47} y={23} width={3} height={3} fill="#1a1850" shapeRendering="crispEdges"/>,
      <rect key={"40,23,2"} x={40} y={23} width={2} height={2} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"48,23,2"} x={48} y={23} width={2} height={2} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"30,12,28"} x={30} y={12} width={28} height={4} fill="#f0d040" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"26,14,36"} x={26} y={14} width={36} height={2} fill="#f0d040" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"30,8,28"} x={30} y={8} width={28} height={4} fill="#f0d040" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"36,80,16"} x={36} y={80} width={16} height={68} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"38,72,12"} x={38} y={72} width={12} height={76} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"40,66,8"} x={40} y={66} width={8} height={82} fill="#505068" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"42,62,4"} x={42} y={62} width={4} height={86} fill="#404858" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"8,68,8"} x={8} y={68} width={8} height={80} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"4,72,16"} x={4} y={72} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"4,74,16"} x={4} y={74} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"4,76,16"} x={4} y={76} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"4,80,16"} x={4} y={80} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"4,82,16"} x={4} y={82} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"4,74,18"} x={4} y={74} width={18} height={10} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"6,80,14"} x={6} y={80} width={14} height={8} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"14,80,4"} x={14} y={80} width={4} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"16,84,4"} x={16} y={84} width={4} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"14,88,4"} x={14} y={88} width={4} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"16,92,4"} x={16} y={92} width={4} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"14,96,4"} x={14} y={96} width={4} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"14,78,4"} x={14} y={78} width={4} height={4} fill="#347840" shapeRendering="crispEdges"/>,
      <rect key={"12,76,4"} x={12} y={76} width={4} height={4} fill="#2a6020" shapeRendering="crispEdges"/>,
      <rect key={"p13,77"} x={13} y={77} width={1} height={1} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"72,68,8"} x={72} y={68} width={8} height={80} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"68,76,16"} x={68} y={76} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"68,80,16"} x={68} y={80} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"68,84,16"} x={68} y={84} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"68,88,16"} x={68} y={88} width={16} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"68,74,18"} x={68} y={74} width={18} height={10} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"68,68,4"} x={68} y={68} width={4} height={8} fill="#e84010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"70,68,4"} x={70} y={68} width={4} height={8} fill="#e84010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"72,68,4"} x={72} y={68} width={4} height={8} fill="#e84010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"74,68,4"} x={74} y={68} width={4} height={8} fill="#e84010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"76,68,4"} x={76} y={68} width={4} height={8} fill="#e84010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"78,68,4"} x={78} y={68} width={4} height={8} fill="#e84010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,68,4"} x={80} y={68} width={4} height={8} fill="#e84010" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"70,64,4"} x={70} y={64} width={4} height={6} fill="#f86820" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"74,64,4"} x={74} y={64} width={4} height={6} fill="#f86820" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"78,64,4"} x={78} y={64} width={4} height={6} fill="#f86820" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"58,92,14"} x={58} y={92} width={14} height={18} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"56,108,18"} x={56} y={108} width={18} height={30} fill="#d4a060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"60,88,10"} x={60} y={88} width={10} height={8} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"p61,90"} x={61} y={90} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p66,90"} x={66} y={90} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"16,90,14"} x={16} y={90} width={14} height={20} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"14,108,18"} x={14} y={108} width={18} height={32} fill="#d4a060" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"18,86,10"} x={18} y={86} width={10} height={8} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"14,82,18"} x={14} y={82} width={18} height={8} fill="#d0c080" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"p19,88"} x={19} y={88} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p24,88"} x={24} y={88} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The World": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#060a14" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#0a1028" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"0,0,20"} x={0} y={0} width={20} height={20} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"2,2,8"} x={2} y={2} width={8} height={10} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"4,2,10"} x={4} y={2} width={10} height={6} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"6,0,6"} x={6} y={0} width={6} height={8} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"2,8,6"} x={2} y={8} width={6} height={4} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"8,6,6"} x={8} y={6} width={6} height={4} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"p4,3"} x={4} y={3} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p5,3"} x={5} y={3} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"68,0,20"} x={68} y={0} width={20} height={20} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"70,2,12"} x={70} y={2} width={12} height={12} fill="#2a1a0a" shapeRendering="crispEdges"/>,
      <rect key={"72,0,8"} x={72} y={0} width={8} height={8} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"68,2,4"} x={68} y={2} width={4} height={6} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"82,2,4"} x={82} y={2} width={4} height={6} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"p74,3"} x={74} y={3} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p75,3"} x={75} y={3} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"0,128,20"} x={0} y={128} width={20} height={20} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"2,130,14"} x={2} y={130} width={14} height={12} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"0,128,10"} x={0} y={128} width={10} height={14} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"2,134,8"} x={2} y={134} width={8} height={6} fill="#fff880" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"p4,131"} x={4} y={131} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p5,131"} x={5} y={131} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"68,128,20"} x={68} y={128} width={20} height={20} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"72,130,12"} x={72} y={130} width={12} height={12} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"78,126,10"} x={78} y={126} width={10} height={14} fill="#c0bcb0" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"p74,131"} x={74} y={131} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p75,131"} x={75} y={131} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"14,8,60"} x={14} y={8} width={60} height={8} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"10,10,68"} x={10} y={10} width={68} height={6} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"8,12,72"} x={8} y={12} width={72} height={4} fill="#347840" shapeRendering="crispEdges"/>,
      <rect key={"14,134,60"} x={14} y={134} width={60} height={8} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"10,132,68"} x={10} y={132} width={68} height={6} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"8,130,72"} x={8} y={130} width={72} height={4} fill="#347840" shapeRendering="crispEdges"/>,
      <rect key={"4,14,8"} x={4} y={14} width={8} height={118} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"6,12,6"} x={6} y={12} width={6} height={122} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"8,10,4"} x={8} y={10} width={4} height={126} fill="#347840" shapeRendering="crispEdges"/>,
      <rect key={"76,14,8"} x={76} y={14} width={8} height={118} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"76,12,6"} x={76} y={12} width={6} height={122} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"80,10,4"} x={80} y={10} width={4} height={126} fill="#347840" shapeRendering="crispEdges"/>,
      <rect key={"12,10,6"} x={12} y={10} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"20,10,6"} x={20} y={10} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"28,10,6"} x={28} y={10} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"36,10,6"} x={36} y={10} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"44,10,6"} x={44} y={10} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"52,10,6"} x={52} y={10} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"60,10,6"} x={60} y={10} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"68,10,6"} x={68} y={10} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"12,132,6"} x={12} y={132} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"20,132,6"} x={20} y={132} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"28,132,6"} x={28} y={132} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"36,132,6"} x={36} y={132} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"44,132,6"} x={44} y={132} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"52,132,6"} x={52} y={132} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"60,132,6"} x={60} y={132} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"68,132,6"} x={68} y={132} width={6} height={4} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,18,4"} x={6} y={18} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,26,4"} x={6} y={26} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,34,4"} x={6} y={34} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,42,4"} x={6} y={42} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,50,4"} x={6} y={50} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,58,4"} x={6} y={58} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,66,4"} x={6} y={66} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,74,4"} x={6} y={74} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"6,82,4"} x={6} y={82} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,18,4"} x={78} y={18} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,26,4"} x={78} y={26} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,34,4"} x={78} y={34} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,42,4"} x={78} y={42} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,50,4"} x={78} y={50} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,58,4"} x={78} y={58} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,66,4"} x={78} y={66} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,74,4"} x={78} y={74} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"78,82,4"} x={78} y={82} width={4} height={6} fill="#4a9848" shapeRendering="crispEdges"/>,
      <rect key={"16,18,56"} x={16} y={18} width={56} height={6} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"16,128,56"} x={16} y={128} width={56} height={6} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"12,22,8"} x={12} y={22} width={8} height={104} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"68,22,8"} x={68} y={22} width={8} height={104} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"38,14,12"} x={38} y={14} width={12} height={8} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"38,130,12"} x={38} y={130} width={12} height={8} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"18,22,52"} x={18} y={22} width={52} height={104} fill="#0e1428" shapeRendering="crispEdges"/>,
      <rect key={"36,24,16"} x={36} y={24} width={16} height={14} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"38,26,12"} x={38} y={26} width={12} height={10} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"34,22,20"} x={34} y={22} width={20} height={6} fill="#d0c080" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"32,24,8"} x={32} y={24} width={8} height={8} fill="#c8b870" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"46,24,10"} x={46} y={24} width={10} height={8} fill="#c8b870" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"38,28,4"} x={38} y={28} width={4} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"46,28,4"} x={46} y={28} width={4} height={4} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"39,29,3"} x={39} y={29} width={3} height={3} fill="#1a2060" shapeRendering="crispEdges"/>,
      <rect key={"47,29,3"} x={47} y={29} width={3} height={3} fill="#1a2060" shapeRendering="crispEdges"/>,
      <rect key={"40,29,2"} x={40} y={29} width={2} height={2} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"48,29,2"} x={48} y={29} width={2} height={2} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"40,34,6"} x={40} y={34} width={6} height={3} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"34,38,20"} x={34} y={38} width={20} height={28} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"36,40,16"} x={36} y={40} width={16} height={24} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"30,42,8"} x={30} y={42} width={8} height={16} fill="#1e0a38" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"50,44,8"} x={50} y={44} width={8} height={14} fill="#1e0a38" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"16,30,18"} x={16} y={30} width={18} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"14,28,10"} x={14} y={28} width={10} height={8} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"54,36,18"} x={54} y={36} width={18} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"68,34,10"} x={68} y={34} width={10} height={8} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"v14,22"} x={14} y={22} width={1} height={22} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"p14,21"} x={14} y={21} width={1} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"v72,28"} x={72} y={28} width={1} height={20} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"p72,27"} x={72} y={27} width={1} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"36,66,10"} x={36} y={66} width={10} height={22} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"42,70,10"} x={42} y={70} width={10} height={20} fill="#d4a060" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"36,86,10"} x={36} y={86} width={10} height={8} fill="#e8b83a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"22,50,14"} x={22} y={50} width={14} height={16} fill="#1e0a38" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"52,52,14"} x={52} y={52} width={14} height={14} fill="#1e0a38" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"p20,24"} x={20} y={24} width={1} height={1} fill="#e8d5a3" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"p70,30"} x={70} y={30} width={1} height={1} fill="#e8d5a3" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"p20,80"} x={20} y={80} width={1} height={1} fill="#e8d5a3" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"p72,90"} x={72} y={90} width={1} height={1} fill="#e8d5a3" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"p44,100"} x={44} y={100} width={1} height={1} fill="#e8d5a3" opacity={0.4} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Hierophant": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#080c24" shapeRendering="crispEdges"/>,
      <rect key={"16,0,56"} x={16} y={0} width={56} height={148} fill="#1e0a38" opacity={0.35} shapeRendering="crispEdges"/>,
      <rect key={"20,0,48"} x={20} y={0} width={48} height={148} fill="#2e1650" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"2,8,16"} x={2} y={8} width={16} height={140} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"4,10,12"} x={4} y={10} width={12} height={136} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"6,12,8"} x={6} y={12} width={8} height={132} fill="#1e0a38" shapeRendering="crispEdges"/>,
      <rect key={"0,6,18"} x={0} y={6} width={18} height={6} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"0,140,18"} x={0} y={140} width={18} height={6} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"0,8,18"} x={0} y={8} width={18} height={10} fill="#2a1848" shapeRendering="crispEdges"/>,
      <rect key={"2,10,14"} x={2} y={10} width={14} height={6} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"2,10,3"} x={2} y={10} width={3} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"6,10,3"} x={6} y={10} width={3} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"10,10,3"} x={10} y={10} width={3} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"14,10,3"} x={14} y={10} width={3} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"0,136,18"} x={0} y={136} width={18} height={12} fill="#2a1848" shapeRendering="crispEdges"/>,
      <rect key={"2,138,14"} x={2} y={138} width={14} height={6} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"6,28,8"} x={6} y={28} width={8} height={4} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"6,34,8"} x={6} y={34} width={8} height={4} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"6,40,8"} x={6} y={40} width={8} height={4} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"70,8,16"} x={70} y={8} width={16} height={140} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"72,10,12"} x={72} y={10} width={12} height={136} fill="#2e1650" shapeRendering="crispEdges"/>,
      <rect key={"74,12,8"} x={74} y={12} width={8} height={132} fill="#1e0a38" shapeRendering="crispEdges"/>,
      <rect key={"70,6,18"} x={70} y={6} width={18} height={6} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"70,140,18"} x={70} y={140} width={18} height={6} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"70,8,18"} x={70} y={8} width={18} height={10} fill="#2a1848" shapeRendering="crispEdges"/>,
      <rect key={"72,10,14"} x={72} y={10} width={14} height={6} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"72,10,3"} x={72} y={10} width={3} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"76,10,3"} x={76} y={10} width={3} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"80,10,3"} x={80} y={10} width={3} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"84,10,3"} x={84} y={10} width={3} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"70,136,18"} x={70} y={136} width={18} height={12} fill="#2a1848" shapeRendering="crispEdges"/>,
      <rect key={"72,138,14"} x={72} y={138} width={14} height={6} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"72,28,10"} x={72} y={28} width={10} height={4} fill="#e8b83a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"78,28,4"} x={78} y={28} width={4} height={20} fill="#e8b83a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"72,44,6"} x={72} y={44} width={6} height={4} fill="#e8b83a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"22,2,44"} x={22} y={2} width={44} height={6} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"20,6,48"} x={20} y={6} width={48} height={8} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"18,12,52"} x={18} y={12} width={52} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"22,0,6"} x={22} y={0} width={6} height={10} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"30,0,6"} x={30} y={0} width={6} height={10} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"38,0,6"} x={38} y={0} width={6} height={10} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"46,0,6"} x={46} y={0} width={6} height={10} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"54,0,6"} x={54} y={0} width={6} height={10} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"60,0,6"} x={60} y={0} width={6} height={10} fill="#e8b83a" shapeRendering="crispEdges"/>,
      <rect key={"26,-2,4"} x={26} y={-2} width={4} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"34,-2,4"} x={34} y={-2} width={4} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"42,-2,4"} x={42} y={-2} width={4} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"50,-2,4"} x={50} y={-2} width={4} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"58,-2,4"} x={58} y={-2} width={4} height={8} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"24,4,40"} x={24} y={4} width={40} height={4} fill="#f0d040" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"24,58,40"} x={24} y={58} width={40} height={80} fill="#102888" shapeRendering="crispEdges"/>,
      <rect key={"26,60,36"} x={26} y={60} width={36} height={76} fill="#1a3ea8" shapeRendering="crispEdges"/>,
      <rect key={"28,62,32"} x={28} y={62} width={32} height={72} fill="#1a3090" shapeRendering="crispEdges"/>,
      <rect key={"32,58,24"} x={32} y={58} width={24} height={80} fill="#c8941a" opacity={0.2} shapeRendering="crispEdges"/>,
      <rect key={"34,60,20"} x={34} y={60} width={20} height={76} fill="#c8941a" opacity={0.15} shapeRendering="crispEdges"/>,
      <rect key={"36,58,16"} x={36} y={58} width={16} height={80} fill="#e8e4d8" opacity={0.35} shapeRendering="crispEdges"/>,
      <rect key={"38,60,12"} x={38} y={60} width={12} height={76} fill="#f4eed8" opacity={0.25} shapeRendering="crispEdges"/>,
      <rect key={"24,134,40"} x={24} y={134} width={40} height={6} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"22,136,44"} x={22} y={136} width={44} height={4} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"v28,22"} x={28} y={22} width={1} height={106} fill="#7a5010" shapeRendering="crispEdges"/>,
      <rect key={"22,30,18"} x={22} y={30} width={18} height={4} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"24,40,14"} x={24} y={40} width={14} height={4} fill="#c8941a" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"26,50,10"} x={26} y={50} width={10} height={4} fill="#c8941a" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"20,28,20"} x={20} y={28} width={20} height={6} fill="#e8b83a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"22,38,16"} x={22} y={38} width={16} height={6} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"24,48,12"} x={24} y={48} width={12} height={6} fill="#e8b83a" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"30,28,28"} x={30} y={28} width={28} height={24} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"32,30,24"} x={32} y={30} width={24} height={20} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"28,26,32"} x={28} y={26} width={32} height={8} fill="#c0bcb0" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"30,24,28"} x={30} y={24} width={28} height={4} fill="#e8e4d8" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"22,18,44"} x={22} y={18} width={44} height={12} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"32,34,8"} x={32} y={34} width={8} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"48,34,8"} x={48} y={34} width={8} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"33,35,6"} x={33} y={35} width={6} height={5} fill="#1a3060" shapeRendering="crispEdges"/>,
      <rect key={"49,35,6"} x={49} y={35} width={6} height={5} fill="#1a3060" shapeRendering="crispEdges"/>,
      <rect key={"34,35,4"} x={34} y={35} width={4} height={4} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"50,35,4"} x={50} y={35} width={4} height={4} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"34,34,4"} x={34} y={34} width={4} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"50,34,4"} x={50} y={34} width={4} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"32,32,8"} x={32} y={32} width={8} height={3} fill="#805020" shapeRendering="crispEdges"/>,
      <rect key={"48,32,8"} x={48} y={32} width={8} height={3} fill="#805020" shapeRendering="crispEdges"/>,
      <rect key={"42,42,4"} x={42} y={42} width={4} height={4} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"40,45,3"} x={40} y={45} width={3} height={3} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"45,45,3"} x={45} y={45} width={3} height={3} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"36,50,16"} x={36} y={50} width={16} height={4} fill="#8a3828" shapeRendering="crispEdges"/>,
      <rect key={"38,52,12"} x={38} y={52} width={12} height={4} fill="#a04838" shapeRendering="crispEdges"/>,
      <rect key={"30,52,28"} x={30} y={52} width={28} height={8} fill="#e8e4d8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"30,52,3"} x={30} y={52} width={3} height={10} fill="#d8d4c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"34,52,3"} x={34} y={52} width={3} height={10} fill="#d8d4c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"38,52,3"} x={38} y={52} width={3} height={10} fill="#d8d4c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"42,52,3"} x={42} y={52} width={3} height={10} fill="#d8d4c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"46,52,3"} x={46} y={52} width={3} height={10} fill="#d8d4c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"50,52,3"} x={50} y={52} width={3} height={10} fill="#d8d4c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"54,52,3"} x={54} y={52} width={3} height={10} fill="#d8d4c8" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v38,114"} x={38} y={114} width={1} height={22} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"v50,114"} x={50} y={114} width={1} height={22} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"h128,22"} x={22} y={128} width={44} height={1} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"h122,22"} x={22} y={122} width={44} height={1} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"32,112,12"} x={32} y={112} width={12} height={8} fill="#c8941a" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"44,112,12"} x={44} y={112} width={12} height={8} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"34,110,8"} x={34} y={110} width={8} height={4} fill="#e8b83a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"46,110,8"} x={46} y={110} width={8} height={4} fill="#e8b83a" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"18,110,14"} x={18} y={110} width={14} height={18} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"16,124,18"} x={16} y={124} width={18} height={18} fill="#3c2068" shapeRendering="crispEdges"/>,
      <rect key={"20,108,8"} x={20} y={108} width={8} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"p21,109"} x={21} y={109} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p22,109"} x={22} y={109} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"56,110,14"} x={56} y={110} width={14} height={18} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"56,124,16"} x={56} y={124} width={16} height={18} fill="#c03020" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"58,108,8"} x={58} y={108} width={8} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"p60,109"} x={60} y={109} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p61,109"} x={61} y={109} width={1} height={1} fill="#080408" shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "The Hanged Man": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#080c14" shapeRendering="crispEdges"/>,
      <rect key={"6,10,16"} x={6} y={10} width={16} height={130} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"8,12,12"} x={8} y={12} width={12} height={128} fill="#3a2010" shapeRendering="crispEdges"/>,
      <rect key={"10,14,8"} x={10} y={14} width={8} height={124} fill="#2a1808" shapeRendering="crispEdges"/>,
      <rect key={"66,10,16"} x={66} y={10} width={16} height={130} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"68,12,12"} x={68} y={12} width={12} height={128} fill="#3a2010" shapeRendering="crispEdges"/>,
      <rect key={"70,14,8"} x={70} y={14} width={8} height={124} fill="#2a1808" shapeRendering="crispEdges"/>,
      <rect key={"2,12,8"} x={2} y={12} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"2,20,8"} x={2} y={20} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"2,28,8"} x={2} y={28} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"2,36,8"} x={2} y={36} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"2,44,8"} x={2} y={44} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"2,52,8"} x={2} y={52} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"2,60,8"} x={2} y={60} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"2,68,8"} x={2} y={68} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"0,14,6"} x={0} y={14} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"0,22,6"} x={0} y={22} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"0,30,6"} x={0} y={30} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"0,38,6"} x={0} y={38} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"0,46,6"} x={0} y={46} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"0,54,6"} x={0} y={54} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"0,62,6"} x={0} y={62} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"0,70,6"} x={0} y={70} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"4,10,4"} x={4} y={10} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,18,4"} x={4} y={18} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,26,4"} x={4} y={26} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,34,4"} x={4} y={34} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,42,4"} x={4} y={42} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,50,4"} x={4} y={50} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,58,4"} x={4} y={58} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"4,66,4"} x={4} y={66} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"78,12,8"} x={78} y={12} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"78,20,8"} x={78} y={20} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"78,28,8"} x={78} y={28} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"78,36,8"} x={78} y={36} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"78,44,8"} x={78} y={44} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"78,52,8"} x={78} y={52} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"78,60,8"} x={78} y={60} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"78,68,8"} x={78} y={68} width={8} height={4} fill="#245828" shapeRendering="crispEdges"/>,
      <rect key={"82,14,6"} x={82} y={14} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"82,22,6"} x={82} y={22} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"82,30,6"} x={82} y={30} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"82,38,6"} x={82} y={38} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"82,46,6"} x={82} y={46} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"82,54,6"} x={82} y={54} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"82,62,6"} x={82} y={62} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"82,70,6"} x={82} y={70} width={6} height={4} fill="#183818" shapeRendering="crispEdges"/>,
      <rect key={"80,10,4"} x={80} y={10} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,18,4"} x={80} y={18} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,26,4"} x={80} y={26} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,34,4"} x={80} y={34} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,42,4"} x={80} y={42} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,50,4"} x={80} y={50} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,58,4"} x={80} y={58} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"80,66,4"} x={80} y={66} width={4} height={4} fill="#4a9848" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"6,10,76"} x={6} y={10} width={76} height={14} fill="#1a0e06" shapeRendering="crispEdges"/>,
      <rect key={"8,12,72"} x={8} y={12} width={72} height={10} fill="#3a2010" shapeRendering="crispEdges"/>,
      <rect key={"10,14,68"} x={10} y={14} width={68} height={6} fill="#2a1808" shapeRendering="crispEdges"/>,
      <rect key={"h16,10"} x={10} y={16} width={6} height={1} fill="#1a0e06" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"h16,20"} x={20} y={16} width={6} height={1} fill="#1a0e06" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"h16,30"} x={30} y={16} width={6} height={1} fill="#1a0e06" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"h16,40"} x={40} y={16} width={6} height={1} fill="#1a0e06" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"h16,50"} x={50} y={16} width={6} height={1} fill="#1a0e06" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"h16,60"} x={60} y={16} width={6} height={1} fill="#1a0e06" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"h16,70"} x={70} y={16} width={6} height={1} fill="#1a0e06" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"42,14,4"} x={42} y={14} width={4} height={18} fill="#404858" shapeRendering="crispEdges"/>,
      <rect key={"43,14,2"} x={43} y={14} width={2} height={18} fill="#687080" shapeRendering="crispEdges"/>,
      <rect key={"26,36,36"} x={26} y={36} width={36} height={4} fill="#f0d040" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"22,38,44"} x={22} y={38} width={44} height={4} fill="#f0d040" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"18,40,52"} x={18} y={40} width={52} height={4} fill="#f0d040" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"16,42,56"} x={16} y={42} width={56} height={4} fill="#f0d040" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"18,44,52"} x={18} y={44} width={52} height={4} fill="#f0d040" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"22,46,44"} x={22} y={46} width={44} height={2} fill="#f0d040" opacity={0.2} shapeRendering="crispEdges"/>,
      <rect key={"32,38,24"} x={32} y={38} width={24} height={20} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"34,40,20"} x={34} y={40} width={20} height={16} fill="#e8c090" shapeRendering="crispEdges"/>,
      <rect key={"35,42,8"} x={35} y={42} width={8} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"49,42,8"} x={49} y={42} width={8} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"36,43,6"} x={36} y={43} width={6} height={5} fill="#1a3060" shapeRendering="crispEdges"/>,
      <rect key={"50,43,6"} x={50} y={43} width={6} height={5} fill="#1a3060" shapeRendering="crispEdges"/>,
      <rect key={"37,43,4"} x={37} y={43} width={4} height={4} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"51,43,4"} x={51} y={43} width={4} height={4} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"40,50,8"} x={40} y={50} width={8} height={4} fill="#a07030" shapeRendering="crispEdges"/>,
      <rect key={"38,56,12"} x={38} y={56} width={12} height={4} fill="#8a3828" shapeRendering="crispEdges"/>,
      <rect key={"30,58,28"} x={30} y={58} width={28} height={10} fill="#d0c080" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"32,62,24"} x={32} y={62} width={24} height={8} fill="#c0b070" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"36,68,16"} x={36} y={68} width={16} height={6} fill="#b0a060" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"28,32,32"} x={28} y={32} width={32} height={36} fill="#102888" shapeRendering="crispEdges"/>,
      <rect key={"30,34,28"} x={30} y={34} width={28} height={32} fill="#1a3ea8" shapeRendering="crispEdges"/>,
      <rect key={"32,36,24"} x={32} y={36} width={24} height={28} fill="#1a3898" shapeRendering="crispEdges"/>,
      <rect key={"24,32,8"} x={24} y={32} width={8} height={16} fill="#102888" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"56,32,8"} x={56} y={32} width={8} height={16} fill="#102888" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"36,66,12"} x={36} y={66} width={12} height={30} fill="#c03020" shapeRendering="crispEdges"/>,
      <rect key={"38,68,8"} x={38} y={68} width={8} height={28} fill="#e04030" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"44,70,10"} x={44} y={70} width={10} height={14} fill="#c03020" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"48,80,10"} x={48} y={80} width={10} height={12} fill="#c03020" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"34,96,12"} x={34} y={96} width={12} height={6} fill="#3a2010" shapeRendering="crispEdges"/>,
      <rect key={"18,56,14"} x={18} y={56} width={14} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"56,56,14"} x={56} y={56} width={14} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"16,56,8"} x={16} y={56} width={8} height={4} fill="#102888" shapeRendering="crispEdges"/>,
      <rect key={"64,56,8"} x={64} y={56} width={8} height={4} fill="#102888" shapeRendering="crispEdges"/>,
      <rect key={"18,60,10"} x={18} y={60} width={10} height={8} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"60,60,10"} x={60} y={60} width={10} height={8} fill="#d4a060" shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  case "Death": return <svg {...svgP}>{[
      <rect key={"0,0,88"} x={0} y={0} width={88} height={148} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"0,0,88"} x={0} y={0} width={88} height={100} fill="#0c0a1a" shapeRendering="crispEdges"/>,
      <rect key={"26,88,36"} x={26} y={88} width={36} height={4} fill="#c8941a" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"22,92,44"} x={22} y={92} width={44} height={4} fill="#f0d040" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"18,96,52"} x={18} y={96} width={52} height={8} fill="#f0d040" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"14,100,60"} x={14} y={100} width={60} height={8} fill="#f86820" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"10,106,68"} x={10} y={106} width={68} height={6} fill="#e84010" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"30,78,28"} x={30} y={78} width={28} height={20} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"28,82,32"} x={28} y={82} width={32} height={12} fill="#fff880" shapeRendering="crispEdges"/>,
      <rect key={"32,80,24"} x={32} y={80} width={24} height={12} fill="#fff880" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"34,78,20"} x={34} y={78} width={20} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"34,96,20"} x={34} y={96} width={20} height={4} fill="#f0d040" shapeRendering="crispEdges"/>,
      <rect key={"0,110,88"} x={0} y={110} width={88} height={38} fill="#0a1828" shapeRendering="crispEdges"/>,
      <rect key={"0,114,88"} x={0} y={114} width={88} height={34} fill="#142240" shapeRendering="crispEdges"/>,
      <rect key={"0,118,88"} x={0} y={118} width={88} height={30} fill="#1c2e50" shapeRendering="crispEdges"/>,
      <rect key={"0,110,6"} x={0} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"8,110,6"} x={8} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"16,110,6"} x={16} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"24,110,6"} x={24} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"32,110,6"} x={32} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"40,110,6"} x={40} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"48,110,6"} x={48} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"56,110,6"} x={56} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"64,110,6"} x={64} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"72,110,6"} x={72} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"80,110,6"} x={80} y={110} width={6} height={4} fill="#2a4060" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"4,116,6"} x={4} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"12,116,6"} x={12} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"20,116,6"} x={20} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"28,116,6"} x={28} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"36,116,6"} x={36} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"44,116,6"} x={44} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"52,116,6"} x={52} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"60,116,6"} x={60} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"68,116,6"} x={68} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"76,116,6"} x={76} y={116} width={6} height={3} fill="#1c3050" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"0,38,18"} x={0} y={38} width={18} height={110} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"2,36,14"} x={2} y={36} width={14} height={112} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"4,38,10"} x={4} y={38} width={10} height={108} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"0,36,4"} x={0} y={36} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"4,36,4"} x={4} y={36} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"4,54,10"} x={4} y={54} width={10} height={14} fill="#f0d040" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"5,55,8"} x={5} y={55} width={8} height={12} fill="#fff880" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"4,80,10"} x={4} y={80} width={10} height={14} fill="#f0d040" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"70,38,18"} x={70} y={38} width={18} height={110} fill="#282838" shapeRendering="crispEdges"/>,
      <rect key={"72,36,14"} x={72} y={36} width={14} height={112} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"74,38,10"} x={74} y={38} width={10} height={108} fill="#38384a" shapeRendering="crispEdges"/>,
      <rect key={"70,36,4"} x={70} y={36} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"74,36,4"} x={74} y={36} width={4} height={8} fill="#505068" shapeRendering="crispEdges"/>,
      <rect key={"74,54,10"} x={74} y={54} width={10} height={14} fill="#f0d040" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"75,55,8"} x={75} y={55} width={8} height={12} fill="#fff880" opacity={0.3} shapeRendering="crispEdges"/>,
      <rect key={"74,80,10"} x={74} y={80} width={10} height={14} fill="#f0d040" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"28,108,32"} x={28} y={108} width={32} height={12} fill="#1a1408" shapeRendering="crispEdges"/>,
      <rect key={"32,104,24"} x={32} y={104} width={24} height={8} fill="#221c10" shapeRendering="crispEdges"/>,
      <rect key={"34,100,20"} x={34} y={100} width={20} height={6} fill="#2a2412" shapeRendering="crispEdges"/>,
      <rect key={"14,66,40"} x={14} y={66} width={40} height={36} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"16,68,36"} x={16} y={68} width={36} height={32} fill="#f4eed8" shapeRendering="crispEdges"/>,
      <rect key={"18,70,32"} x={18} y={70} width={32} height={28} fill="#e8e4d8" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"46,54,16"} x={46} y={54} width={16} height={22} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"48,52,12"} x={48} y={52} width={12} height={10} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"50,50,10"} x={50} y={50} width={10} height={8} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"52,48,8"} x={52} y={48} width={8} height={6} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"58,58,4"} x={58} y={58} width={4} height={4} fill="#d8c8c0" shapeRendering="crispEdges"/>,
      <rect key={"58,60,3"} x={58} y={60} width={3} height={3} fill="#c0a8a0" shapeRendering="crispEdges"/>,
      <rect key={"54,52,4"} x={54} y={52} width={4} height={4} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p55,52"} x={55} y={52} width={1} height={1} fill="#9098a8" shapeRendering="crispEdges"/>,
      <rect key={"46,50,8"} x={46} y={50} width={8} height={20} fill="#d8d4c8" shapeRendering="crispEdges"/>,
      <rect key={"44,52,6"} x={44} y={52} width={6} height={18} fill="#c8c4b8" shapeRendering="crispEdges"/>,
      <rect key={"42,54,4"} x={42} y={54} width={4} height={14} fill="#b8b4a8" shapeRendering="crispEdges"/>,
      <rect key={"14,96,8"} x={14} y={96} width={8} height={26} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"22,98,8"} x={22} y={98} width={8} height={24} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"30,96,8"} x={30} y={96} width={8} height={26} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"38,98,8"} x={38} y={98} width={8} height={24} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"14,120,8"} x={14} y={120} width={8} height={6} fill="#404040" shapeRendering="crispEdges"/>,
      <rect key={"22,120,8"} x={22} y={120} width={8} height={6} fill="#404040" shapeRendering="crispEdges"/>,
      <rect key={"30,120,8"} x={30} y={120} width={8} height={6} fill="#404040" shapeRendering="crispEdges"/>,
      <rect key={"38,120,8"} x={38} y={120} width={8} height={6} fill="#404040" shapeRendering="crispEdges"/>,
      <rect key={"42,22,18"} x={42} y={22} width={18} height={16} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"44,20,14"} x={44} y={20} width={14} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"42,24,18"} x={42} y={24} width={18} height={12} fill="#f4eed8" shapeRendering="crispEdges"/>,
      <rect key={"44,26,6"} x={44} y={26} width={6} height={6} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"52,26,6"} x={52} y={26} width={6} height={6} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"p46,27"} x={46} y={27} width={1} height={1} fill="#404858" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"p54,27"} x={54} y={27} width={1} height={1} fill="#404858" opacity={0.5} shapeRendering="crispEdges"/>,
      <rect key={"44,36,14"} x={44} y={36} width={14} height={4} fill="#c0bcb0" shapeRendering="crispEdges"/>,
      <rect key={"44,36,3"} x={44} y={36} width={3} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"48,36,3"} x={48} y={36} width={3} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"52,36,3"} x={52} y={36} width={3} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"56,36,3"} x={56} y={36} width={3} height={6} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"38,38,22"} x={38} y={38} width={22} height={30} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"40,40,18"} x={40} y={40} width={18} height={26} fill="#141018" shapeRendering="crispEdges"/>,
      <rect key={"34,44,30"} x={34} y={44} width={30} height={18} fill="#0e0c14" shapeRendering="crispEdges"/>,
      <rect key={"40,40,4"} x={40} y={40} width={4} height={4} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"54,40,4"} x={54} y={40} width={4} height={4} fill="#282838" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"22,42,20"} x={22} y={42} width={20} height={40} fill="#0a0810" shapeRendering="crispEdges"/>,
      <rect key={"20,44,14"} x={20} y={44} width={14} height={36} fill="#080608" shapeRendering="crispEdges"/>,
      <rect key={"v18,14"} x={18} y={14} width={1} height={52} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"18,14,32"} x={18} y={14} width={32} height={24} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"20,16,28"} x={20} y={16} width={28} height={20} fill="#e8e4d8" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"28,20,12"} x={28} y={20} width={12} height={12} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"26,22,16"} x={26} y={22} width={16} height={8} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"30,18,8"} x={30} y={18} width={8} height={16} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"30,22,8"} x={30} y={22} width={8} height={8} fill="#080408" shapeRendering="crispEdges"/>,
      <rect key={"32,24,4"} x={32} y={24} width={4} height={4} fill="#1a1018" shapeRendering="crispEdges"/>,
      <rect key={"66,96,16"} x={66} y={96} width={16} height={14} fill="#c8941a" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"68,94,10"} x={68} y={94} width={10} height={6} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"66,102,20"} x={66} y={102} width={20} height={10} fill="#c03020" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"68,92,8"} x={68} y={92} width={8} height={4} fill="#c8941a" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"p70,91"} x={70} y={91} width={1} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"p72,91"} x={72} y={91} width={1} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"p74,91"} x={74} y={91} width={1} height={1} fill="#c8941a" shapeRendering="crispEdges"/>,
      <rect key={"2,96,14"} x={2} y={96} width={14} height={16} fill="#e8e4d8" opacity={0.9} shapeRendering="crispEdges"/>,
      <rect key={"4,92,10"} x={4} y={92} width={10} height={8} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"2,88,12"} x={2} y={88} width={12} height={8} fill="#e8e4d8" opacity={0.8} shapeRendering="crispEdges"/>,
      <rect key={"4,86,8"} x={4} y={86} width={8} height={4} fill="#c8941a" opacity={0.7} shapeRendering="crispEdges"/>,
      <rect key={"58,100,12"} x={58} y={100} width={12} height={14} fill="#e8e4d8" shapeRendering="crispEdges"/>,
      <rect key={"60,96,8"} x={60} y={96} width={8} height={8} fill="#d4a060" shapeRendering="crispEdges"/>,
      <rect key={"60,94,8"} x={60} y={94} width={8} height={4} fill="#d0c080" opacity={0.6} shapeRendering="crispEdges"/>,
      <rect key={"8,132,6"} x={8} y={132} width={6} height={4} fill="#e8e4d8" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"24,132,6"} x={24} y={132} width={6} height={4} fill="#e8e4d8" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"40,132,6"} x={40} y={132} width={6} height={4} fill="#e8e4d8" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"56,132,6"} x={56} y={132} width={6} height={4} fill="#e8e4d8" opacity={0.4} shapeRendering="crispEdges"/>,
      <rect key={"72,132,6"} x={72} y={132} width={6} height={4} fill="#e8e4d8" opacity={0.4} shapeRendering="crispEdges"/>
    ]}<Bdr/></svg>;

  default: return null;
  }
}

function CardSlot({card,revealed,animating,onDraw,onInfo}){
  const lvlBorder=card?({high:'#8b1a1a',mid:'#8b7018',low:'#1a5080'}[card.level]||'#c8941a'):'#c8941a';
  if(!revealed||!card){
    return(
      <div className="card-slot" onClick={onDraw} style={{cursor:'pointer'}}>
        <div className="card-back"><span style={{fontSize:24}}>🌑</span></div>
        <div className="card-inner"/>
      </div>
    );
  }
  const shortName=card.name==='The Wheel of Fortune'?'WHEEL OF\nFORTUNE':card.name.toUpperCase();
  return(
    <div className={`card-slot${animating?' wipe':''}`} onClick={onInfo} style={{borderColor:lvlBorder,cursor:'pointer',overflow:'hidden',position:'relative'}}>
      <CardArt name={card.name}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(0deg,rgba(7,4,15,.95) 0%,rgba(7,4,15,.4) 70%,transparent 100%)',padding:'18px 2px 3px',pointerEvents:'none'}}>
        <div className="vt" style={{fontSize:9,color:'#c8941a',textAlign:'center',lineHeight:1.2,whiteSpace:'pre-line'}}>{shortName}</div>
      </div>
      <div className="card-inner" style={{borderColor:lvlBorder+'70'}}/>
    </div>
  );
}

const PARAM_INTROS = [
  {id:'automation', emoji:'⚙️', name:'AI Automation\nDepth', short:'How far down the automation stack organisations actually reach.', cite:'Dan Shapiro\'s five-level framework, METR Time Horizons benchmark'},
  {id:'judgment',   emoji:'🧠', name:'Judgment\nErosion',    short:'Whether the pipeline of people capable of supervising AI output is intact.', cite:'Anthropic & METR RCTs — 17% skill drop, 43-point perception gap'},
  {id:'jevons',     emoji:'⚖️', name:'Jevons\nIntensity',    short:'Whether AI efficiency gains land as relief or immediately raise expected output.', cite:'HBR workplace research, Jevons Paradox, Anthropic internal data'},
  {id:'roles',      emoji:'🎭', name:'Role\nDissolution',    short:'Whether the PM / designer / engineer trinity holds, blurs, or collapses.', cite:'Maggie Appleton, Andrew Chen, Dan Shapiro on Level 4'},
  {id:'memory',     emoji:'📜', name:'Institutional\nMemory', short:'How successfully tacit knowledge of why systems work survives.', cite:'John Salvatier, AWS Kiro incident, Missing Rungs thesis'},
];

function IntroScreen({onBegin,onParamInfo}){
  return(
    <div className="scanlines" style={{minHeight:'100vh',background:'radial-gradient(ellipse at 50% 40%,#130d26 0%,#07040f 70%)',overflow:'auto'}}>
      {/* ── ABOVE FOLD: hero + CTA ── */}
      <div style={{height:'88vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px 20px 16px',textAlign:'center'}}>
        {/* Title row with candles on either side */}
        <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:8}}>
          <Candle/>
          <h1 className="cinzel title-pulse" style={{fontSize:'clamp(20px,5vw,44px)',color:'#c8941a',letterSpacing:'5px',textShadow:'0 0 20px rgba(200,148,26,.4)',margin:0}}>THE DIGITAL SÉANCE</h1>
          <Candle/>
        </div>
        <p className="vt" style={{fontSize:13,color:'#7a6a4a',letterSpacing:'3px',marginBottom:24}}>A TAROT READING FOR THE AI AGE</p>
        <CrystalBall active={false}/>
        <div className="fell" style={{maxWidth:580,margin:'22px auto 0',lineHeight:1.85,fontSize:15,color:'#c8b890',textAlign:'left'}}>
          <p style={{marginBottom:14}}>Every week there is another confident take about which role AI will kill next, and almost none of them take into account that the future depends on several things being simultaneously true, and those things are moving independently of each other. I work in the digital industry. I read the research. And the honest conclusion is that nobody knows, including me.</p>
          <p style={{marginBottom:14}}>So I extracted five parameters that seemed to matter most (read about them below). These might not be the right five. There are probably more. Each parameter has three possible outcomes, represented by a tarot card. Draw the five cards and you get a combination that describes a specific, plausible near-future world: just a possible scenario. I did not build all 243 options, only the combinations that were strange enough, or uncomfortable, or honest in a very 'dull' way how the real world sometimes plays out.</p>
          <p style={{fontStyle:'italic',color:'#a89870',fontSize:14}}>The tarot framing is not a joke, or … not only a joke. It is the most honest metaphor I could find for this exploration of things that are genuinely uncertain.</p>
        </div>
        <button className="btn" onClick={onBegin} style={{marginTop:28}}>Begin the Séance</button>
        <p className="vt" style={{color:'#c8941a',fontSize:13,letterSpacing:'3px',marginTop:18,opacity:.7}}>↓ THE FIVE PARAMETERS</p>
      </div>
      {/* ── BELOW FOLD: parameter grid ── */}
      <div style={{padding:'0 20px 56px',maxWidth:860,margin:'0 auto'}}>
        <div style={{height:1,background:'linear-gradient(90deg,transparent,#c8941a50,transparent)',marginBottom:28}}/>
        <p className="vt" style={{color:'#c8941a',fontSize:13,letterSpacing:'3px',textAlign:'center',marginBottom:20}}>THE FIVE PARAMETERS — CLICK FOR DETAIL</p>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center'}}>
          {PARAM_INTROS.map(p=>(
            <button key={p.id} onClick={()=>onParamInfo(p.id)} style={{background:'rgba(200,148,26,.04)',border:'1px solid rgba(200,148,26,.2)',padding:'14px 12px',flex:'1 1 140px',maxWidth:180,cursor:'pointer',textAlign:'left',display:'flex',flexDirection:'column',gap:6}}>
              <span style={{fontSize:22}}>{p.emoji}</span>
              <span className="vt" style={{color:'#c8941a',fontSize:12,letterSpacing:'1px',lineHeight:1.3,whiteSpace:'pre-line'}}>{p.name.toUpperCase()}</span>
              <span className="fell" style={{color:'#c8b890',fontSize:12,lineHeight:1.5}}>{p.short}</span>
              <span className="fell" style={{color:'#5a4a30',fontSize:11,fontStyle:'italic',lineHeight:1.4,marginTop:2}}>{p.cite}</span>
              <span className="vt" style={{color:'#c8941a60',fontSize:11,marginTop:4}}>MORE →</span>
            </button>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:36}}>
          <div style={{display:'flex',gap:40,justifyContent:'center',marginBottom:0}}>
            <Candle/><Candle/>
          </div>
        </div>
      </div>
    </div>
  );
}

function CurtainScene({onDone}){
  useEffect(()=>{const t=setTimeout(onDone,1100);return()=>clearTimeout(t)},[]);
  const rod='linear-gradient(180deg,#7a5010 0%,#c8941a 30%,#f0cc50 50%,#c8941a 70%,#7a5010 100%)';
  // Texture layers as child divs — never on the animated element itself
  const foldTex='repeating-linear-gradient(90deg,rgba(0,0,0,.22) 0px,rgba(0,0,0,.22) 2px,transparent 2px,transparent 22px,rgba(255,255,255,.06) 22px,rgba(255,255,255,.06) 24px,transparent 24px,transparent 44px)';
  const sheen='linear-gradient(90deg,rgba(0,0,0,.35) 0%,transparent 18%,rgba(255,255,255,.06) 30%,transparent 55%,rgba(0,0,0,.25) 100%)';
  const curtainStyle={position:'absolute',top:0,left:0,right:0,bottom:0,pointerEvents:'none'};
  return(
    <div style={{position:'fixed',inset:0,overflow:'hidden',background:'#07040f'}}>
      {/* Left panel — solid dark burgundy crimson, children add texture */}
      <div className="curt-l" style={{position:'absolute',top:0,left:0,width:'50%',height:'100%',background:'#7a0818',zIndex:1}}>
        <div style={{...curtainStyle,backgroundImage:foldTex}}/>
        <div style={{...curtainStyle,backgroundImage:sheen}}/>
        <div style={{...curtainStyle,boxShadow:'inset -20px 0 40px rgba(0,0,0,.5)'}}/>
      </div>
      {/* Right panel */}
      <div className="curt-r" style={{position:'absolute',top:0,right:0,width:'50%',height:'100%',background:'#7a0818',zIndex:1}}>
        <div style={{...curtainStyle,backgroundImage:foldTex}}/>
        <div style={{...curtainStyle,backgroundImage:'linear-gradient(90deg,rgba(0,0,0,.25) 0%,transparent 45%,rgba(255,255,255,.06) 70%,rgba(0,0,0,.35) 100%)'}}/>
        <div style={{...curtainStyle,boxShadow:'inset 20px 0 40px rgba(0,0,0,.5)'}}/>
      </div>
      <div style={{position:'absolute',top:0,left:0,right:0,height:16,background:rod,boxShadow:'0 3px 16px rgba(200,148,26,.5)',zIndex:3}}/>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none',zIndex:2}}>
        <p className="vt" style={{color:'rgba(240,200,80,.85)',letterSpacing:'6px',fontSize:16,textShadow:'0 0 20px rgba(200,148,26,.6)'}}>THE SÉANCE BEGINS</p>
      </div>
    </div>
  );
}

function SeanceRoom({scenario,revealedCount,reaction,bubbleKey,animatingIdx,drawing,onDraw,onRevealReading,onCardInfo,onParamInfo}){
  const cards=scenario.cards;
  const allRevealed=revealedCount===5;
  const masterState = reaction ? 'react' : 'idle';
  return(
    <div className="scanlines" style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',background:'radial-gradient(ellipse at 50% 30%,#130d26 0%,#07040f 65%)',padding:'24px 16px 32px'}}>
      <div style={{width:'100%',maxWidth:760}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <span className="vt" style={{fontSize:16,color:'#7a6a4a',letterSpacing:'3px'}}>THE DIGITAL SÉANCE</span>
          <span className="vt" style={{fontSize:13,color:'#4a3a2a',letterSpacing:'2px'}}>{revealedCount}/5 CARDS DRAWN</span>
        </div>
        {/* ── SÉANCE SCENE ── */}
        <div style={{position:'relative',borderRadius:4,overflow:'hidden',marginBottom:0}}>
          {/* Burgundy curtain background */}
          <div style={{position:'absolute',inset:0,
            background:'linear-gradient(180deg,#2a0610 0%,#380816 40%,#220410 100%)',
            backgroundImage:'repeating-linear-gradient(90deg,transparent 0px,transparent 22px,rgba(0,0,0,.2) 24px,transparent 26px,transparent 44px,rgba(255,255,255,.04) 46px,transparent 48px)',
            zIndex:0}}/>
          {/* Scene content */}
          <div style={{position:'relative',zIndex:1,display:'flex',justifyContent:'center',alignItems:'flex-end',gap:12,padding:'12px 16px 0'}}>
            {/* Far-left tall candle */}
            <div style={{alignSelf:'flex-end',paddingBottom:6}}><CandleTall/></div>
            {/* Left candelabra */}
            <div style={{alignSelf:'flex-end',paddingBottom:4}}><Candelabra/></div>
            {/* Master figure */}
            <SeanceMaster
              state={masterState}
              reaction={reaction||(revealedCount===0?'The glass is dark. Draw the first card when you are ready.':'')}
              bubbleKey={bubbleKey}
            />
            {/* Crystal ball on podium — positioned in front of master's hands */}
            <div style={{alignSelf:'flex-end',paddingBottom:4,marginLeft:-16,marginRight:-16,zIndex:8}}>
              <CrystalPodium active={revealedCount>0&&revealedCount<5}/>
            </div>
            {/* Right candelabra */}
            <div style={{alignSelf:'flex-end',paddingBottom:4}}><Candelabra/></div>
            {/* Far-right fat candle */}
            <div style={{alignSelf:'flex-end',paddingBottom:6}}><CandleFat/></div>
          </div>
          {/* Table surface — clips master's lower body */}
          <div style={{height:12,background:'linear-gradient(180deg,#3a2010 0%,#1e0e04 100%)',
            borderTop:'2px solid rgba(200,148,26,.35)',
            boxShadow:'0 -2px 12px rgba(200,148,26,.12),0 4px 20px rgba(0,0,0,.8)',
            position:'relative',zIndex:9}}/>
        </div>
        {/* Cards + parameter labels aligned underneath */}
        <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:0}}>
          {cards.map((card,i)=>{
            const pid=PARAM_ORDER[i];
            const active=i<revealedCount;
            return(
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,width:88,flexShrink:0}}>
                <CardSlot
                  card={card}
                  revealed={active}
                  animating={i===animatingIdx}
                  onDraw={i===revealedCount&&!drawing?onDraw:undefined}
                  onInfo={active?()=>onCardInfo(card.name):undefined}
                />
                <button
                  onClick={()=>onParamInfo(pid)}
                  style={{
                    background:'none',border:'none',cursor:'pointer',
                    display:'flex',flexDirection:'column',alignItems:'center',gap:2,
                    padding:'4px 2px',width:'100%',
                  }}
                  title={`About: ${PARAM_INFO[pid]?.name||PARAM_SHORT[pid]}`}
                >
                  <span className="vt" style={{
                    fontSize:11,letterSpacing:'1px',lineHeight:1.2,textAlign:'center',
                    color:active?'#e8d5a3':'#5a4a38',
                    display:'block',
                  }}>
                    {PARAM_SHORT[pid].toUpperCase()}
                  </span>
                  <span style={{
                    width:16,height:16,borderRadius:'50%',
                    border:`1px solid ${active?'#c8941a':'#4a3828'}`,
                    background:active?'rgba(200,148,26,.15)':'rgba(255,255,255,.03)',
                    color:active?'#c8941a':'#5a4a38',
                    fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:"'Cinzel',serif",fontWeight:'bold',flexShrink:0,
                    lineHeight:1,textIndent:0,paddingBottom:1,
                  }}>i</span>
                </button>
              </div>
            );
          })}
        </div>
        {/* Divider */}
        <div style={{height:1,background:'linear-gradient(90deg,transparent,#c8941a30,#c8941a60,#c8941a30,transparent)',margin:'14px 0 16px'}}/>
        {/* Controls */}
        <div style={{display:'flex',gap:16,justifyContent:'center',alignItems:'center'}}>
          {!allRevealed?(
            <button className="btn" onClick={onDraw} disabled={drawing}>
              {revealedCount===0?'Draw First Card':`Draw Card ${revealedCount+1}`}
            </button>
          ):(
            <button className="btn" onClick={onRevealReading}>Consult the Reading</button>
          )}
        </div>
        {!allRevealed&&revealedCount>0&&(
          <p className="vt" style={{textAlign:'center',marginTop:12,color:'#4a3a2a',fontSize:13,letterSpacing:'1px'}}>
            OR CLICK A FACE-DOWN CARD TO DRAW IT
          </p>
        )}
      </div>
    </div>
  );
}

function ReadingScreen({scenario,onDrawAgain,onCardInfo,onParamInfo}){
  const [shown,setShown]=useState(0);
  const total=scenario.paragraphs.length+2;
  useEffect(()=>{
    if(shown>=total)return;
    const t=setTimeout(()=>setShown(s=>s+1),shown===0?400:700);
    return()=>clearTimeout(t);
  },[shown,total]);
  const cards=scenario.cards;
  return(
    <div className="scanlines" style={{minHeight:'100vh',background:'radial-gradient(ellipse at 50% 20%,#130d26 0%,#07040f 60%)',padding:'32px 20px 60px'}}>
      <div style={{maxWidth:700,margin:'0 auto'}}>
        {/* Header row */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <span className="vt" style={{fontSize:15,color:'#7a6a4a',letterSpacing:'3px'}}>THE DIGITAL SÉANCE</span>
          <button className="btn btn-sm" onClick={onDrawAgain}>Draw Again</button>
        </div>
        {/* Mini cards */}
        <div style={{display:'flex',gap:8,marginBottom:4,justifyContent:'center'}}>
          {cards.map((card,i)=>{
            const lvlBorder={high:'#8b1a1a',mid:'#8b7018',low:'#1a5080'}[card.level]||'#c8941a';
            return(
              <div key={i} onClick={()=>onCardInfo(card.name)} style={{width:56,height:94,border:`2px solid ${lvlBorder}`,borderRadius:3,overflow:'hidden',cursor:'pointer',flexShrink:0,position:'relative'}}>
                <CardArt name={card.name}/>
                <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(0deg,rgba(7,4,15,.95),transparent)',padding:'12px 2px 2px',pointerEvents:'none'}}>
                  <span className="vt" style={{fontSize:8,color:'#c8941a',textAlign:'center',lineHeight:1.1,whiteSpace:'pre-line',display:'block'}}>{card.name==='The Wheel of Fortune'?'WHEEL OF\nFORTUNE':card.name.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Mini param links — aligned to cards */}
        <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:24}}>
          {PARAM_ORDER.map((pid,i)=>(
            <button key={pid} className="link-btn" onClick={()=>onParamInfo(pid)}
              style={{width:56,fontSize:9,letterSpacing:'0.5px',textAlign:'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flexShrink:0}}>
              {PARAM_SHORT[pid].toUpperCase()}
            </button>
          ))}
        </div>
        {/* Title */}
        <h2 className="cinzel" style={{fontSize:'clamp(18px,4vw,28px)',color:'#c8941a',letterSpacing:'3px',textAlign:'center',marginBottom:28,textShadow:'0 0 12px rgba(200,148,26,.3)'}}>
          {scenario.title}
        </h2>
        {/* Divider */}
        <div style={{height:1,background:'linear-gradient(90deg,transparent,#c8941a60,transparent)',marginBottom:32}}/>
        {/* Reading text */}
        <div className="fell" style={{fontSize:17,lineHeight:1.85,color:'#e8d5a3'}}>
          {shown>0&&(
            <p className="fade-up" style={{fontStyle:'italic',color:'#c8b890',marginBottom:28,fontSize:18,animationDelay:'0s'}}>
              {scenario.opening}
            </p>
          )}
          {scenario.paragraphs.map((para,i)=>(
            shown>i+1&&(
              <p key={i} className="fade-up" style={{marginBottom:24,animationDelay:'0s'}}>
                {para}
              </p>
            )
          ))}
          {shown>=total&&(
            <p className="fade-up" style={{fontStyle:'italic',color:'#c8b890',marginTop:12,animationDelay:'0s'}}>
              {scenario.closing}
            </p>
          )}
        </div>
        {/* Draw again */}
        {shown>=total&&(
          <div className="fade-up" style={{textAlign:'center',marginTop:48}}>
            <div style={{height:1,background:'linear-gradient(90deg,transparent,#c8941a60,transparent)',marginBottom:32}}/>
            <button className="btn" onClick={onDrawAgain}>Draw Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CardModal({cardName,onClose}){
  const c=CARD_INFO[cardName];
  if(!c)return null;
  const lvlLabel={low:'Low',mid:'Mid',high:'High'}[c.level];
  return(
    <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal-box">
        <button onClick={onClose} className="vt" style={{position:'absolute',top:12,right:16,background:'none',border:'none',color:'#7a6a4a',fontSize:20,cursor:'pointer',letterSpacing:1}}>[ CLOSE ]</button>
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{fontSize:48,marginBottom:8}}>{c.emoji}</div>
          <h2 className="cinzel" style={{color:'#c8941a',fontSize:22,letterSpacing:'2px'}}>{cardName}</h2>
          <p className="vt" style={{color:'#7a6a4a',fontSize:13,letterSpacing:'2px',marginTop:4}}>{c.paramLabel.toUpperCase()} — {lvlLabel.toUpperCase()}</p>
        </div>
        <div style={{height:1,background:'rgba(200,148,26,.3)',marginBottom:20}}/>
        <p className="vt" style={{color:'#c8941a',fontSize:14,letterSpacing:'2px',marginBottom:8}}>GENERAL MEANING</p>
        <p className="fell" style={{fontStyle:'italic',lineHeight:1.7,marginBottom:20,color:'#c8b890',fontSize:15}}>{c.general}</p>
        <p className="vt" style={{color:'#c8941a',fontSize:14,letterSpacing:'2px',marginBottom:8}}>IN THIS CONTEXT</p>
        <p className="fell" style={{lineHeight:1.75,color:'#e8d5a3',fontSize:15}}>{c.context}</p>
      </div>
    </div>
  );
}

function ParamPanel({paramId,onClose}){
  const p=PARAM_INFO[paramId];
  if(!p)return null;
  return(
    <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal-box">
        <button onClick={onClose} className="vt" style={{position:'absolute',top:12,right:16,background:'none',border:'none',color:'#7a6a4a',fontSize:20,cursor:'pointer',letterSpacing:1}}>[ CLOSE ]</button>
        <div style={{marginBottom:20}}>
          <span style={{fontSize:32,marginRight:12}}>{p.emoji}</span>
          <h2 className="cinzel" style={{color:'#c8941a',fontSize:20,letterSpacing:'2px',display:'inline'}}>{p.name}</h2>
          <p className="fell" style={{fontStyle:'italic',color:'#7a6a4a',marginTop:6,fontSize:14}}>{p.subtitle}</p>
        </div>
        <div style={{height:1,background:'rgba(200,148,26,.3)',marginBottom:20}}/>
        <p className="fell" style={{lineHeight:1.75,color:'#c8b890',marginBottom:20,fontSize:15}}>{p.description}</p>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>
          {['low','mid','high'].map(lk=>(
            <div key={lk} style={{background:'rgba(200,148,26,.06)',border:'1px solid rgba(200,148,26,.2)',padding:'10px 14px'}}>
              <p className="vt" style={{color:'#c8941a',fontSize:14,letterSpacing:'1px',marginBottom:4}}>{lk.toUpperCase()} — {p.levels[lk].label}</p>
              <p className="fell" style={{color:'#e8d5a3',fontSize:14,lineHeight:1.65}}>{p.levels[lk].desc}</p>
            </div>
          ))}
        </div>
        <p className="vt" style={{color:'#7a6a4a',fontSize:13,letterSpacing:'2px',marginBottom:10}}>FURTHER READING</p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {p.links.map((lnk,i)=>(
            <div key={i} style={{borderLeft:'2px solid rgba(200,148,26,.3)',paddingLeft:12}}>
              <a href={lnk.url} target="_blank" rel="noopener noreferrer" style={{color:'#c8941a',fontFamily:"'Cinzel',serif",fontSize:13,textDecoration:'none'}}>{lnk.author} — {lnk.title}</a>
              <p className="fell" style={{color:'#7a6a4a',fontSize:12,fontStyle:'italic',marginTop:2}}>{lnk.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =================== APP ===================
function App(){
  useEffect(()=>{document.title='The Digital Séance: A Scenario Exercise for the AI Industry';},[]);
  const [screen,setScreen]=useState('intro');
  const [scenario,setScenario]=useState(null);
  const [revealedCount,setRevealedCount]=useState(0);
  const [reaction,setReaction]=useState('');
  const [animatingIdx,setAnimatingIdx]=useState(-1);
  const [drawing,setDrawing]=useState(false);
  const [modal,setModal]=useState(null);
  const [bubbleKey,setBubbleKey]=useState(0);

  const beginSeance=()=>{
    const key=drawScenario();
    const s=SCENARIOS[key];
    setScenario({key,...s,cards:cardsForKey(key)});
    setRevealedCount(0);setReaction('');setAnimatingIdx(-1);setDrawing(false);
    setScreen('curtain');
  };

  const drawNext=()=>{
    if(drawing||!scenario||revealedCount>=5)return;
    const idx=revealedCount;
    const card=scenario.cards[idx];
    setReaction(getRx(card.name));
    setAnimatingIdx(idx);
    setDrawing(true);
    setRevealedCount(idx+1);
    setBubbleKey(k=>k+1);
    setTimeout(()=>{setAnimatingIdx(-1);setDrawing(false)},400);
  };

  return(
    <div style={{minHeight:'100vh',background:'#07040f'}}>
      <StyleTag/>
      {screen==='intro'&&<IntroScreen onBegin={beginSeance} onParamInfo={id=>setModal({type:'param',id})}/>}
      {screen==='curtain'&&<CurtainScene onDone={()=>setScreen('room')}/>}
      {screen==='room'&&scenario&&(
        <SeanceRoom
          scenario={scenario}
          revealedCount={revealedCount}
          reaction={reaction}
          bubbleKey={bubbleKey}
          animatingIdx={animatingIdx}
          drawing={drawing}
          onDraw={drawNext}
          onRevealReading={()=>setScreen('reading')}
          onCardInfo={name=>setModal({type:'card',name})}
          onParamInfo={id=>setModal({type:'param',id})}
        />
      )}
      {screen==='reading'&&scenario&&(
        <ReadingScreen
          scenario={scenario}
          onDrawAgain={()=>{setScreen('intro');setScenario(null);setRevealedCount(0);setReaction('')}}
          onCardInfo={name=>setModal({type:'card',name})}
          onParamInfo={id=>setModal({type:'param',id})}
        />
      )}
      {modal?.type==='card'&&<CardModal cardName={modal.name} onClose={()=>setModal(null)}/>}
      {modal?.type==='param'&&<ParamPanel paramId={modal.id} onClose={()=>setModal(null)}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
