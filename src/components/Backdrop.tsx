/**
 * Decorative line-art layer sitting behind everything.
 * Desktop only (>= 922px), aria-hidden, no client JS — see globals.css `.backdrop`.
 */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {/* topographic rings, top right */}
        <g className="topo">
          <ellipse cx="1180" cy="250" rx="90" ry="66" transform="rotate(-18 1180 250)" />
          <ellipse cx="1180" cy="250" rx="150" ry="112" transform="rotate(-16 1180 250)" />
          <ellipse cx="1178" cy="248" rx="214" ry="158" transform="rotate(-14 1178 248)" />
          <ellipse className="hot" cx="1176" cy="246" rx="282" ry="206" transform="rotate(-12 1176 246)" />
          <ellipse cx="1172" cy="244" rx="356" ry="258" transform="rotate(-10 1172 244)" />
          <ellipse cx="1168" cy="242" rx="436" ry="314" transform="rotate(-8 1168 242)" />
          <ellipse cx="1162" cy="240" rx="522" ry="374" transform="rotate(-6 1162 240)" />
        </g>

        {/* second, flatter cluster, bottom right */}
        <g className="topo slow">
          <ellipse cx="980" cy="880" rx="120" ry="52" transform="rotate(8 980 880)" />
          <ellipse cx="980" cy="880" rx="220" ry="96" transform="rotate(7 980 880)" />
          <ellipse className="hot" cx="978" cy="882" rx="330" ry="144" transform="rotate(6 978 882)" />
          <ellipse cx="976" cy="884" rx="450" ry="196" transform="rotate(5 976 884)" />
        </g>

        {/* the branch — draws itself in on load */}
        <g className="branch">
          <path
            className="stem"
            pathLength={100}
            d="M96 900 C 118 762, 150 690, 186 604 C 222 518, 244 452, 252 356 C 258 282, 250 224, 236 168"
          />
          <path className="twig" pathLength={100} d="M204 548 C 250 528, 288 494, 312 442" />
          <path className="twig" pathLength={100} d="M240 420 C 196 398, 164 362, 148 310" />
          <path className="twig" pathLength={100} d="M251 330 C 296 312, 330 282, 352 238" />
          <g className="leaves">
            <ellipse cx="318" cy="436" rx="26" ry="11" transform="rotate(-32 318 436)" />
            <ellipse cx="142" cy="304" rx="24" ry="10" transform="rotate(38 142 304)" />
            <ellipse cx="358" cy="232" rx="22" ry="9" transform="rotate(-34 358 232)" />
            <circle className="node" cx="236" cy="168" r="4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
