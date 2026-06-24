const steps: [string, string, string][] = [
  [
    '01',
    'Buy below replacement cost',
    'Target small and mid-size multifamily assets where operational inefficiency creates upside.',
  ],
  [
    '02',
    'Force NOI growth',
    'Renovate units, professionalize management, reduce expenses, and capture rent gaps.',
  ],
  [
    '03',
    'Exit into demand',
    'Sell or refinance stabilized assets once risk has been reduced and cash flow has improved.',
  ],
];

export default function Strategy() {
  return (
    <section className="section pt-36 pb-20">
      <p className="gold uppercase tracking-[.28em] text-xs font-black">Investment Strategy</p>
      <h1 className="text-5xl md:text-7xl font-black tracking-[-0.07em] mt-4">
        Value-add multifamily, with discipline.
      </h1>

      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {steps.map(([n, t, d]) => (
          <div className="glass rounded-[2rem] p-8" key={n}>
            <div className="gold font-black text-5xl">{n}</div>
            <h3 className="text-2xl font-black mt-6">{t}</h3>
            <p className="muted mt-3 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-[2rem] p-10 mt-8">
        <p className="gold uppercase tracking-[.24em] text-xs font-black">Our Thesis</p>
        <h2 className="text-3xl font-black tracking-[-0.04em] mt-4">
          Small assets. Institutional discipline.
        </h2>
        <p className="muted leading-relaxed mt-4 max-w-3xl">
          We focus on 4–20 unit multifamily properties in supply-constrained Northeast markets
          where price discovery is inefficient, management is underperforming, and rent-to-market
          gaps offer asymmetric upside. Our edge is execution: we move fast, underwrite
          conservatively, and build in margin of safety at every step.
        </p>
      </div>
    </section>
  );
}
