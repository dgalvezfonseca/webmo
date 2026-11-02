import { Lily } from './Lily'

export function BotanicalMark({ index }: { index: number }) {
  return (
    <svg className={`botanical-mark mark-${index + 1}`} viewBox="0 0 44 44" aria-hidden="true">
      <path className="mark-stem" d={index % 2 ? 'M22 39 C19 29 25 19 22 7' : 'M22 39 C25 28 18 18 22 7'}/>
      <path className="mark-leaf" d="M21 28 C10 18 7 20 6 22 C9 31 15 33 21 31Z"/>
      <path className="mark-leaf leaf-second" d="M23 22 C32 13 37 15 38 17 C35 25 29 28 23 26Z"/>
      {index === 0 && <><path className="mark-bud" d="M22 15 C16 12 16 6 22 3 C28 7 27 12 22 15Z"/><path className="mark-detail" d="M22 14v-8"/></>}
      {index === 1 && <><circle className="mark-flower" cx="22" cy="11" r="3.1"/><circle className="mark-flower" cx="17" cy="13" r="2.8"/><circle className="mark-flower" cx="27" cy="13" r="2.8"/><circle className="mark-center" cx="22" cy="12" r="1.4"/></>}
      {index === 2 && <><path className="mark-bud" d="M22 15 C16 12 16 6 22 3 C28 7 27 12 22 15Z"/><path className="mark-bud bud-small" d="M31 20 C27 17 28 13 32 11 C36 15 35 18 31 20Z"/></>}
      {index === 3 && <><path className="mark-leaf leaf-high" d="M21 18 C13 10 14 7 16 6 C23 9 25 13 24 18Z"/><path className="mark-detail" d="M22 17v-8"/></>}
      {index === 4 && <><circle className="mark-flower" cx="18" cy="13" r="2.7"/><circle className="mark-flower" cx="23" cy="10" r="2.7"/><circle className="mark-flower" cx="28" cy="13" r="2.7"/><circle className="mark-center" cx="23" cy="13" r="1.4"/></>}
    </svg>
  )
}

export function HugGarden({ hugged }: { hugged: boolean }) {
  return (
    <div className={`hug-garden ${hugged ? 'is-hugged' : ''}`} aria-hidden="true">
      <svg className="hug-stems" viewBox="0 0 360 250" fill="none">
        <path d="M71 238 C89 199 113 157 165 97M285 238 C267 199 243 157 195 97" stroke="#78866f" strokeWidth="3" strokeLinecap="round"/>
        <path d="M112 178 C75 152 54 159 49 168 C63 190 85 196 112 186M245 176 C282 151 303 158 309 167 C295 189 272 195 245 184" fill="#aab59d" stroke="#78866f" strokeWidth="1.5"/>
        <path d="M101 201 C75 190 59 192 47 199M257 200 C283 188 300 192 313 198" stroke="#dce0d3" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <Lily className="hug-lily hug-lily-left" stage="open" tone="ivory" decorative/>
      <Lily className="hug-lily hug-lily-right" stage="open" tone="blush" decorative/>
      <span className="hug-embrace"/>
    </div>
  )
}

export function InvitationSprig() {
  return (
    <div className="invitation-sprig" aria-hidden="true">
      <svg viewBox="0 0 180 180" className="invitation-branch" fill="none">
        <path d="M86 177 C98 137 89 102 103 66 C109 49 118 33 132 18" stroke="#77856c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M92 144 C66 117 43 118 36 125 C46 147 66 158 92 151M94 120 C120 98 143 100 150 108 C139 127 119 134 95 127M101 87 C76 69 56 71 50 78 C59 97 78 105 99 95" fill="#aab59d" stroke="#77856c" strokeWidth="1.5"/>
        <path d="M119 52 C104 38 105 25 112 18 C127 26 131 38 122 51" fill="#f4e3df" stroke="#c68191" strokeWidth="1.5"/>
      </svg>
      <Lily className="invitation-bloom" stage="partially-open" tone="ivory" decorative/>
    </div>
  )
}

export function FinalBouquet() {
  return (
    <div className="final-bouquet" role="img" aria-label="Tres lirios florecidos en un pequeño ramo">
      <Lily className="bouquet-lily bouquet-lily-left" stage="open" tone="ivory" decorative/>
      <Lily className="bouquet-lily bouquet-lily-right" stage="open" tone="blush" decorative/>
      <Lily className="bouquet-lily bouquet-lily-center" stage="open" tone="ivory" decorative/>
      <svg className="bouquet-ribbon" viewBox="0 0 40 26" aria-hidden="true"><path d="M20 4 C14 2 9 4 10 10 L19 14 11 21 C17 24 20 19 20 15M20 14 29 10 C30 4 25 2 20 4M20 14v8" fill="#d4aab0" stroke="#a76e79" strokeWidth="1.2" strokeLinejoin="round"/></svg>
    </div>
  )
}
