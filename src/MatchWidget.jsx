import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'https://united-match-backend.vercel.app'
const UNITED_CREST = 'https://crests.football-data.org/66.png'
const TIME_UNITS = [
    { key: 'days', label: 'Days' },
    { key: 'hours', label: 'Hours' },
    { key: 'minutes', label: 'Minutes' },
    { key: 'seconds', label: 'Seconds' },
]
const PLAYERS = [
    {
        name: 'Bruno Fernandes',
        number: '08',
        position: 'MIDFIELDER',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/4896330/media_102559977_102167101.jpg?fmt=webp&f=center&w=1024&h=1396',
    },
    {
        name: 'Amad Diallo',
        number: '16',
        position: 'FORWARD',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/4896326/media_102559906_102167030.jpg?fmt=webp&f=center&w=1024&h=1396',
    },
    {
        name: 'Matheus Cunha',
        number: '10',
        position: 'FORWARD',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/4896326/media_102559903_102167027.jpg?fmt=webp&f=center&w=1024&h=1396',
    },
    {
        name: 'Bryan Mbeumo',
        number: '19',
        position: 'FORWARD',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/4896326/media_102559904_102167026.jpg?fmt=webp&f=center&w=1024&h=1396',
    },
    {
        name: 'Kobbie Mainoo',
        number: '37',
        position: 'MIDFIELDER',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/4896330/media_102559979_102167103.jpg?fmt=webp&f=center&w=1024&h=1396',
    },
    {
        name: 'Senne Lammens',
        number: '01',
        position: 'GOALKEEPER',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/4896327/media_102559948_102167072.jpg?fmt=webp&f=center&w=1024&h=1396',
    },
    {
        name: 'Youri Tielemans',
        number: '18',
        position: 'MIDFIELDER',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/5368351/media_114350399_113959456.jpg?fmt=webp&f=center&w=1024&h=1396',
    },
    {
        name: 'Marcus Rashford',
        number: '09',
        position: 'FORWARD',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/6061204/media_123351904_122966197_compressed.jpg?fmt=webp&f=center&w=720&h=1080',
    },
    {
        name: 'Benjamin Šeško',
        number: '30',
        position: 'FORWARD',
        image: 'https://dynamic-crop-cdn.scoreplay.io/472/4896326/media_102559907_102167031.jpg?fmt=webp&f=center&w=1024&h=1396',
    },
]

function PlayerCarousel() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [paused, setPaused] = useState(false)
    const player = PLAYERS[activeIndex]

    useEffect(() => {
        if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

        const intervalId = window.setInterval(() => {
            setActiveIndex((currentIndex) => (currentIndex + 1) % PLAYERS.length)
        }, 4000)
        return () => window.clearInterval(intervalId)
    }, [paused])

    function moveBy(offset) {
        setActiveIndex((currentIndex) => (currentIndex + offset + PLAYERS.length) % PLAYERS.length)
    }

    return (
        <section
            className="player-carousel"
            role="region"
            aria-label="Manchester United first-team players"
            aria-roledescription="carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
            }}
        >
            <img
                key={player.name}
                className="player-carousel-image"
                src={player.image}
                alt={`${player.name}, Manchester United first-team player`}
            />
            <span className="player-number" aria-hidden="true">{player.number}</span>
            <div className="player-detail" aria-live="off">
                <span className="player-position">{player.position} · FIRST TEAM</span>
                <h1 className="player-name">{player.name}</h1>
            </div>
            <div className="player-controls">
                <button className="carousel-arrow" type="button" aria-label="Previous player" onClick={() => moveBy(-1)} title="Previous player">‹</button>
                <button className="carousel-arrow" type="button" aria-label="Next player" onClick={() => moveBy(1)} title="Next player">›</button>
            </div>
            <div className="player-indicators" aria-label="Choose a player">
                {PLAYERS.map((item, index) => (
                    <button
                        className={`player-indicator${index === activeIndex ? ' is-active' : ''}`}
                        key={item.name}
                        type="button"
                        aria-label={`Show ${item.name}`}
                        aria-pressed={index === activeIndex}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </section>
    )
}

function useCountdown(kickoff) {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const intervalId = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(intervalId)
    }, [])

    if (!kickoff) return null

    const totalSeconds = Math.max(0, Math.floor((new Date(kickoff).getTime() - now) / 1000))
    return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
    }
}

function MatchSkeleton() {
    return (
        <div className="match-skeleton" aria-label="Loading next match" role="status">
            <span className="skeleton-line skeleton-short" />
            <span className="skeleton-line skeleton-title" />
            <span className="skeleton-line skeleton-wide" />
            <span className="skeleton-line skeleton-countdown" />
        </div>
    )
}

function formatKickoff(value) {
    return new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    }).format(new Date(value))
}

