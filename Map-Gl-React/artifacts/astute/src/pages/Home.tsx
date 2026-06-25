import { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Building2, ChevronDown, Gauge, Layers, MapPin, Radar, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { PROPERTIES, fmtCurrency, totalUnits } from '../lib/portfolioData';
import type { Property } from '../lib/portfolioData';
import MapBackground from '../components/home/MapBackground';
import type { MapBackgroundHandle } from '../components/home/MapBackground';
import ParticleField from '../components/home/ParticleField';
import type { CameraOptions, LandmarkName } from '../components/home/CinematicMapCanvas';
import useCinematicScrollController from '../hooks/useCinematicScrollController';
import useLenisScroll from '../hooks/useLenisScroll';
import AnimatedNumber from '../components/motion/AnimatedNumber';
import RevealWords from '../components/motion/RevealWords';
import AnimatedChartShell from '../components/motion/AnimatedChartShell';

const SCORE_COLOR = (s: number) => s >= 90 ? '#63CFA6' : s >= 85 ? '#8DB7FF' : '#DCC8A3';

type ChapterType = 'hero' | 'landmark' | 'transition' | 'property' | 'outro';

interface Chapter {
  id: string;
  type: ChapterType;
  title: string;
  subtitle: string;
  city: string;
  camera: CameraOptions;
  propertyId?: string;
  landmarkName?: LandmarkName;
  metric?: { label: string; value: number; suffix?: string; prefix?: string };
}

interface NumericMetric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

interface BentoSection {
  eyebrow: string;
  title: string;
  body: string;
  metric: NumericMetric;
  to: string;
  cta: string;
}

const CINEMATIC_CHAPTERS: Chapter[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Map deals faster. Underwrite smarter.',
    subtitle: 'Astute turns properties, market signals, risk, and future capital tracking into one cinematic investment operating system.',
    city: 'Regional Overview',
    camera: { center: [-73.62, 41.28], zoom: 6.65, pitch: 18, bearing: -9, duration: 2200 },
    metric: { label: 'Tracked markets', value: 3 },
  },
  {
    id: 'manhattan-core',
    type: 'landmark',
    title: 'New York Market Core',
    subtitle: 'Capital concentration, commuter gravity, and persistent housing demand define the underwriting baseline.',
    city: 'Manhattan',
    landmarkName: 'Manhattan',
    camera: { center: [-73.9855, 40.758], zoom: 12.25, pitch: 54, bearing: -34, duration: 2900 },
    metric: { label: 'Demand signal', value: 91 },
  },
  {
    id: 'hudson-crossing',
    type: 'landmark',
    title: 'Hudson Crossing Access',
    subtitle: 'Bridge, tunnel, rail, and waterfront access shape the rental demand field around New York.',
    city: 'Hudson Corridor',
    landmarkName: 'George Washington Bridge',
    camera: { center: [-73.9527, 40.8517], zoom: 13.35, pitch: 58, bearing: 42, duration: 2500 },
    metric: { label: 'Transit access', value: 94 },
  },
  {
    id: 'yonkers-rail',
    type: 'landmark',
    title: 'Westchester Rail Node',
    subtitle: 'Yonkers Station anchors a northern commuter basin with supply-constrained multifamily stock.',
    city: 'Yonkers',
    landmarkName: 'Yonkers Station',
    camera: { center: [-73.8847, 40.9357], zoom: 14.15, pitch: 54, bearing: 24, duration: 2100 },
    metric: { label: 'Rail signal', value: 86 },
  },
  {
    id: 'yonkers-property-1',
    type: 'property',
    title: 'Elliott Avenue Quadruplex',
    subtitle: 'Stable income, below-market rent upside, and a clean light-renovation path.',
    city: 'Yonkers',
    propertyId: 'elliott-yonkers',
    camera: { center: [-73.8988, 40.9312], zoom: 15.45, pitch: 56, bearing: -28, duration: 2200 },
  },
  {
    id: 'yonkers-property-2',
    type: 'property',
    title: '92 Elliott Avenue',
    subtitle: 'A second nearby income node with strong going-in yield and manageable execution.',
    city: 'Yonkers',
    propertyId: 'elliott-92',
    camera: { center: [-73.8975, 40.932], zoom: 15.55, pitch: 58, bearing: 18, duration: 1900 },
  },
  {
    id: 'hudson-county-access',
    type: 'landmark',
    title: 'Hudson County Access',
    subtitle: 'Jersey City waterfront, Lincoln Tunnel proximity, and Newark Penn create a dense commuter web.',
    city: 'Hudson County',
    landmarkName: 'Jersey City Waterfront',
    camera: { center: [-74.041, 40.742], zoom: 11.75, pitch: 50, bearing: -22, duration: 2400 },
    metric: { label: 'Commuter demand', value: 89 },
  },
  {
    id: 'union-city-property',
    type: 'property',
    title: 'Summit Ave Multifamily',
    subtitle: 'A high-upside basis play with major rent-to-market opportunity.',
    city: 'Union City',
    propertyId: 'union-city-summit',
    camera: { center: [-74.0263, 40.7695], zoom: 15.35, pitch: 57, bearing: -18, duration: 2200 },
  },
  {
    id: 'leaving-nyc',
    type: 'transition',
    title: 'Leaving NYC',
    subtitle: 'The camera pulls back before transferring from Hudson density to Boston innovation markets.',
    city: 'Market Transfer',
    camera: { center: [-73.15, 41.22], zoom: 7.05, pitch: 20, bearing: 34, duration: 3900 },
  },
  {
    id: 'welcome-boston',
    type: 'transition',
    title: 'Welcome to Boston',
    subtitle: 'Education, biotech, transit, and supply-constrained housing reset the opportunity map.',
    city: 'Boston Metro',
    camera: { center: [-71.075, 42.36], zoom: 11.25, pitch: 48, bearing: -32, duration: 3400 },
  },
  {
    id: 'boston-core',
    type: 'landmark',
    title: 'Boston Civic Core',
    subtitle: 'Historic center, persistent renter demand, and deep capital-market liquidity.',
    city: 'Boston',
    landmarkName: 'Boston Common',
    camera: { center: [-71.0656, 42.3555], zoom: 13.25, pitch: 55, bearing: 28, duration: 2300 },
    metric: { label: 'Liquidity depth', value: 88 },
  },
  {
    id: 'cambridge-spine',
    type: 'landmark',
    title: 'Cambridge Innovation Spine',
    subtitle: 'Harvard, MIT, and Kendall Square create durable demand pressure.',
    city: 'Cambridge',
    landmarkName: 'Harvard / MIT area',
    camera: { center: [-71.097, 42.369], zoom: 13.65, pitch: 60, bearing: -48, duration: 2600 },
    metric: { label: 'Innovation score', value: 96 },
  },
  {
    id: 'davis-square',
    type: 'landmark',
    title: 'Davis Square Demand Pocket',
    subtitle: 'Transit access and constrained supply frame the Somerville opportunity set.',
    city: 'Somerville',
    landmarkName: 'Somerville Davis Square',
    camera: { center: [-71.1223, 42.3967], zoom: 14.1, pitch: 55, bearing: -18, duration: 2100 },
    metric: { label: 'Transit demand', value: 90 },
  },
  {
    id: 'somerville-property-1',
    type: 'property',
    title: '13 Arlington Street',
    subtitle: 'A Boston metro asset in a deep rental market with durable tenant demand.',
    city: 'Somerville',
    propertyId: 'arlington-somerville',
    camera: { center: [-71.1006, 42.3919], zoom: 15.55, pitch: 58, bearing: 28, duration: 2100 },
  },
  {
    id: 'somerville-property-2',
    type: 'property',
    title: '25-27 Upland Road',
    subtitle: 'A two-building multifamily opportunity with conservative rent-growth upside.',
    city: 'Somerville',
    propertyId: 'upland-somerville',
    camera: { center: [-71.1112, 42.3886], zoom: 15.55, pitch: 58, bearing: -24, duration: 2100 },
  },
  {
    id: 'outro',
    type: 'outro',
    title: 'Portfolio Intelligence',
    subtitle: 'A Northeast acquisition pipeline mapped by risk, upside, and execution priority.',
    city: 'Astute OS',
    camera: { center: [-72.62, 41.64], zoom: 6.9, pitch: 18, bearing: -10, duration: 3100 },
    metric: { label: 'Total units', value: totalUnits },
  },
];

