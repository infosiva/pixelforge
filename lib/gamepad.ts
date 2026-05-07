/**
 * Gamepad API wrapper — maps controller buttons to keyboard events.
 * Works with Xbox, PlayStation, Switch Pro, and generic USB controllers.
 * Injected into the parent page; posts mapped keys via postMessage to the game iframe.
 *
 * Button mapping (standard layout):
 *   0 = A / Cross       → Space / Enter
 *   1 = B / Circle      → Escape / X
 *   2 = X / Square      → Z / Shift
 *   3 = Y / Triangle    → C / Alt
 *   9 = Start           → Enter
 *   12 = D-pad Up       → ArrowUp
 *   13 = D-pad Down     → ArrowDown
 *   14 = D-pad Left     → ArrowLeft
 *   15 = D-pad Right    → ArrowRight
 *   Axis 0 (LX < -0.5)  → ArrowLeft
 *   Axis 0 (LX >  0.5)  → ArrowRight
 *   Axis 1 (LY < -0.5)  → ArrowUp
 *   Axis 1 (LY >  0.5)  → ArrowDown
 */

export const BUTTON_MAP: Record<number, string> = {
  0:  'Space',
  1:  'Escape',
  2:  'KeyZ',
  3:  'KeyC',
  9:  'Enter',
  12: 'ArrowUp',
  13: 'ArrowDown',
  14: 'ArrowLeft',
  15: 'ArrowRight',
}

export interface GamepadState {
  connected: boolean
  id: string
  buttons: boolean[]
  axes: number[]
}

export function createGamepadManager(onKey: (key: string, down: boolean) => void) {
  const prevButtons = new Map<number, boolean>()
  const prevAxes = { left: '', right: '', up: '', down: '' }
  let raf: number

  function poll() {
    const gamepads = navigator.getGamepads?.() ?? []
    for (const gp of gamepads) {
      if (!gp) continue

      // Buttons
      gp.buttons.forEach((btn, i) => {
        const key = BUTTON_MAP[i]
        if (!key) return
        const pressed = btn.pressed
        const wasPressed = prevButtons.get(i) ?? false
        if (pressed !== wasPressed) {
          prevButtons.set(i, pressed)
          onKey(key, pressed)
        }
      })

      // Left stick axes
      const lx = gp.axes[0] ?? 0
      const ly = gp.axes[1] ?? 0
      const DEAD = 0.4

      const newLeft  = lx < -DEAD
      const newRight = lx >  DEAD
      const newUp    = ly < -DEAD
      const newDown  = ly >  DEAD

      if (newLeft  !== (prevAxes.left  === 'down')) { prevAxes.left  = newLeft  ? 'down' : ''; onKey('ArrowLeft',  newLeft)  }
      if (newRight !== (prevAxes.right === 'down')) { prevAxes.right = newRight ? 'down' : ''; onKey('ArrowRight', newRight) }
      if (newUp    !== (prevAxes.up    === 'down')) { prevAxes.up    = newUp    ? 'down' : ''; onKey('ArrowUp',    newUp)    }
      if (newDown  !== (prevAxes.down  === 'down')) { prevAxes.down  = newDown  ? 'down' : ''; onKey('ArrowDown',  newDown)  }
    }
    raf = requestAnimationFrame(poll)
  }

  return {
    start() { raf = requestAnimationFrame(poll) },
    stop()  { cancelAnimationFrame(raf) },
  }
}

/** Inject virtual keyboard events into document (for parent page controls) */
export function fireKey(key: string, down: boolean) {
  const type = down ? 'keydown' : 'keyup'
  const evt = new KeyboardEvent(type, { key, code: key, bubbles: true, cancelable: true })
  document.dispatchEvent(evt)
}