export default function MatchWidget() {
    const [theme, setTheme] = useState(() => window.localStorage.getItem('match-theme') || 'dark')
    const [match, setMatch] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const countdown = useCountdown(match?.kickoff)

    useEffect(() => {
        window.localStorage.setItem('match-theme', theme)
    }, [theme])

    useEffect(() => {
        const controller = new AbortController()

        async function loadMatch() {
            try {
                const response = await fetch(`${API_BASE}/api/match/next`, { signal: controller.signal })
                const data = await response.json()
                if (!response.ok) throw new Error(data.error || 'Could not load the next match.')
                setMatch(data)
            } catch (requestError) {
                if (requestError.name !== 'AbortError') setError(requestError.message)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        loadMatch()
        return () => controller.abort()
    }, [])

    return (
        <main className="match-page min-h-screen text-white" data-theme={theme}>
            <header className="site-header mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
                <a className="brand-lockup flex items-center gap-3" href="#top" aria-label="Manchester United home">
                    <img className="brand-mark" src={UNITED_CREST} alt="" />
                    <span className="brand-name">MANCHESTER<br />UNITED</span>
                </a>
                <div className="header-tools">
                    <span className="header-season">MATCHDAY / 2026—27</span>
                    <div className="theme-switch" role="group" aria-label="Choose appearance">
                        <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>Light</button>
                        <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>Dark</button>
                    </div>
                </div>
            </header>

            <section className="match-shell mx-auto w-full max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pt-16" id="top">
                <div className="section-kicker"><span /> THE NEXT FIXTURE</div>
                <div className="match-layout mt-6">
                    <div className="match-copy">
                        <p className="eyebrow">THE ROAD TO KICK-OFF</p>
                        <PlayerCarousel />
                        {loading ? <MatchSkeleton /> : error ? (
                            <div className="error-banner" role="alert">
                                <strong>Fixture unavailable</strong>
                                <span>{error}</span>
                                <button type="button" onClick={() => window.location.reload()}>Try again</button>
                            </div>
                        ) : match && (
                            <div className="fixture-meta">
                                <div className="competition-line">
                                    {match.competitionEmblem && <img src={match.competitionEmblem} alt="" />}
                                    <span>{match.competition}</span>
                                </div>
                                <p>{formatKickoff(match.kickoff)}</p>
                                <p>{match.isHome ? 'Old Trafford, Manchester' : match.venue}</p>
                            </div>
                        )}
                    </div>

                    <div className="match-visual" aria-label="Next Manchester United match">
                        <div className="visual-orbit orbit-one" />
                        <div className="visual-orbit orbit-two" />
                        <div className="visual-cross" aria-hidden="true">✳</div>
                        <div className="fixture-teams">
                            <img className="team-crest united-crest" src={UNITED_CREST} alt="Manchester United crest" />
                            <span className="versus">VS</span>
                            {match?.opponentCrest ? (
                                <img className="team-crest opponent-crest" src={match.opponentCrest} alt={`${match.opponent} crest`} />
                            ) : (
                                <div className="team-crest opponent-crest opponent-placeholder" aria-label={match?.opponent || 'Opponent'}>
                                    {match?.opponent?.slice(0, 1) || '?'}
                                </div>
                            )}
                        </div>
                        <div className="opponent-name">{loading ? 'LOADING FIXTURE' : error ? 'MATCHDAY' : match?.opponent || 'UP NEXT'}</div>
                        <div className="venue-tag">{match ? (match.isHome ? 'HOME · OLD TRAFFORD' : 'AWAY FIXTURE') : 'MANCHESTER UNITED'}</div>
                        <div className="visual-caption">MANCHESTER<br />IS RED</div>
                    </div>
                </div>

                {!loading && !error && match && countdown && (
                    <div className="countdown-block" aria-label="Time until kick-off" aria-live="off">
                        <div className="countdown-heading">
                            <span>UNTIL KICK-OFF</span>
                            <span className="countdown-date">{formatKickoff(match.kickoff)}</span>
                        </div>
                        <div className="countdown-grid">
                            {TIME_UNITS.map(({ key, label }) => (
                                <div className="time-unit" key={key}>
                                    <span className="time-value" key={countdown[key]}>{String(countdown[key]).padStart(2, '0')}</span>
                                    <span className="time-label">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
            <footer className="page-footer mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
                <span>UNITED, ALWAYS.</span>
                <span>GLORY, GLORY, MAN UNITED</span>
                <span className="photo-credit">
                    Photo: <a href="https://commons.wikimedia.org/wiki/File:Stretford_End_2019.jpg" target="_blank" rel="noreferrer">Luis.ortizgt07 / Wikimedia Commons</a>
                    {' · '}
                    <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
                </span>
            </footer>
        </main>
    )
}