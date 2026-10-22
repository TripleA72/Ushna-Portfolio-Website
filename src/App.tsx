import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Check, Copy, Download, Instagram, Menu, Plus, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import photoData from './data/gallery.json'

gsap.registerPlugin(ScrollTrigger)

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const photos = photoData.map(photo => ({ ...photo, src: assetUrl(photo.src), thumbnail: assetUrl(photo.thumbnail) }))

type Photo = typeof photos[number]
type Category = 'All photographs' | 'Weddings' | 'Portraits' | 'Live music'
const categories: Category[] = ['All photographs', 'Weddings', 'Portraits', 'Live music']
const selected = [73, 18, 2, 54, 26, 76, 12, 9, 64, 15, 4, 48, 28, 82, 6, 47]
const collection = [...selected.map(id => photos.find(photo => photo.id === id)!), ...photos.filter(photo => !selected.includes(photo.id))]
const instagram = 'https://www.instagram.com/ushnamehtab.siddiqui/'
const email = 'ushnamehtabsiddiqui01@gmail.com'

function PhotoViewer({ photo, onClose, onStep, count, index }: { photo: Photo | null; onClose: () => void; onStep: (step: number) => void; count: number; index: number }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const touch = useRef<number | null>(null)
  const open = photo !== null

  useEffect(() => {
    if (!open) return
    const element = dialog.current!
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return <dialog ref={dialog} className="viewer" aria-label="Photograph viewer" onCancel={onClose}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}
    onKeyDown={event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); onStep(1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); onStep(-1) }
    }}>
    {photo && <>
      <div className="viewer-top"><span>USHNA MEHTAB <span className="viewer-divider">/</span> {photo.category}</span><button className="icon-button" aria-label="Close photograph viewer" onClick={onClose} autoFocus><X size={23} /></button></div>
      <div className="viewer-stage">
        <button className="viewer-arrow icon-button" aria-label="Previous photograph" onClick={() => onStep(-1)}><ArrowLeft /></button>
        <img key={photo.id} src={photo.src} alt={photo.alt} onTouchStart={event => { touch.current = event.touches[0].clientX }} onTouchEnd={event => {
          if (touch.current === null) return
          const distance = touch.current - event.changedTouches[0].clientX
          if (Math.abs(distance) > 55) onStep(distance > 0 ? 1 : -1)
          touch.current = null
        }} />
        <button className="viewer-arrow icon-button" aria-label="Next photograph" onClick={() => onStep(1)}><ArrowRight /></button>
      </div>
      <div className="viewer-bottom"><span aria-live="polite">{String(index + 1).padStart(2, '0')} <span className="viewer-divider">/</span> {String(count).padStart(2, '0')}</span><span className="viewer-hint">A moment, held still.</span><a href={photo.post} target="_blank" rel="noreferrer">Original post <ArrowUpRight size={15} /></a></div>
    </>}
  </dialog>
}