const LOCATION_INTELLIGENCE: Record<string, string[]> = {
  'elliott-yonkers': ['Transit Access', 'School District', 'Rent Growth', 'Supply Constraint'],
  'union-city-summit': ['Commuter Demand', 'Transit Access', 'Renovation Upside', 'Rent Growth'],
  'arlington-somerville': ['Supply Constraint', 'School District', 'Commuter Demand', 'Rent Growth'],
  'upland-somerville': ['Transit Access', 'Supply Constraint', 'Renovation Upside', 'School District'],
  'elliott-92': ['School District', 'Rent Growth', 'Renovation Upside', 'Commuter Demand'],
};

const bentoSections: BentoSection[] = [
  {
    eyebrow: 'Deal Command Center',
    title: 'Pipeline, comps, and deal quality in one operating view.',
    body: 'Portfolio turns fragmented acquisition targets into ranked, filterable intelligence with pricing, unit mix, score, and market context.',
    metric: { label: 'Active properties', value: PROPERTIES.length },
    to: '/portfolio',
    cta: 'Open Portfolio',
  },
  {
    eyebrow: 'Underwriting Lab',
    title: 'Model the strategy before the memo gets written.',
    body: 'Strategy connects rent growth, debt costs, exit caps, and hold period into a clean sensitivity surface for fast scenario framing.',
    metric: { label: 'Target IRR midpoint', value: 22, suffix: '%' },
    to: '/strategy',
    cta: 'View Strategy',
  },
  {
    eyebrow: 'Market Terminal',
    title: 'Market pulse, cap rates, and rent trends with dashboard rhythm.',
    body: 'Insights brings dispatches, charts, market signals, and portfolio return context into a Bloomberg-inspired intelligence layer.',
    metric: { label: 'Demand pulse', value: 82 },
    to: '/insights',
    cta: 'Read Insights',
  },
  {
    eyebrow: 'Capital OS Coming Soon',
    title: 'Real estate, stocks, ETFs, crypto, and cash tracked together.',
    body: 'Astute is designed to expand beyond property into a full capital dashboard for assets, liquidity, exposure, and future planning.',
    metric: { label: 'Asset classes', value: 5 },
    to: '/portfolio',
    cta: 'Preview Roadmap',
  },
];

