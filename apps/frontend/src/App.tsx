function App() {
  return (
    <main className="min-h-screen bg-race-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-race-silver">
          RaceIQ MVP
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          F1 race strategy, visualized like a pit wall.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-race-silver">
          Simulate tyre choices, pit stops, lap times, race pace, and AI strategy insights.
        </p>

        <button className="mt-8 rounded-xl bg-race-red px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-105">
          Start Simulation
        </button>
      </section>
    </main>
  )
}

export default App