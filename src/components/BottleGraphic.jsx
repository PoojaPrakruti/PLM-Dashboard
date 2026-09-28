import { statusStyle } from '../utils/helpers'

// Renders a procedural bottle silhouette sized to the product's capacity,
// with a defect marker and an optional scanning sweep. This stands in for
// the raster "Bottle Image" field in the mock data — since no captured
// photography exists yet, the silhouette is generated from the record
// itself (design + capacity + defect) rather than a placeholder image.
export default function BottleGraphic({
  design = 'Design 1',
  capacity = '500 mL',
  status = 'Inspecting',
  defect = 'No Defect',
  scanning = false,
  size = 140,
  accent = '#2b5cf5',
}) {
  const style = statusStyle(status)
  const heightScale = capacity === '2 L' ? 1.15 : capacity === '1 L' ? 1.0 : 0.85
  const width = size * 0.56
  const height = size * heightScale

  const strokeColor =
    status === 'Failed' ? '#dc2626' : status === 'Passed' ? '#16a34a' : accent

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size * 1.15 }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* cap */}
        <rect x="38" y="4" width="24" height="14" rx="3" fill={strokeColor} fillOpacity="0.85" />
        {/* neck */}
        <path d="M40 18 L40 34 Q40 40 34 44 L34 54 L66 54 L66 44 Q60 40 60 34 L60 18 Z" stroke={strokeColor} strokeWidth="2.5" fill="white" fillOpacity="0.06" />
        {/* body */}
        <path
          d="M34 54 L34 60 Q18 68 18 90 L18 140 Q18 152 30 152 L70 152 Q82 152 82 140 L82 90 Q82 68 66 60 L66 54 Z"
          stroke={strokeColor}
          strokeWidth="2.5"
          fill="white"
          fillOpacity="0.06"
        />
        {/* label band */}
        <rect x="22" y="96" width="56" height="28" rx="2" fill={strokeColor} fillOpacity="0.12" stroke={strokeColor} strokeOpacity="0.4" strokeWidth="1" />

        {/* defect marker */}
        {status === 'Failed' && defect === 'Scratch' && (
          <line x1="30" y1="70" x2="46" y2="130" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
        )}
        {status === 'Failed' && defect === 'Dent' && (
          <circle cx="60" cy="100" r="7" fill="none" stroke="#dc2626" strokeWidth="2.5" />
        )}
        {status === 'Failed' && defect === 'Crack' && (
          <path d="M50 66 L44 84 L54 90 L46 112" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {status === 'Failed' && defect === 'Missing Cap' && (
          <g>
            <rect x="38" y="4" width="24" height="14" rx="3" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
          </g>
        )}
        {status === 'Failed' && defect === 'Wrong Label' && (
          <rect x="22" y="96" width="56" height="28" rx="2" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
        )}
      </svg>

      {scanning && (
        <div
          className="absolute overflow-hidden pointer-events-none rounded-md"
          style={{ width, height, left: '50%', transform: 'translateX(-50%)', top: size * 1.15 * 0.5 - height / 2 }}
        >
          <div className="absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent via-teal-400/60 to-transparent animate-scanline" />
        </div>
      )}

      <span
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full ${style.dot} ${
          status === 'Inspecting' ? 'animate-pulseSoft' : ''
        }`}
      />
    </div>
  )
}
