# Animation Flow & Timeline

## 🎬 Auto-Play Journey Timeline

```
START (0s)
  ↓
┌─────────────────────────────────────────────────┐
│ Stop 1: Bến Nhà Rồng (1911)                    │
│ ├─ Zoom to Vietnam                              │
│ ├─ Show Young Ho Chi Minh                       │
│ ├─ Show Boat with smoke                         │
│ └─ Duration: 3s                                 │
└─────────────────────────────────────────────────┘
  ↓ (2s transition)
┌─────────────────────────────────────────────────┐
│ Stop 2-7: Asia → Europe → America              │
│ ├─ Character age: "young"                       │
│ ├─ Zoom to each location                        │
│ ├─ Show info card                               │
│ └─ Duration: 3s each                            │
└─────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────┐
│ Stop 8-16: Europe → Asia                       │
│ ├─ Character age: "middle" (với râu)           │
│ ├─ Zoom transitions                             │
│ └─ Duration: 3s each                            │
└─────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────┐
│ Stop 17-20: Return to Vietnam                  │
│ ├─ Character age: "old" (râu bạc)              │
│ ├─ Final stops in China                         │
│ └─ Duration: 3s each                            │
└─────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────┐
│ 🎉 VICTORY SEQUENCE (Stop 20)                   │
│                                                  │
│ 1. Soldiers appear (stagger 0.2s)               │
│    └─ from bottom, opacity 0→1                  │
│                                                  │
│ 2. Flag raises (1s)                             │
│    └─ scale 0→1, elastic bounce                 │
│                                                  │
│ 3. Soldiers celebrate (loop)                    │
│    └─ rotation ±15°, yoyo                       │
│                                                  │
│ 4. Old Ho Chi Minh watches                      │
│    └─ standing proudly with white beard         │
│                                                  │
│ Total duration: ~5s + infinite loop             │
└─────────────────────────────────────────────────┘
  ↓
END (60s total)
```

## 📍 Journey Stops Map

```
                    ╔═══════════════════════════════╗
                    ║   HÀNH TRÌNH 30 NĂM           ║
                    ╚═══════════════════════════════╝

    🌍 CHÂU ÂU                    🌏 CHÂU Á
    ┌────────────┐               ┌──────────────┐
    │ 6. Marseille│              │ 14. Quảng Châu│
    │ 7. London   │              │ 16. Hong Kong │
    │ 10. Paris   │              │ 17. Shanghai  │
    │ 11. Versailles│            │ 18. Moskva    │
    │ 12. Tours   │              │ 19. Diên An   │
    │ 13. Moskva  │              │               │
    └────────────┘               └──────────────┘
           ↑                            ↑
           │                            │
           └────────────┬───────────────┘
                        │
                        ↓
    🌎 CHÂU MỸ                    🌏 ĐÔNG NAM Á
    ┌────────────┐               ┌──────────────┐
    │ 8. New York │              │ 1. Sài Gòn   │🚢
    │ 9. Boston   │              │ 2. Singapore │
    └────────────┘               │ 3. Colombo   │
                                 │ 15. Nakhon P │
                                 │ 20. Pác Bó   │🏁
                                 └──────────────┘

    🌍 CHÂU PHI
    ┌────────────┐
    │ 4. Djibouti │
    │ 5. Port Said│
    └────────────┘

    Legend:
    🚢 = Start (with boat)
    🏁 = End (victory)
    ━━ = Sea route
    ─── = Land route
```

## 🎨 Character States

```
┌─────────────────────────────────────────────────┐
│ AGE: YOUNG (1911-1917)                         │
├─────────────────────────────────────────────────┤
│                     👤                          │
│                    /|\\                         │
│                     |                           │
│                    / \\                         │
│                                                 │
│ Features:                                       │
│ - No beard                                      │
│ - Dark hair                                     │
│ - Traditional áo dài                            │
│ - Energetic posture                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AGE: MIDDLE (1917-1930)                        │
├─────────────────────────────────────────────────┤
│                     👤                          │
│                   🧔/|\\                        │
│                     |                           │
│                    / \\                         │
│                                                 │
│ Features:                                       │
│ - Black beard                                   │
│ - Dark hair                                     │
│ - Western suit                                  │
│ - Determined stance                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AGE: OLD (1933-1941)                           │
├─────────────────────────────────────────────────┤
│                     👴                          │
│                   🧔/|\\                        │
│                     |                           │
│                    / \\                         │
│                                                 │
│ Features:                                       │
│ - WHITE/GRAY beard                              │
│ - White hair                                    │
│ - Traditional áo dài                            │
│ - Wise posture                                  │
└─────────────────────────────────────────────────┘
```

## ⚙️ Technical Animation Details

### D3 Zoom Configuration

```typescript
const zoom = d3
  .zoom()
  .scaleExtent([1, 8]) // Min/max zoom levels
  .on("zoom", zoomed); // Apply transform
```

### GSAP Timeline Structure

```typescript
timeline
  ├─ Stop 1 (0s-3s)
  │  ├─ zoomToStop(stop1, 2000ms)
  │  ├─ setCharacterAge('young')
  │  └─ setSelectedStop(stop1)
  │
  ├─ Stop 2 (5s-8s)
  │  └─ ...
  │
  ├─ ...
  │
  └─ Victory (58s-63s)
     ├─ Soldiers in (0.5s, stagger)
     ├─ Flag up (1s, bounce)
     └─ Celebrate (loop)
```

### Character Animation Keyframes

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes sway {
  0%,
  100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

@keyframes celebrate {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-5px) scale(1.05);
  }
  75% {
    transform: translateY(-3px) scale(0.95);
  }
}
```

## 🎯 User Interactions

```
User Actions          →  System Response
═══════════════════════════════════════════════

Click "Xem hành trình" → Start auto-play timeline
                         Disable button
                         Begin zoom sequence

Click marker          → Zoom to location
                         Show info card
                         Pause auto-play (if active)

Click country         → Highlight country
                         Show country name

Click background      → Reset zoom to world view
                         Close info cards

Scroll down          → Progress through timeline
                         Reveal markers sequentially

Hover marker         → Enlarge marker
                         Show tooltip

Mouse wheel          → Manual zoom in/out
                         Pan available
```

## 🔄 State Management

```
Component State:
├─ currentStopIndex    (0-19)
├─ isAutoPlaying       (boolean)
├─ characterAge        ('young' | 'middle' | 'old')
├─ selectedStop        (JourneyStop | null)
├─ currentPhase        (0-3)
└─ zoomRef            (D3 ZoomBehavior)

Effects:
├─ Map initialization  (on mount)
├─ Auto-play control   (on button click)
├─ Character updates   (on stop change)
└─ Cleanup            (on unmount)
```

## 📊 Performance Metrics

```
Target Performance:
├─ Initial load      < 2s
├─ Zoom transition   2s
├─ Stop interval     3s
├─ FPS              60fps
└─ Memory usage     < 150MB

Optimization:
├─ SVG path caching
├─ GSAP hardware acceleration
├─ Debounced zoom events
├─ Lazy character rendering
└─ Efficient D3 selections
```

---

**Ready for Production** ✅
