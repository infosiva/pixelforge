'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useIsMobile } from '@/lib/useIsMobile'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Share2, RotateCcw, Wand2, Maximize2, Play, Trophy, Sparkles, Check, Gamepad2, ChevronRight, Info } from 'lucide-react'
import type { Game } from '@/lib/types'
import { createGamepadManager, fireKey } from '@/lib/gamepad'

interface Props {
  game: Game
  moreGames: Game[]
  isNew: boolean
  demoMode?: boolean
}

// Minimal snake demo for demo mode
const DEMO_GAME_HTML = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0a0a1a;display:flex;align-items:center;justify-content:center;height:100vh;font-family:monospace;}</style></head>
<body>
<script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
<script>
const W=800,H=500,SZ=20;
let snake,dir,food,score,sc,alive=true;
const config={type:Phaser.AUTO,width:W,height:H,backgroundColor:'#0a0a1a',scene:{create,update}};
const game=new Phaser.Game(config);
function create(){
  snake=[{x:20,y:12},{x:19,y:12},{x:18,y:12}];
  dir={x:1,y:0};
  food={x:Math.floor(Math.random()*38)+1,y:Math.floor(Math.random()*23)+1};
  score=0;
  sc=this.add.text(10,10,'Score: 0',{color:'#a78bfa',fontSize:'18px',fontFamily:'monospace'});
  this.add.text(W/2,10,'SNAKE — Arrow keys to move',{color:'rgba(255,255,255,0.3)',fontSize:'13px',fontFamily:'monospace'}).setOrigin(0.5,0);
  this.input.keyboard.on('keydown',({key})=>{
    if(key==='ArrowUp'&&dir.y===0)dir={x:0,y:-1};
    if(key==='ArrowDown'&&dir.y===0)dir={x:0,y:1};
    if(key==='ArrowLeft'&&dir.x===0)dir={x:-1,y:0};
    if(key==='ArrowRight'&&dir.x===0)dir={x:1,y:0};
    if(key==='r'||key==='R'){window.location.reload();}
  });
  this.time.addEvent({delay:130,callback:move,callbackScope:this,loop:true});
  draw.call(this);
}
function move(){
  if(!alive)return;
  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.x>39||head.y<0||head.y>24||snake.some(s=>s.x===head.x&&s.y===head.y)){
    alive=false;
    this.add.text(W/2,H/2,'GAME OVER',{color:'#ef4444',fontSize:'48px',fontFamily:'monospace',fontStyle:'bold'}).setOrigin(0.5);
    this.add.text(W/2,H/2+50,'Score: '+score+' — Press R to restart',{color:'rgba(255,255,255,0.5)',fontSize:'18px',fontFamily:'monospace'}).setOrigin(0.5);
    return;
  }
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){
    score++;sc.setText('Score: '+score);
    food={x:Math.floor(Math.random()*38)+1,y:Math.floor(Math.random()*23)+1};
  } else {snake.pop();}
  draw.call(this);
}
function draw(){
  if(this.g)this.g.destroy();
  this.g=this.add.graphics();
  this.g.fillStyle(0xfbbf24);
  this.g.fillRect(food.x*SZ,food.y*SZ,SZ-2,SZ-2);
  snake.forEach((s,i)=>{
    this.g.fillStyle(i===0?0xa78bfa:0x7c3aed);
    this.g.fillRect(s.x*SZ,s.y*SZ,SZ-2,SZ-2);
  });
}
function update(){}
</script>
</body></html>`

// Per-game controls metadata
const CURATED_CONTROLS: Record<string, { key: string; action: string }[]> = {
  'builtin-snake':       [{ key: 'Arrows', action: 'Steer' }, { key: 'WASD', action: 'Steer' }, { key: '🎮 D-pad', action: 'Steer' }, { key: 'R', action: 'Restart' }],
  'builtin-asteroids':   [{ key: '← →', action: 'Rotate' }, { key: '↑', action: 'Thrust' }, { key: 'Space', action: 'Shoot' }, { key: '🎮 L-stick+A', action: 'Play' }, { key: 'R', action: 'Restart' }],
  'builtin-jumper':      [{ key: '← →', action: 'Move' }, { key: 'Space / ↑', action: 'Jump x2' }, { key: '🎮 Stick+A', action: 'Move & jump' }, { key: 'R', action: 'Restart' }],
  'builtin-breakout':    [{ key: '← →', action: 'Move paddle' }, { key: 'Mouse', action: 'Move paddle' }, { key: '🎮 L-stick', action: 'Move' }, { key: 'R', action: 'Restart' }],
  'builtin-math-rush':   [{ key: '1–4', action: 'Pick answer' }, { key: 'Tap', action: 'Pick answer (mobile)' }, { key: 'R', action: 'Restart' }],
  'builtin-space-battle':[{ key: '← →', action: 'Move ship' }, { key: 'Z / Space', action: 'Fire' }, { key: '🎮 Stick+A', action: 'Play' }, { key: 'R', action: 'Restart' }],
}

// Which key each touch button fires
// action button = Space (fire/jump), R button restarts
// D-pad fires ArrowUp/Down/Left/Right
type TouchBtn = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Space' | 'r'

export default function GamePlayer({ game, moreGames, isNew, demoMode }: Props) {
  const router = useRouter()
  const iframeRef  = useRef<HTMLIFrameElement>(null)
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading]         = useState(true)
  const isLocalGame = game.htmlUrl.startsWith('/games/')
  const [liked, setLiked]             = useState(false)
  const [copied, setCopied]           = useState(false)
  const [fullscreen, setFullscreen]   = useState(false)
  const [score, setScore]             = useState<number | null>(null)
  const [gamepadConnected, setGamepadConnected] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const isMobile = useIsMobile()
  const startTime = useRef(Date.now())

  useEffect(() => {
    if (demoMode) { setHtmlContent(DEMO_GAME_HTML); setLoading(false); return }
    if (!game.htmlUrl) { setLoading(false); return }
    if (isLocalGame) { setLoading(false); return }
    fetch(game.htmlUrl)
      .then(r => r.text())
      .then(html => { setHtmlContent(html); setLoading(false) })
      .catch(() => setLoading(false))
    fetch('/api/play', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId: game.id }) })
  }, [game.id, game.htmlUrl, demoMode, isLocalGame])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'GAME_SCORE') setScore(e.data.score)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    const manager = createGamepadManager((key, down) => {
      iframeRef.current?.contentWindow?.postMessage({ type: 'GAMEPAD_KEY', key, down }, '*')
      fireKey(key, down)
    })
    manager.start()
    const onConnect    = (e: GamepadEvent) => { setGamepadConnected(true);  console.log('[gamepad] connected:', e.gamepad.id) }
    const onDisconnect = ()                 => { setGamepadConnected(false) }
    window.addEventListener('gamepadconnected',    onConnect)
    window.addEventListener('gamepaddisconnected', onDisconnect)
    return () => {
      manager.stop()
      window.removeEventListener('gamepadconnected',    onConnect)
      window.removeEventListener('gamepaddisconnected', onDisconnect)
    }
  }, [])

  // Send touch key into iframe via postMessage
  const sendKey = useCallback((key: TouchBtn, down: boolean) => {
    if (key === 'r') {
      // Restart: reload the iframe instead of sending key (Phaser addKey doesn't catch injected events reliably)
      if (down) {
        const iframe = iframeRef.current
        if (iframe) {
          try { iframe.contentWindow?.location.reload() } catch { /* cross-origin fallback */ }
          // Also try postMessage for games that listen for it
          iframe.contentWindow?.postMessage({ type: 'GAMEPAD_KEY', key: 'r', down: true }, '*')
          iframe.contentWindow?.postMessage({ type: 'GAMEPAD_KEY', key: 'R', down: true }, '*')
        }
      }
      return
    }
    iframeRef.current?.contentWindow?.postMessage({ type: 'GAMEPAD_KEY', key, down }, '*')
  }, [])

  function handleShare() {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
    if (navigator.share) navigator.share({ title: game.title, url })
  }

  function handleRemix() {
    router.push(`/create?remix=${game.id}&prompt=${encodeURIComponent(game.prompt)}`)
  }

  const iframeAttrs = {
    ref: iframeRef,
    sandbox: 'allow-scripts allow-same-origin allow-pointer-lock' as const,
    title: game.title,
    style: { border: 'none', position: 'absolute' as const, inset: 0, width: '100%', height: '100%', display: 'block' } as React.CSSProperties,
  }

  const controls = CURATED_CONTROLS[game.id] ?? []
  const genreEmoji: Record<string, string> = { arcade: '👾', shooter: '🚀', platformer: '🏃', puzzle: '🧩', rpg: '⚔️', other: '🎮' }

  // Touch D-pad button style
  function dBtn(label: string, key: TouchBtn) {
    return (
      <button
        key={key}
        onPointerDown={e => { e.preventDefault(); sendKey(key, true) }}
        onPointerUp={e => { e.preventDefault(); sendKey(key, false) }}
        onPointerLeave={e => { e.preventDefault(); sendKey(key, false) }}
        onPointerCancel={e => { e.preventDefault(); sendKey(key, false) }}
        style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff', fontSize: 20, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', userSelect: 'none', touchAction: 'none',
          backdropFilter: 'blur(6px)',
          WebkitUserSelect: 'none',
        }}
      >{label}</button>
    )
  }

  // Action button (fire / jump)
  function actionBtn(label: string, key: TouchBtn, color: string) {
    return (
      <button
        key={key}
        onPointerDown={e => { e.preventDefault(); sendKey(key, true) }}
        onPointerUp={e => { e.preventDefault(); sendKey(key, false) }}
        onPointerLeave={e => { e.preventDefault(); sendKey(key, false) }}
        onPointerCancel={e => { e.preventDefault(); sendKey(key, false) }}
        style={{
          width: 58, height: 58, borderRadius: '50%',
          background: color, border: '2px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 13, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', userSelect: 'none', touchAction: 'none',
          backdropFilter: 'blur(6px)',
          WebkitUserSelect: 'none',
          boxShadow: `0 0 16px ${color}88`,
        }}
      >{label}</button>
    )
  }

  const TouchControls = () => (
    <div style={{
      position: 'absolute', bottom: 16, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      padding: '0 16px', pointerEvents: 'none', zIndex: 10,
    }}>
      {/* D-pad left side */}
      <div style={{ pointerEvents: 'auto', display: 'grid', gridTemplateColumns: '52px 52px 52px', gridTemplateRows: '52px 52px 52px', gap: 4 }}>
        <div />
        {dBtn('↑', 'ArrowUp')}
        <div />
        {dBtn('←', 'ArrowLeft')}
        {dBtn('↓', 'ArrowDown')}
        {dBtn('→', 'ArrowRight')}
        <div /><div /><div />
      </div>
      {/* Action buttons right side */}
      <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {actionBtn('🔫', 'Space', 'rgba(124,58,237,0.85)')}
        {actionBtn('R', 'r', 'rgba(220,38,38,0.75)')}
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px 48px' }}>

      {/* New game banner */}
      {isNew && (
        <div style={{ margin: '12px 0 16px', padding: '14px 20px', borderRadius: 12, textAlign: 'center', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
          <span style={{ fontSize: 20 }}>🎉</span>
          <span style={{ fontWeight: 700, color: '#c4b5fd', marginLeft: 10 }}>Your game was published! Share it with friends.</span>
        </div>
      )}

      {/* Top bar */}
      <div style={{ paddingTop: 16, paddingBottom: 12 }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>← Arcade</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 'clamp(16px,4vw,22px)', fontWeight: 900, color: '#fff', flex: 1, minWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>{game.title}</h1>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={() => setLiked(l => !l)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: liked ? 'rgba(236,72,153,0.18)' : 'rgba(255,255,255,0.05)', border: `1px solid ${liked ? 'rgba(236,72,153,0.4)' : 'rgba(255,255,255,0.1)'}`, color: liked ? '#f472b6' : 'rgba(255,255,255,0.5)' }}>
              <Heart size={13} fill={liked ? '#f472b6' : 'none'} /> <span className="hide-xs">{game.likeCount + (liked ? 1 : 0)}</span>
            </button>
            <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#4ade80' : 'rgba(255,255,255,0.5)' }}>
              {copied ? <Check size={13} /> : <Share2 size={13} />} <span className="hide-xs">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button onClick={handleRemix} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <RotateCcw size={13} /> <span className="hide-xs">Remix</span>
            </button>
            <Link href="/create" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none', background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff' }}>
              <Wand2 size={13} /> <span className="hide-xs">Build</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main layout: game | sidebar — stacks on mobile via play-layout CSS */}
      <div className="play-layout" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: 16, alignItems: 'start' }}>

        {/* ── Game column ── */}
        <div>
          {/* Game viewport */}
          <div style={{
            position: 'relative', borderRadius: 16, overflow: 'hidden',
            background: '#04040d',
            border: '1px solid rgba(124,58,237,0.3)',
            boxShadow: '0 0 60px rgba(124,58,237,0.15), 0 0 0 1px rgba(255,255,255,0.04)',
            ...(fullscreen ? { position: 'fixed' as const, inset: 0, zIndex: 50, borderRadius: 0 } : {}),
          }}>
            {/* Top bar inside viewport */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'rgba(0,0,0,0.65)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>{game.title.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {score !== null && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: '#fbbf24' }}>
                    <Trophy size={11} /> {score.toLocaleString()}
                  </span>
                )}
                {gamepadConnected && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
                    <Gamepad2 size={11} /> <span className="hide-xs">Controller</span>
                  </span>
                )}
                <button onClick={() => setFullscreen(f => !f)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, padding: '4px 8px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>

            {/* iframe */}
            <div style={{ width: '100%', aspectRatio: isMobile ? '4/3' : '16/10', position: 'relative', background: '#04040d' }}>
              {loading ? (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-pulse-glow">
                    <Play size={24} color="#fff" fill="#fff" />
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Loading game…</p>
                </div>
              ) : isLocalGame ? (
                <iframe {...iframeAttrs} src={game.htmlUrl} sandbox="allow-scripts allow-same-origin" />
              ) : htmlContent ? (
                <iframe {...iframeAttrs} srcDoc={htmlContent} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                  <Sparkles size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>Game unavailable</p>
                </div>
              )}

              {/* On-screen touch controls — mobile only */}
              {isMobile && !loading && (htmlContent || isLocalGame) && (
                <TouchControls />
              )}
            </div>
          </div>

          {/* ── Controls / How to play bar ── */}
          <div style={{ marginTop: 10, borderRadius: 14, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', overflow: 'hidden' }}>
            {/* Header row — always visible */}
            <div
              onClick={() => setShowControls(c => !c)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={14} color="#a78bfa" />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>How to Play</span>
                {!gamepadConnected && !isMobile && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>· plug in controller for gamepad support</span>
                )}
                {isMobile && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>· use on-screen D-pad to play</span>
                )}
              </div>
              <ChevronRight size={14} color="rgba(255,255,255,0.3)" style={{ transform: showControls ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </div>

            {/* Expanded controls */}
            {showControls && (
              <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Mobile notice */}
                {isMobile && (
                  <div style={{ marginTop: 12, marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18 }}>👆</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd', marginBottom: 3 }}>Touch Controls Active</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Use the <strong style={{ color: '#fff' }}>D-pad</strong> (bottom-left) to move and <strong style={{ color: '#7c3aed' }}>🔫</strong> (bottom-right) to fire/jump. <strong style={{ color: '#ef4444' }}>R</strong> restarts the game.</p>
                    </div>
                  </div>
                )}

                {/* Gamepad notice */}
                {!isMobile && (
                  <div style={{ marginTop: 12, marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Gamepad2 size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#4ade80', marginBottom: 3 }}>Controller Support</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                        Plug in any <strong style={{ color: '#fff' }}>Xbox, PlayStation, or USB gamepad</strong> and press a button to activate.<br />
                        D-pad / L-stick = move &nbsp;·&nbsp; A / Cross = jump/fire &nbsp;·&nbsp; Start = pause/restart
                      </p>
                    </div>
                  </div>
                )}

                {/* Keyboard controls */}
                <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Keyboard</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
                  {controls.length > 0 ? controls.map(({ key, action }) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{key}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{action}</span>
                    </div>
                  )) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
                      {[
                        { key: 'Arrows / WASD', action: 'Move' },
                        { key: 'Space', action: 'Jump / Fire' },
                        { key: 'R', action: 'Restart' },
                      ].map(({ key, action }) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ padding: '2px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{key}</span>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{action}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Mobile: more games horizontal strip ── */}
          {isMobile && moreGames.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>More Games</p>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                {moreGames.slice(0, 6).map(g => (
                  <Link key={g.id} href={`/play/${g.id}`} style={{ textDecoration: 'none', flexShrink: 0, width: 120, borderRadius: 12, background: '#12121e', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
                    <span style={{ fontSize: 28 }}>{genreEmoji[g.genre] ?? '🎮'}</span>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{g.title}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{g.genre}</p>
                  </Link>
                ))}
              </div>
              <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: 10, fontSize: 13, color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Browse all →</Link>
            </div>
          )}
        </div>

        {/* ── Sidebar — desktop only ── */}
        {!isMobile && <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Game info card */}
          <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 14 }}>{game.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Genre', value: game.genre },
                { label: 'By', value: game.authorName },
                { label: 'Plays', value: game.playCount.toLocaleString() },
                { label: 'Age', value: game.ageRating ?? '8+' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'capitalize' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Build CTA */}
          <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(124,58,237,0.05))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🤖 Build your own</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 14 }}>Describe any game idea — AI builds it in 15 seconds.</p>
            <Link href="/create" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px', borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              <Wand2 size={14} /> Start Building
            </Link>
          </div>

          {/* More games */}
          {moreGames.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>More Games</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {moreGames.slice(0, 4).map(g => (
                  <Link key={g.id} href={`/play/${g.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: '#12121e', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{genreEmoji[g.genre] ?? '🎮'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.genre}</p>
                    </div>
                    <Play size={12} color="rgba(255,255,255,0.3)" />
                  </Link>
                ))}
              </div>
              <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Browse all →</Link>
            </div>
          )}
        </div>}
      </div>
    </div>
  )
}
