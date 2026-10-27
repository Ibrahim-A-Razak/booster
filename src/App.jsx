import { useEffect, useState } from 'react'
import './App.css'

const platforms = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Facebook']
const goals = ['Start more conversations', 'Reach new people', 'Earn saves and shares', 'Grow a loyal community']
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const formats = {
  Instagram: ['Carousel breakdown', 'Reel with a clear first line', 'Story question box', 'Photo with a useful caption', 'Behind-the-scenes Reel', 'Community shout-out', 'Weekly recap carousel'],
  TikTok: ['Fast how-to video', 'Reply-to-comment video', 'Three-part story', 'Myth versus fact clip', 'Behind-the-scenes process', 'Stitch or duet with a point of view', 'Weekly lessons recap'],
  YouTube: ['Short tutorial', 'Community poll', 'Shorts: one useful tip', 'Answer a viewer question', 'Searchable mini-explainer', 'Behind-the-scenes update', 'Next-video preview'],
  LinkedIn: ['Practical text post', 'Document carousel', 'A lesson from the week', 'Thoughtful industry question', 'Short case study', 'Useful resource roundup', 'Personal reflection'],
  Facebook: ['Helpful photo post', 'Short native video', 'Ask the community', 'Share a small win', 'Behind-the-scenes update', 'Community recommendation', 'Week-in-review post'],
}
const postDays = {
  3: [0, 2, 4],
  5: [0, 1, 3, 4, 6],
  7: [0, 1, 2, 3, 4, 5, 6],
}
const storageKey = 'goodgrowth-week-plan-v1'

function makePlan({ platform, topic, audience, goal, cadence }) {
  const subject = topic.trim() || 'what you are learning'
  const people = audience.trim() || 'someone new to your work'
  const postingDays = postDays[cadence]

  return weekdays.map((day, index) => {
    const publish = postingDays.includes(index)
    const format = formats[platform][index]
    const prompts = [
      `Show one small ${subject} win. Start with the result, then explain the one step that made it possible for ${people}.`,
      `Share a common ${subject} mistake. Give a kind, specific fix and ask people what they would add.`,
      `Tell a short before-and-after story about ${subject}. Keep the details honest and end with one useful takeaway.`,
      `Answer a question ${people} often ask about ${subject}. Use an example instead of jargon.`,
      `Share your process for ${subject}, including one thing that did not work and what you changed.`,
      `Highlight someone else's helpful idea about ${subject}. Add your own perspective and credit the source.`,
      `Recap one lesson from this week about ${subject}. Invite people to share what they want covered next.`,
    ]
    const actions = [
      'Spend 10 minutes leaving specific, thoughtful comments on posts from people in your community.',
      'Reply to every genuine comment on your latest post with a useful follow-up question.',
      'Visit three relevant community conversations and contribute something helpful without pitching.',
      'Thank someone whose question or feedback helped shape your content this week.',
      'Ask one audience member what they are trying to solve, then listen before planning a reply.',
      'Share or recommend one useful resource from another creator, with clear credit.',
      'Review replies and saves. Note the question people asked most often.',
    ]

    return {
      day,
      publish,
      title: publish ? format : 'Community time',
      prompt: publish ? prompts[index] : actions[index],
      action: publish ? actions[index] : 'Keep it human: respond to real people and stop when your time is up.',
      metric: index === 6 ? 'Review meaningful replies and saves' : goal,
    }
  })
}

