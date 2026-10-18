import type { Answer, DiagramQuestion } from "@/lib/native/schema";

function Chloroplast() {
  return <g aria-hidden="true">
    <ellipse cx="500" cy="210" rx="174" ry="112" fill="#d9f0ce" stroke="#3e7952" strokeWidth="8" />
    <ellipse cx="500" cy="210" rx="158" ry="96" fill="#edf7df" stroke="#78a35e" strokeWidth="3" />
    {[0, 1, 2, 3].map((stack) => <g key={stack} transform={`translate(${385 + stack * 76} ${155 + (stack % 2) * 35})`}>
      {[0, 1, 2, 3].map((disc) => <ellipse key={disc} cx="0" cy={disc * 14} rx="24" ry="8" fill="#75a95d" stroke="#477b4a" strokeWidth="2" />)}
      <circle cx="-9" cy="19" r="2.5" fill="#d9ad47" /><circle cx="10" cy="40" r="2.5" fill="#d9ad47" />
    </g>)}
  </g>;
}

function Mitochondrion() {
  return <g aria-hidden="true">
    <path d="M338 209 C338 139 393 100 477 104 C547 77 653 119 664 192 C675 267 610 313 530 309 C449 335 354 291 338 209Z"
      fill="#f4d7a8" stroke="#86583e" strokeWidth="8" />
    <path d="M358 207 C359 153 405 126 471 130 C532 106 627 137 641 194 C653 248 600 286 531 282 C459 304 375 270 358 207Z"
      fill="#fff0d2" stroke="#bd8050" strokeWidth="4" />
    <path d="M382 180 C406 150 416 234 442 205 C463 182 461 150 482 177 C504 204 494 244 519 232 C544 220 530 153 555 158 C578 164 565 245 592 246 C610 247 615 223 623 208"
      fill="none" stroke="#9b5f43" strokeWidth="10" strokeLinecap="round" />
  </g>;
}

function Burst({ x, y }: { x: number; y: number }) {
  return <path aria-hidden="true" d={`M${x} ${y - 17} l5 11 12 -4 -6 11 11 7 -13 2 1 13 -10 -8 -10 8 1 -13 -13 -2 11 -7 -6 -11 12 4Z`}
    fill="#e6ad36" stroke="#9c6719" strokeWidth="2" />;
}

function Sun({ x, y }: { x: number; y: number }) {
  return <g aria-hidden="true" stroke="#a86713" strokeWidth="3" strokeLinecap="round">
    <circle cx={x} cy={y} r="13" fill="#ffd976" />
    {Array.from({ length: 8 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 8;
      return <line key={index} x1={x + Math.cos(angle) * 20} y1={y + Math.sin(angle) * 20}
        x2={x + Math.cos(angle) * 28} y2={y + Math.sin(angle) * 28} />;
    })}
  </g>;
}

export function DiagramQuestionControls({ question, answer, order, locked, onAnswer }: {
  question: DiagramQuestion;
  answer: Record<string, string>;
  order: string[];
  locked: boolean;
  onAnswer: (answer: Answer) => void;
}) {
  const titleId = `${question.id}-diagram-title`;
  const descriptionId = `${question.id}-diagram-description`;
  const matterMarker = `${question.id}-matter-arrow`;
  const energyMarker = `${question.id}-energy-arrow`;
  const selectedCount = question.slots.filter(slot => answer[slot.id]).length;

  return <div className="native-diagram-question" lang="en">
    <figure className="native-diagram-figure">
      <svg className="native-flow-svg" viewBox="0 0 1000 420" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
        <title id={titleId}>{question.scene === "chloroplast" ? "Chloroplast photosynthesis diagram" : "Mitochondrion cellular respiration diagram"}</title>
        <desc id={descriptionId}>A large organelle illustration with numbered arrows. Each number corresponds to an answer selector below the diagram. Solid arrows show matter; dashed arrows show energy.</desc>
        <defs>
          <marker id={matterMarker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#246b67" /></marker>
          <marker id={energyMarker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#a86713" /></marker>
        </defs>
        {question.scene === "chloroplast" ? <Chloroplast /> : <Mitochondrion />}
        {question.scene === "chloroplast" ? <Sun x={500} y={35} /> : null}
        {question.scene === "mitochondrion" ? <Burst x={550} y={385} /> : null}
        {question.slots.map(slot => <line key={`${slot.id}-arrow`} x1={slot.from[0]} y1={slot.from[1]} x2={slot.to[0]} y2={slot.to[1]}
          className={slot.flow.startsWith("energy") ? "diagram-energy-arrow" : "diagram-matter-arrow"}
          markerEnd={`url(#${slot.flow.startsWith("energy") ? energyMarker : matterMarker})`} />)}
        {question.slots.map(slot => <g key={`${slot.id}-number`} className={slot.flow.startsWith("energy") ? "diagram-energy-number" : "diagram-matter-number"}>
          <circle cx={slot.marker[0]} cy={slot.marker[1]} r="18" />
          <text x={slot.marker[0]} y={slot.marker[1] + 6} textAnchor="middle">{slot.number}</text>
        </g>)}
      </svg>
      <figcaption><strong>{question.scene === "chloroplast" ? "Chloroplast · photosynthesis" : "Mitochondrion · cellular respiration"}</strong><br />Solid arrows show matter entering or leaving. Dashed arrows show energy entering or being released.</figcaption>
    </figure>
    <ol className="native-diagram-slots">
      {question.slots.map(slot => <li key={slot.id}>
        <span className={`diagram-slot-number ${slot.flow.startsWith("energy") ? "is-energy" : ""}`} aria-hidden="true">{slot.number}</span>
        <label htmlFor={`${question.id}-${slot.id}`}>{slot.label}</label>
        <select id={`${question.id}-${slot.id}`} aria-label={`${slot.number}. ${slot.label}`} disabled={locked}
          value={answer[slot.id] ?? ""} onChange={event => onAnswer({ ...answer, [slot.id]: event.target.value })}>
          <option value="">Choose an answer</option>
          {order.map(id => <option key={id} value={id}>{question.options.find(option => option.id === id)!.label}</option>)}
        </select>
      </li>)}
    </ol>
    <p className="native-assigned" aria-live="polite">{selectedCount} / {question.slots.length} labels selected</p>
  </div>;
}
