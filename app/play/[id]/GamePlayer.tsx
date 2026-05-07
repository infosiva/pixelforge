'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Share2, RotateCcw, Wand2, Maximize2, Play, Trophy, Sparkles, Check, Gamepad2 } from 'lucide-react'
import GameCard from '@/components/GameCard'
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
  // food
  this.g.fillStyle(0xfbbf24);
  this.g.fillRect(food.x*SZ,food.y*SZ,SZ-2,SZ-2);
  // snake
  snake.forEach((s,i)=>{
    this.g.fillStyle(i===0?0xa78bfa:0x7c3aed);
    this.g.fillRect(s.x*SZ,s.y*SZ,SZ-2,SZ-2);
  });
}
function update(){}
</script>
</body></html>`

export default function GamePlayer({ game, moreGames, isNew, demoMode }: Props) {
  const router = useRouter()
  const iframeRef  = useRef<HTMLIFrameElement>(null)
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading]         = useState(true)
  const [liked, setLiked]             = useState(false)
  const [copied, setCopied]           = useState(false)
  const [fullscreen, setFullscreen]   = useState(false)
  const [score, setScore]             = useState<number | null>(null)
  const [gamepadConnected, setGamepadConnected] = useState(false)
  const startTime = useRef(Date.now())

  useEffect(() => {
    if (demoMode) {
      setHtmlContent(DEMO_GAME_HTML)
      setLoading(false)
      return
    }
    if (!game.htmlUrl) { setLoading(false); return }
    fetch(game.htmlUrl)
      .then(r => r.text())
      .then(html => { setHtmlContent(html); setLoading(false) })
      .catch(() => setLoading(false))
    // Count play
    fetch('/api/play', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId: game.id }) })
  }, [game.id, game.htmlUrl, demoMode])

  // ESC exits fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Listen for score events from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'GAME_SCORE') setScore(e.data.score)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Gamepad support — forward controller inputs as keyboard events to iframe
  useEffect(() => {
    const manager = createGamepadManager((key, down) => {
      // Fire into parent document — Phaser in iframe picks up via its own gamepad polling
      // Also fire keyboard events so keyboard-only games get controller input
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
    sandbox: 'allow-scripts' as const,
    className: 'w-full h-full',
    style: { border: 'none', display: 'block' },
    title: game.title,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* New game celebration */}
      {isNew && (
        <div className="mb-4 p-4 rounded-2xl text-center animate-fade-up"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
          <div className="text-2xl mb-1">🎉</div>
          <p className="font-bold text-purple-300">Your game was published!</p>
          <p className="text-sm text-white/40">Share it with friends or explore the arcade below</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: game + controls */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-white line-clamp-1">{game.title}</h1>
              <p className="text-sm text-white/40 mt-0.5 line-clamp-2">{game.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Like */}
              <button onClick={() => setLiked(l => !l)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${liked ? 'text-pink-400' : 'text-white/40 hover:text-pink-400'}`}
                style={{ background: liked ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${liked ? 'rgba(236,72,153,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                <Heart className={`w-4 h-4 ${liked ? 'fill-pink-400' : ''}`} />
                <span>{game.likeCount + (liked ? 1 : 0)}</span>
              </button>
              {/* Share */}
              <button onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white/40 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              {/* Remix */}
              <button onClick={handleRemix}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white/40 hover:text-purple-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <RotateCcw className="w-4 h-4" /> Remix
              </button>
            </div>
          </div>

          {/* Game viewport */}
          <div className={`relative rounded-2xl overflow-hidden ${fullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
            style={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: fullscreen ? 'unset' : '16/10' }}>
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse-glow"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
                <p className="text-sm text-white/40">Loading game…</p>
              </div>
            ) : htmlContent ? (
              <iframe
                {...iframeAttrs}
                srcDoc={htmlContent}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                <Sparkles className="w-10 h-10 mb-3 opacity-30" />
                <p>Game unavailable</p>
              </div>
            )}
            {/* Fullscreen toggle */}
            <button onClick={() => setFullscreen(f => !f)}
              className="absolute bottom-3 right-3 p-2 rounded-lg text-white/40 hover:text-white transition-colors"
              style={{ background: 'rgba(0,0,0,0.5)' }}>
              <Maximize2 className="w-4 h-4" />
            </button>
            {/* Score overlay */}
            {score !== null && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fbbf24' }}>
                <Trophy className="w-4 h-4" /> {score}
              </div>
            )}
          </div>

          {/* Game meta */}
          <div className="flex items-center gap-4 mt-3 text-xs text-white/25 flex-wrap">
            <span className="chip">{game.genre}</span>
            <span>by {game.authorName}</span>
            <span>{game.playCount.toLocaleString()} plays</span>
            {game.remixedFromId && <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" />remixed</span>}
            {gamepadConnected
              ? <span className="flex items-center gap-1 text-green-400"><Gamepad2 className="w-3 h-3" />Controller connected</span>
              : <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" />Plug in controller to play</span>
            }
          </div>

          {/* Build your own CTA */}
          <div className="mt-6 p-4 rounded-2xl flex items-center gap-4"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">Build your own game like this</p>
              <p className="text-xs text-white/40 mt-0.5">Describe any idea — AI builds a playable game in ~15 seconds</p>
            </div>
            <Link href="/create" className="btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex-shrink-0">
              <Wand2 className="w-4 h-4" /> Create
            </Link>
          </div>
        </div>

        {/* Right: more games */}
        {moreGames.length > 0 && (
          <div className="lg:w-72 flex-shrink-0">
            <h3 className="font-bold text-sm text-white/60 uppercase tracking-wide mb-3">More games</h3>
            <div className="space-y-3">
              {moreGames.map(g => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
            <Link href="/" className="block text-center mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors font-semibold">
              Browse all games →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