function readSavedState() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function App() {
  const [platform, setPlatform] = useState('Instagram')
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [goal, setGoal] = useState(goals[0])
  const [cadence, setCadence] = useState('3')
  const [plan, setPlan] = useState(() => readSavedState()?.plan ?? null)
  const [completed, setCompleted] = useState(() => readSavedState()?.completed ?? {})
  const [notice, setNotice] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copy weekly plan')

  useEffect(() => {
    try {
      if (plan) window.localStorage.setItem(storageKey, JSON.stringify({ plan, completed }))
    } catch {
      return
    }
  }, [plan, completed])

  function generatePlan(event) {
    event.preventDefault()
    const nextPlan = makePlan({ platform, topic, audience, goal, cadence: Number(cadence) })
    setPlan(nextPlan)
    setCompleted({})
    setNotice('Your week is ready. Make it yours, and adjust anything that does not fit.')
    window.setTimeout(() => document.querySelector('#weekly-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function toggleDay(day) {
    setCompleted((current) => ({ ...current, [day]: !current[day] }))
  }

  async function copyPlan() {
    if (!plan) return
    const text = plan.map(({ day, title, prompt, action }) => `${day} · ${title}\n${prompt}\nCommunity action: ${action}`).join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopyLabel('Plan copied')
      window.setTimeout(() => setCopyLabel('Copy weekly plan'), 1800)
    } catch {
      setNotice('Clipboard access is unavailable here. You can still select and copy the plan text.')
    }
  }

  function clearPlan() {
    setPlan(null)
    setCompleted({})
    setNotice('')
    try { window.localStorage.removeItem(storageKey) } catch { /* Local storage is optional. */ }
  }

  const doneCount = Object.values(completed).filter(Boolean).length

  return (
    <div className="studio-shell">
      <div className="topline"><span>GOODGROWTH STUDIO</span><span>FREE, PRACTICAL, HUMAN-FIRST</span></div>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Goodgrowth home"><span className="wordmark-symbol">g</span>goodgrowth</a>
        <nav aria-label="Main navigation"><a href="#method">The approach</a><a href="#planner">Make a plan</a><a href="#principles">Principles</a></nav>
        <a className="header-cta" href="#planner">Build my week <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-copy">
            <p className="overline"><span className="overline-dot" /> REAL PEOPLE. REAL CONVERSATIONS.</p>
            <h1>Grow your<br />audience by<br /><em>showing up.</em></h1>
            <p className="hero-description">A free, thoughtful weekly plan to help your work find the people it is for. No bots, no account connection, no shortcuts that put your account at risk.</p>
            <a className="hero-cta" href="#planner">Make my free plan <span aria-hidden="true">↓</span></a>
            <p className="free-note"><span>✳</span> Free to use. No sign-up needed.</p>
          </div>
          <div className="hero-art" aria-label="Creator planning a week of helpful posts">
            <div className="art-stamp">YOUR IDEAS<br />HAVE A PLACE<br /><span>TO GROW.</span></div>
            <div className="desk-photo"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85" alt="Creator smiling while planning content" /></div>
            <div className="sticky-note"><span>THIS WEEK</span><strong>Share what<br />you know.</strong><i>Start small ↗</i></div>
            <div className="art-caption">A LITTLE CONSISTENCY<br />BEATS A BIG HACK.</div>
          </div>
          <span className="hero-index">01 / A BETTER KIND OF GROWTH</span>
        </section>

        <section className="promise-band" aria-label="Goodgrowth principles"><span>NO BOTS</span><i>✳</i><span>NO PASSWORDS</span><i>✳</i><span>NO PAYWALL</span><i>✳</i><span>JUST GOOD WORK</span></section>

        <section id="method" className="method-section section-width">
          <div className="section-label">THE APPROACH <span>01—03</span></div>
          <div className="method-content"><h2>Engagement is<br /><em>earned together.</em></h2><p>Healthy growth comes from useful work, steady practice, and actual conversations. This studio turns that into a manageable week you can adapt to your own voice.</p></div>
          <div className="method-points"><article><span>01</span><h3>Make something useful</h3><p>Share one clear idea for a real person, not a trick for an algorithm.</p></article><article><span>02</span><h3>Join the conversation</h3><p>Spend time with your community and respond with care.</p></article><article><span>03</span><h3>Learn and repeat</h3><p>Notice what led to genuine replies, saves, and return visits.</p></article></div>
        </section>

        <section id="planner" className="planner-section">
          <div className="planner-wrap">
            <div className="planner-heading"><p className="overline">YOUR NEXT SEVEN DAYS</p><h2>Small steps.<br /><em>Real momentum.</em></h2><p>Tell us what you make and who it helps. Your plan stays in this browser.</p></div>
            <form className="planner-form" onSubmit={generatePlan}>
              <div className="form-heading"><span>FREE WEEKLY PLANNER</span><span>02 / PERSONALIZE</span></div>
              <label>Where do you want to grow?<select value={platform} onChange={(event) => setPlatform(event.target.value)}>{platforms.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>What do you create?<input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. budget-friendly home cooking" maxLength={70} /></label>
              <label>Who do you want to help?<input value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="e.g. students learning to cook" maxLength={70} /></label>
              <div className="form-split"><label>What matters this week?<select value={goal} onChange={(event) => setGoal(event.target.value)}>{goals.map((item) => <option key={item}>{item}</option>)}</select></label><label>Posting pace<select value={cadence} onChange={(event) => setCadence(event.target.value)}><option value="3">3 posts / week</option><option value="5">5 posts / week</option><option value="7">Daily posts</option></select></label></div>
              <button className="build-button" type="submit">Build my free week <span aria-hidden="true">↗</span></button>
              <p className="form-footnote">No login or social account access. Your answers are used only to shape this plan.</p>
            </form>
          </div>
        </section>

        {plan && <section id="weekly-plan" className="weekly-section section-width" aria-live="polite">
          <div className="weekly-top"><div><p className="overline">YOUR PERSONAL PLAN</p><h2>A week of <em>good work.</em></h2><p className="progress-copy">{doneCount} of 7 days complete <span className="progress-track"><i style={{ width: `${doneCount / 7 * 100}%` }} /></span></p></div><div className="plan-actions"><button type="button" className="copy-button" onClick={copyPlan}>{copyLabel}</button><button type="button" className="reset-button" onClick={clearPlan}>Clear plan</button></div></div>
          <div className="plan-grid">{plan.map((item, index) => <article className={`plan-day ${completed[item.day] ? 'is-done' : ''}`} key={item.day}>
            <div className="day-top"><span>0{index + 1} / {item.day.toUpperCase()}</span><label className="done-toggle"><input type="checkbox" checked={Boolean(completed[item.day])} onChange={() => toggleDay(item.day)} /><span>{completed[item.day] ? 'DONE' : 'MARK DONE'}</span></label></div>
            <span className={`day-type ${item.publish ? '' : 'community-type'}`}>{item.publish ? 'POST IDEA' : 'COMMUNITY PRACTICE'}</span>
            <h3>{item.title}</h3><p>{item.prompt}</p>
            <div className="day-action"><span>THEN, TAKE 10 MINUTES</span><p>{item.action}</p></div>
            <div className="day-metric"><span>NOTICE</span><strong>{item.metric}</strong></div>
          </article>)}</div>
          <p className="plan-note">Prompts are starting points, not scripts. Use your own voice, respect each platform’s rules, and skip anything that does not fit.</p>
          {notice && <p className="status-message" role="status">{notice}</p>}
        </section>}

        <section id="principles" className="principles-section">
          <div className="principles-inner section-width"><div><p className="overline">A NOTE ON GROWTH</p><h2>Keep it <em>human.</em></h2></div><div className="principles-copy"><p>There is no honest way to promise free followers overnight. This tool helps you practice the things that can create durable engagement: useful posts, clear points of view, and real participation.</p><p>We never ask for your password, automate likes or follows, scrape accounts, or send messages on your behalf. Your plan is yours to edit, do, or ignore.</p><a href="#planner">Make another plan <span aria-hidden="true">↗</span></a></div></div>
        </section>
      </main>

      <footer className="site-footer"><a className="wordmark" href="#home"><span className="wordmark-symbol">g</span>goodgrowth</a><span>Free creator planning studio · Runs in your browser</span><a href="#home">BACK TO TOP ↑</a></footer>
    </div>
  )
}

export default App