function ChapterMetric({ chapter, property }: { chapter: Chapter; property?: Property }) {
  const metric: NumericMetric = property
    ? { label: 'Property score', value: property.score, suffix: '' }
    : chapter.metric ?? { label: 'Signal score', value: 82 };

  return (
    <div className="chapter-metric">
      <span>{metric.label}</span>
      <strong>
        <AnimatedNumber value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
      </strong>
    </div>
  );
}

function MiniSignalChart({ activeIndex }: { activeIndex: number }) {
  const bars = [42, 64, 52, 78, 68, 86].map((value, index) => Math.max(28, value + ((activeIndex + index) % 3) * 4));
  return (
    <AnimatedChartShell triggerKey={activeIndex}>
      <div className="mini-signal-chart" aria-hidden="true">
        {bars.map((height, index) => (
          <motion.span
            key={`${activeIndex}-${index}`}
            initial={{ height: 8, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            transition={{ duration: 0.75, delay: index * 0.055, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </div>
    </AnimatedChartShell>
  );
}

export default function Home() {
  useLenisScroll();
  const mapRef = useRef<MapBackgroundHandle>(null);
  const propertyById = useMemo(() => new Map(PROPERTIES.map((property) => [property.id, property])), []);
  const {
    activeChapterIndex,
    setActiveChapterIndex,
    isLocked,
    containerRef,
    goToChapter,
  } = useCinematicScrollController({ totalChapters: CINEMATIC_CHAPTERS.length });

  const activeChapter = CINEMATIC_CHAPTERS[activeChapterIndex] ?? CINEMATIC_CHAPTERS[0];
  const activeProperty = activeChapter.propertyId ? propertyById.get(activeChapter.propertyId) : undefined;
  const activeLandmarkName = activeChapter.type === 'landmark' ? activeChapter.landmarkName : undefined;

  useEffect(() => {
    mapRef.current?.flyTo(activeChapter.camera);
  }, [activeChapter]);

  const widgetMetrics: NumericMetric[] = activeProperty
    ? [
        { label: 'Score', value: activeProperty.score, suffix: '' },
        { label: 'Units', value: activeProperty.units, suffix: '' },
        { label: 'Basis', value: Math.round(activeProperty.askingPrice / 100000) / 10, prefix: '$', suffix: 'M', decimals: 1 },
      ]
    : [
        { label: 'Deal velocity', value: 47, suffix: '%' },
        { label: 'Market signal', value: activeChapter.metric?.value ?? 82, suffix: '' },
        { label: 'Pipeline value', value: 42.8, prefix: '$', suffix: 'M', decimals: 1 },
      ];

  return (
    <div className="home-os-page">
      <section ref={containerRef} className="home-cinematic-hero" aria-label="Astute OS cinematic map journey">
        <motion.div
          className="astute-os-window"
          data-locked={isLocked}
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.82, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MapBackground
            ref={mapRef}
            properties={PROPERTIES}
            activeSection={activeChapterIndex}
            activePropertyId={activeProperty?.id}
            activeLandmarkName={activeLandmarkName}
          />
          <ParticleField />
          <div className="cinematic-fog" />
          <div className="cinematic-streaks" data-active={activeChapter.type === 'transition'} />
          <motion.div key={activeChapter.id} className="cinematic-sweep" />

          <div className="os-top-dock">
            <span className="os-logo"><BarChart3 size={15} /> Astute OS</span>
            <span>{activeChapter.city}</span>
            <span>{String(activeChapterIndex + 1).padStart(2, '0')} / {CINEMATIC_CHAPTERS.length}</span>
          </div>

          <div className="chapter-rail" aria-label="Cinematic chapters">
            {CINEMATIC_CHAPTERS.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                aria-label={`Go to ${chapter.title}`}
                aria-current={index === activeChapterIndex}
                onClick={() => setActiveChapterIndex(index)}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              className={activeChapter.type === 'hero' ? 'hero-center-copy' : 'chapter-copy-panel'}
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="hero-badge">
                <Sparkles size={12} />
                {activeChapter.type === 'hero' ? 'AI-built real estate intelligence' : activeChapter.type}
              </span>
              <RevealWords
                key={`${activeChapter.id}-title`}
                as={activeChapter.type === 'hero' ? 'h1' : 'h2'}
                text={activeChapter.title}
                className={activeChapter.type === 'hero' ? 'home-hero-title' : 'chapter-title'}
                delay={0.1}
              />
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.48 }}
                className={activeChapter.type === 'hero' ? 'home-hero-subtitle' : 'chapter-subtitle'}
              >
                {activeChapter.subtitle}
              </motion.p>
              {activeChapter.type === 'hero' && (
                <motion.div
                  className="hero-cta-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.48, duration: 0.45 }}
                >
                  <Link to="/portfolio" className="os-cta os-cta-primary">Open Portfolio <ArrowRight size={15} /></Link>
                  <Link to="/strategy" className="os-cta os-cta-ghost">View Strategy</Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="floating-widget-stack">
            {widgetMetrics.map((metric, index) => (
              <motion.div
                key={`${activeChapter.id}-${metric.label}`}
                className="hero-floating-widget"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.58 + index * 0.12, duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span>{metric.label}</span>
                <strong><AnimatedNumber value={metric.value} prefix={metric.prefix} suffix={metric.suffix} decimals={metric.decimals} /></strong>
              </motion.div>
            ))}
          </div>

          <motion.div
            key={`${activeChapter.id}-left-widget`}
            className="hero-analysis-widget"
            initial={{ opacity: 0, x: -18, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.72, duration: 0.5 }}
          >
            <div>
              <span>Current signal</span>
              <strong>{activeProperty?.tag ?? activeChapter.city}</strong>
            </div>
            <ChapterMetric chapter={activeChapter} property={activeProperty} />
            <MiniSignalChart activeIndex={activeChapterIndex} />
          </motion.div>

          <AnimatePresence>
            {activeProperty && (
              <motion.div
                key={activeProperty.id}
                className="property-intel-card"
                initial={{ opacity: 0, x: 34, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                transition={{ duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <img src={activeProperty.image} alt={activeProperty.name} />
                <div>
                  <span>{activeProperty.type}</span>
                  <h3>{activeProperty.name}</h3>
                  <p><MapPin size={12} /> {activeProperty.location}</p>
                  <div className="property-intel-grid">
                    <span><b>{fmtCurrency(activeProperty.askingPrice)}</b> Asking</span>
                    <span><b>{activeProperty.irr}</b> Target IRR</span>
                    <span><b>{activeProperty.units}</b> Units</span>
                    <span><b style={{ color: SCORE_COLOR(activeProperty.score) }}>{activeProperty.score}</b> Score</span>
                  </div>
                  <div className="chip-row">
                    {(LOCATION_INTELLIGENCE[activeProperty.id] ?? ['Transit Access', 'Rent Growth']).map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </div>
                  <Link to={`/portfolio/${activeProperty.id}`}>Open deal memo <ArrowRight size={13} /></Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="chapter-footer">
            <button type="button" onClick={() => goToChapter(-1)} disabled={activeChapterIndex === 0}>Previous</button>
            <span>Scroll to next signal</span>
            <button type="button" onClick={() => goToChapter(1)} disabled={activeChapterIndex === CINEMATIC_CHAPTERS.length - 1}>Next</button>
          </div>
        </motion.div>

        <motion.div
          className="hero-scroll-cue"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} />
          <span>{activeChapterIndex === CINEMATIC_CHAPTERS.length - 1 ? 'Continue to product story' : 'One scroll advances one chapter'}</span>
        </motion.div>
      </section>

      <section className="home-bento-story">
        <div className="section">
          <div className="story-heading">
            <span>Astute Product System</span>
            <RevealWords as="h2" text="From map signal to investment decision." />
            <p>Each module is designed as an operating layer: source the deal, underwrite the risk, watch the market, and prepare the capital stack.</p>
          </div>

          <div className="bento-grid">
            {bentoSections.map((section, index) => (
              <motion.article
                key={section.eyebrow}
                className="story-bento-card"
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.62, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span>{section.eyebrow}</span>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
                <div className="story-card-metric">
                  <small>{section.metric.label}</small>
                  <strong><AnimatedNumber value={section.metric.value} suffix={section.metric.suffix} /></strong>
                </div>
                <Link to={section.to}>{section.cta} <ArrowRight size={14} /></Link>
              </motion.article>
            ))}
          </div>

          <div className="terminal-preview">
            {[
              { icon: Radar, label: 'Risk posture', value: 'Balanced' },
              { icon: Gauge, label: 'Market pulse', value: '82' },
              { icon: Shield, label: 'Basis discipline', value: 'High' },
              { icon: TrendingUp, label: 'Rent pressure', value: '+4.2%' },
              { icon: Building2, label: 'Properties', value: String(PROPERTIES.length) },
              { icon: Layers, label: 'Units', value: String(totalUnits) },
            ].map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.055, duration: 0.45 }}
              >
                <Icon size={16} />
                <span>{label}</span>
                <strong>{value}</strong>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