function App() {
  const root = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState<Category>('All photographs')
  const [visibleCount, setVisibleCount] = useState(12)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const filtered = category === 'All photographs' ? collection : collection.filter(photo => photo.category === category)
  const activeIndex = filtered.findIndex(photo => photo.id === activeId)
  const activePhoto = activeIndex >= 0 ? filtered[activeIndex] : null

  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.masthead span', { yPercent: 110, duration: 1.15, ease: 'power4.out', delay: 0.1 })
        gsap.from('.hero-photo', { clipPath: 'inset(100% 0 0 0)', duration: 1.25, ease: 'power4.inOut', stagger: 0.12, delay: 0.25 })
        gsap.from('.hero-photo img', { scale: 1.12, duration: 1.8, ease: 'power3.out', stagger: 0.12, delay: 0.25 })
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
          gsap.from(element, { y: 34, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 93%', once: true } })
        })
        gsap.to('.about-photo img', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.about-photo', start: 'top bottom', end: 'bottom top', scrub: true } })
      }, root)
      return () => context.revert()
    })
    return () => media.revert()
  }, [])

  useEffect(() => { ScrollTrigger.refresh() }, [category, visibleCount])
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current) }, [])

  const selectCategory = (next: Category) => { setCategory(next); setVisibleCount(12) }
  const stepPhoto = (step: number) => {
    setActiveId(filtered[(activeIndex + step + filtered.length) % filtered.length].id)
  }
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2400)
    } catch { window.location.href = `mailto:${email}` }
  }

  return <div ref={root}>
    <a className="skip-link" href="#photography">Skip to photographs</a>
    <header className="site-header page-width">
      <a className="wordmark" href="#home" aria-label="Ushna Mehtab home">um<span><Asterisk aria-hidden="true" /></span></a>
      <span className="header-description">Photography &<br />visual stories</span>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation" onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false) }}>
        <a href="#photography" onClick={() => setMenuOpen(false)}>The work <span>01</span></a>
        <a href="#about" onClick={() => setMenuOpen(false)}>The person <span>02</span></a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <ArrowUpRight size={15} /></a>
      </nav>
      <button className="menu-toggle icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main>
      <section id="home" className="hero page-width" aria-labelledby="hero-title">
        <div className="hero-kicker"><span><i className="status-dot" /> An eye for the in-between.</span><span className="hero-kicker-right">A personal collection <Asterisk className="small-star" aria-hidden="true" /></span></div>
        <h1 id="hero-title" className="masthead"><span>USHNA MEHTAB<span className="name-period">.</span></span></h1>
        <div className="hero-triptych">
          {[{ id: 18, label: 'The art of being.', type: 'Portraits' }, { id: 73, label: 'The moments between.', type: 'Weddings' }, { id: 2, label: 'The feeling of being there.', type: 'Live music' }].map((item, index) => {
            const photo = photos.find(p => p.id === item.id)!
            return <button key={item.id} className={`hero-photo hero-photo-${index + 1}`} onClick={() => { setCategory('All photographs'); setActiveId(item.id) }} aria-label={`View ${photo.alt}`}>
              <img src={photo.src} srcSet={`${photo.thumbnail} 560w, ${photo.src} 1200w`} sizes="(max-width: 640px) 70vw, 34vw" alt={photo.alt} fetchPriority="high" width={photo.width} height={photo.height} />
              <span className="photo-open"><Plus size={22} /></span>
              <span className="hero-photo-caption"><span><small>0{index + 1} / {item.type}</small><span>{item.label}</span></span><ArrowUpRight size={23} /></span>
            </button>
          })}
        </div>
        <div className="hero-bottom"><p>Some moments don’t ask for words.<br />Just a different way of seeing.</p><a className="scroll-link" href="#photography"><span>Take a closer look</span><span className="circle-arrow"><ArrowDown size={19} /></span></a></div>
      </section>

      <section className="intro page-width" aria-label="A way of seeing" data-reveal>
        <span className="section-label"><Asterisk className="small-star" aria-hidden="true" /> A feeling, held in a frame</span>
        <p>I’m drawn to the <em>honest</em> moments.<br />The quiet ones. The fleeting ones.<br />The ones that make you <em>feel.</em></p>
        <span className="intro-note">Photography, with feeling.<br />Always, with a story.</span>
      </section>

      <section id="photography" className="work page-width" aria-labelledby="work-title">
        <div className="section-topline" data-reveal><span className="section-label">01 / The work</span><span className="tiny-label">A collection of moments</span></div>
        <div className="work-heading" data-reveal><h2 id="work-title">Selected <em>frames.</em></h2><p>People. Places. The spaces between.<br />A little of the world, through my eyes.</p></div>
        <div className="gallery-toolbar">
          <div className="filters" role="group" aria-label="Filter photographs">{categories.map(item => <button key={item} className={category === item ? 'filter is-active' : 'filter'} aria-pressed={category === item} onClick={() => selectCategory(item)}>{item}<sup>{item === 'All photographs' ? photos.length : photos.filter(p => p.category === item).length}</sup></button>)}</div>
          <span className="gallery-instruction">Click a frame. Stay a while. <ArrowUpRight size={14} /></span>
        </div>
        <div className="gallery-grid" key={category}>
          {filtered.slice(0, visibleCount).map((photo, index) => <article className="gallery-card" key={photo.id}>
            <button className="gallery-photo" data-frame={photo.id} onClick={() => setActiveId(photo.id)} aria-label={`View ${photo.alt}`}>
              <img loading="lazy" decoding="async" src={photo.thumbnail} srcSet={`${photo.thumbnail} 560w, ${photo.src} 1200w`} sizes="(max-width: 540px) 92vw, (max-width: 900px) 46vw, 30vw" alt={photo.alt} width={photo.width} height={photo.height} />
              <span className="gallery-photo-overlay"><span>View frame</span><ArrowUpRight size={22} /></span>
            </button>
            <div className="gallery-caption"><h3>{photo.category === 'Weddings' ? 'Wedding stories' : photo.category === 'Portraits' ? 'A study of people' : 'In the live moment'}</h3><span>{String(index + 1).padStart(2, '0')}</span></div>
          </article>)}
        </div>
        <div className="gallery-footer"><span className="tiny-label" aria-live="polite">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} photographs</span>{visibleCount < filtered.length ? <button className="pill-button" onClick={() => setVisibleCount(count => count + 12)}>A little more to see <Plus size={17} /></button> : <a className="pill-button" href={instagram} target="_blank" rel="noreferrer">The story continues on Instagram <ArrowUpRight size={17} /></a>}<span className="tiny-label gallery-footer-note">Every frame has a feeling.</span></div>
      </section>

      <section id="about" className="about" aria-labelledby="about-title">
        <div className="about-inner page-width">
          <div className="about-photo" data-reveal><img src={assetUrl('/images/ushna-portrait.webp')} alt="Black and white portrait of Ushna Mehtab in window light" loading="lazy" width="1600" height="975" /><span className="about-image-caption">On the other side of the lens.</span></div>
          <div className="about-copy" data-reveal>
            <span className="section-label">02 / The person</span>
            <h2 id="about-title">A storyteller.<br />An observer.<br /><em>A little curious.</em></h2>
            <p>I’m Ushna. I see stories in small gestures, unexpected light, and the moments that happen when no one is looking.</p>
            <p>With a background in film and television, I bring a love of storytelling to the way I see. Whether it’s a wedding, a portrait, or the energy of a live stage, I’m here for the feeling behind the frame.</p>
            <details className="experience"><summary>My film & production background <Plus size={18} /></summary><div className="experience-list"><div><span>Mashion Pk</span><small>Assistant Producer</small></div><div><span>Media Voice Communication</span><small>Associate Producer · 2025</small></div><div><span>Teeli Co.</span><small>Line Producer · 2025</small></div><div><span>Karachi University</span><small>Film & TV · 2022–2025</small></div><a href={assetUrl('/documents/ushna-mehtab-resume.pdf')} download>Download my résumé <Download size={15} /></a></div></details>
            <a className="text-link" href={instagram} target="_blank" rel="noreferrer">A little more of my world <Instagram size={17} /><ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>

      <section id="contact" className="contact page-width" aria-labelledby="contact-title">
        <div className="section-topline" data-reveal><span className="section-label">03 / Let’s make something</span><span className="tiny-label">Good stories start with a conversation.</span></div>
        <div className="contact-main" data-reveal><h2 id="contact-title">Have a story<br /><em>in mind?</em></h2><a className="contact-orb" href={`mailto:${email}`} aria-label="Email Ushna to start a conversation"><ArrowUpRight /><span>Let’s talk</span></a></div>
        <div className="contact-bottom"><div className="email-group"><a href={`mailto:${email}`}>{email}</a><button className="icon-button copy-button" aria-label={copied ? 'Email address copied' : 'Copy email address'} onClick={copyEmail}>{copied ? <Check size={17} /> : <Copy size={17} />}</button><span className="copy-status" role="status">{copied ? 'Copied!' : ''}</span></div><a className="phone-link" href="tel:+923302459922">+92 330 245 9922 <ArrowUpRight size={15} /></a></div>
      </section>
    </main>

    <footer className="site-footer page-width"><a className="footer-logo" href="#home" aria-label="Ushna Mehtab home">um<span><Asterisk aria-hidden="true" /></span></a><span>© {new Date().getFullYear()} Ushna Mehtab</span><a href={instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a><a className="back-top" href="#home">Back to the light <ArrowUpRight size={14} /></a></footer>
    <PhotoViewer photo={activePhoto} onClose={() => setActiveId(null)} onStep={stepPhoto} index={activeIndex} count={filtered.length} />
  </div>
}

export default App
