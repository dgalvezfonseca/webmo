import { useId } from 'react'

type Stage = 'closed' | 'partially-open' | 'open'
type Tone = 'ivory' | 'blush'
type Props = { stage?: Stage; tone?: Tone; className?: string; small?: boolean; decorative?: boolean }

export function Lily({ stage = 'open', tone = 'blush', className = '', small = false, decorative = false }: Props) {
  const prefix = useId().replaceAll(':', '')
  const fills = tone === 'ivory'
    ? ['#fffdf8', '#f8eee2', '#dca8ad']
    : ['#fffaf6', '#f1d4d5', '#c9798e']
  return (
    <svg className={`lily lily-${stage} lily-${tone} ${small ? 'lily-small' : ''} ${className}`} viewBox="0 0 240 300" role={decorative ? 'presentation' : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : stage === 'closed' ? 'Un capullo de lirio' : stage === 'partially-open' ? 'Un lirio abriéndose' : 'Un lirio florecido'}>
      <defs>
        <linearGradient id={`${prefix}-silk`} x1=".16" y1="0" x2=".82" y2="1"><stop stopColor={fills[0]}/><stop offset=".62" stopColor={fills[1]}/><stop offset="1" stopColor={fills[2]}/></linearGradient>
        <linearGradient id={`${prefix}-reverse`} x1=".1" y1=".1" x2=".9" y2=".95"><stop stopColor="#fffdf8"/><stop offset=".56" stopColor={fills[1]}/><stop offset="1" stopColor={fills[2]}/></linearGradient>
        <radialGradient id={`${prefix}-throat`} cx="50%" cy="74%" r="65%"><stop stopColor="#f5d796" stopOpacity=".78"/><stop offset=".42" stopColor={fills[1]} stopOpacity=".56"/><stop offset="1" stopColor={fills[0]} stopOpacity="0"/></radialGradient>
        <filter id={`${prefix}-shadow`} x="-.25" y="-.2" width="1.5" height="1.5"><feGaussianBlur stdDeviation="2.8"/></filter>
      </defs>
      <path className="lily-stem" d="M120 286 C115 249 124 217 118 181 C112 147 114 117 120 87" fill="none" stroke="#718166" strokeWidth="4.2" strokeLinecap="round"/>
      <path className="lily-leaf leaf-left" d="M118 230 C89 197 56 191 38 207 C53 232 83 245 117 239Z" fill="#aab59d" stroke="#77866c" strokeWidth="1.8"/>
      <path className="lily-leaf leaf-right" d="M120 260 C147 226 177 220 197 235 C185 259 157 274 120 269Z" fill="#b5beaa" stroke="#77866c" strokeWidth="1.8"/>
      <path d="M115 235 C87 215 64 210 47 211M122 263 C149 242 171 238 190 239" fill="none" stroke="#dce0d3" strokeWidth="1.2" strokeLinecap="round" opacity=".72"/>
      <g className="lily-open-form">
        <ellipse cx="121" cy="143" rx="70" ry="53" fill="#8f5d68" opacity=".12" filter={`url(#${prefix}-shadow)`}/>
        <g className="lily-tepals lily-tepals-back" stroke="#bd8190" strokeWidth="1.55" strokeLinejoin="round">
          <path d="M119 145 C96 116 78 77 98 39 C119 48 130 88 123 130 C132 83 151 49 171 51 C185 89 156 127 126 146Z" fill={`url(#${prefix}-silk)`}/>
          <path d="M115 144 C80 141 43 122 48 91 C66 76 102 95 119 130 C101 90 101 57 119 36 C145 51 148 91 125 135Z" fill={`url(#${prefix}-reverse)`}/>
          <path d="M126 143 C145 107 176 76 201 93 C204 119 171 139 132 146 C174 137 202 150 197 177 C174 193 143 168 126 148Z" fill={`url(#${prefix}-silk)`}/>
        </g>
        <g className="lily-tepals lily-tepals-front" stroke="#bd8190" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M115 143 C80 149 48 171 57 196 C83 206 109 177 121 149 C131 181 153 205 179 192 C184 164 153 146 126 141Z" fill={`url(#${prefix}-reverse)`}/>
          <path d="M117 145 C99 175 102 206 122 222 C145 208 147 177 126 144 C149 171 175 181 190 164 C185 139 155 130 126 140Z" fill={`url(#${prefix}-silk)`}/>
          <path d="M117 141 C93 126 70 102 82 79 C106 80 120 108 121 135 C125 104 139 83 159 82 C171 108 148 133 125 144Z" fill={`url(#${prefix}-reverse)`}/>
        </g>
        <path d="M115 137 C110 164 116 187 126 196 C138 181 137 159 124 137Z" fill={`url(#${prefix}-throat)`} opacity=".92"/>
        <g className="lily-veins" fill="none" stroke="#c98794" strokeWidth=".85" strokeLinecap="round" opacity=".7">
          <path d="M120 138 C110 112 104 84 108 58M117 138 C97 116 77 101 60 95M127 139 C150 116 171 103 191 99M119 145 C92 156 76 172 66 188M126 145 C151 158 167 173 174 187M123 148 C126 171 129 190 125 210"/>
        </g>
        <g className="lily-freckles" fill="#bd7985" opacity=".66">
          <ellipse cx="103" cy="145" rx="1.5" ry="2.2" transform="rotate(-28 103 145)"/><ellipse cx="109" cy="151" rx="1.25" ry="1.8"/><ellipse cx="137" cy="148" rx="1.4" ry="2" transform="rotate(25 137 148)"/><ellipse cx="143" cy="142" rx="1.15" ry="1.8"/><ellipse cx="116" cy="158" rx="1.2" ry="1.7"/><ellipse cx="131" cy="159" rx="1.2" ry="1.7"/>
        </g>
        <g className="lily-stamens" stroke="#8d704c" strokeWidth="1.6" strokeLinecap="round">
          <path d="M120 143 C101 126 88 116 78 109M121 141 C108 118 101 102 99 91M123 140 C120 115 119 99 122 84M125 141 C134 117 141 103 151 93M127 143 C145 126 158 117 169 113M127 145 C151 139 166 138 178 140"/>
          <g fill="#c7954f" stroke="#faf1dd" strokeWidth=".7"><ellipse cx="76" cy="107" rx="3.1" ry="5" transform="rotate(-39 76 107)"/><ellipse cx="98" cy="89" rx="3.2" ry="5.2" transform="rotate(-12 98 89)"/><ellipse cx="123" cy="82" rx="3.2" ry="5.2"/><ellipse cx="153" cy="91" rx="3.2" ry="5.2" transform="rotate(27 153 91)"/><ellipse cx="171" cy="111" rx="3.1" ry="5" transform="rotate(48 171 111)"/><ellipse cx="181" cy="140" rx="3.1" ry="5" transform="rotate(68 181 140)"/></g>
        </g>
      </g>
      <g className="lily-bud" stroke="#bc7d8b" strokeWidth="1.65" strokeLinejoin="round">
        <path d="M119 158 C91 139 87 93 99 58 C126 76 145 113 122 158Z" fill={`url(#${prefix}-silk)`}/>
        <path d="M119 156 C82 150 66 121 73 97 C97 103 115 128 122 155Z" fill={`url(#${prefix}-reverse)`}/>
        <path d="M121 156 C158 148 176 122 167 98 C144 104 127 130 121 156Z" fill={`url(#${prefix}-silk)`}/>
        <path d="M120 155 C104 136 102 110 109 84M119 154 C95 137 84 121 81 105M123 154 C148 137 160 121 161 105" fill="none" stroke="#c98794" strokeWidth=".9" opacity=".8"/>
      </g>
    </svg>
  )
}
