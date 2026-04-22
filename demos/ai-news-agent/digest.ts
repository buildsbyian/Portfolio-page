export interface DigestArticle {
  title: string;
  url: string;
  summary: string;
}

export interface DigestCategory {
  name: string;
  overview: string;
  top: DigestArticle[];
  alsoNotable: { title: string; url: string; shortSummary: string }[];
}

export const digestDate = {
  iso: '2026-04-17',
  pretty: 'April 17, 2026',
};

export const digestCategories: DigestCategory[] = [
  {
    name: 'General News',
    overview:
      "A row over vetting procedures in Keir Starmer's government has sparked questions about whether he is in control of his own administration, while conflicts in various regions — including a Middle East crisis and rising tensions between the UK and Kenya — have raised concerns about global stability and security.",
    top: [
      {
        title: 'Rachel Reeves to raise windfall tax on low-carbon electricity generators',
        url: 'https://www.theguardian.com/business/2026/apr/17/rachel-reeves-to-raise-windfall-tax-on-low-carbon-electricity-generators',
        summary:
          'UK Chancellor Rachel Reeves is set to announce plans to raise the windfall tax on low-carbon electricity generators, with the goal of limiting household energy bills. The plan aims to protect consumers from soaring gas market prices by setting electricity costs more often by cheaper renewable sources.',
      },
      {
        title: 'Is Mandelson vetting scandal the final straw for Starmer?',
        url: 'https://www.theguardian.com/news/audio/2026/apr/17/is-mandelson-vetting-scandal-the-final-straw-for-starmer-the-latest',
        summary:
          'Keir Starmer has expressed outrage over Peter Mandelson\'s vetting scandal, calling it "staggering" and "unforgivable." The comments come after an investigation revealed that Mandelson was denied clearance but had his decision overturned by the Foreign Office.',
      },
      {
        title: 'Questions raised over whether £3.8m government grant awarded to Wrexham AFC was lawful',
        url: 'https://www.theguardian.com/football/2026/apr/17/government-grant-wrexham-afc-ryan-reynolds-rob-mac',
        summary:
          'Wrexham AFC received a £3.8m government grant without a contract or state aid assessment in place, raising questions over whether the award was lawful. The one-month window for challenges to be filed has since closed, reducing the likelihood of repayment.',
      },
    ],
    alsoNotable: [
      {
        title: 'Middle East crisis live: Iran reopens Strait of Hormuz but US blockade remains',
        url: 'https://www.theguardian.com/world/live/2026/apr/17/middle-east-crisis-live-news-israel-lebanon-ceasefire-iran-war-us-latest-updates',
        shortSummary:
          "Iran's foreign minister says strait passage is open for commercial vessels during a ceasefire, while US naval blockade remains in place.",
      },
      {
        title: "Starmer was kept in dark about Mandelson's vetting by two other top civil servants",
        url: 'https://www.theguardian.com/politics/2026/apr/17/keir-starmer-kept-in-dark-peter-mandelson-vetting-two-top-civil-servants',
        shortSummary:
          'A top minister reportedly learned of a vetting failure months later due to delays in informing them, sparking accusations of an ivory-tower bureaucracy.',
      },
      {
        title: 'Kenyan firm sacks more than 1,000 workers after losing Meta contract',
        url: 'https://www.theguardian.com/technology/2026/apr/17/kenyan-outsourcing-company-for-meta-sacks-workers',
        shortSummary:
          'Meta outsourced content moderation and AI training work to Kenyan firm Sama before terminating the contract, leaving over 1,000 workers laid off.',
      },
    ],
  },
  {
    name: 'Tech & Futurism',
    overview:
      'Tech industry insiders are grappling with the consequences of fake news, deepfakes, and AI-generated content, as companies scramble to ensure journalistic integrity and human authenticity in online interactions. Hackers are also exploiting vulnerabilities in software updates, further straining trust in the sector.',
    top: [
      {
        title: "A Prominent PR Firm Is Running a Fake News Site That's Plagiarizing Original Journalism at Incredible Scale",
        url: 'https://futurism.com/artificial-intelligence/national-today-ai-plagiarizing',
        summary:
          'A PR firm manages a news site called National Today that plagiarizes original journalism at an incredible scale, publishing hundreds of articles with stolen reporting and AI-generated content. This widespread deception undermines the credibility of legitimate publications across the country.',
      },
      {
        title: 'Betting on the news raises ethical questions for journalists',
        url: 'https://www.theverge.com/report/914157/prediction-markets-news-outlet-ethics-policy-propublica-kalshi-polymarket',
        summary:
          'Newsrooms are cutting deals with prediction market platforms while banning staff from using them, raising questions about journalistic integrity. The rapid rise of these platforms has put the industry in a strange position, as they claim to offer more trustworthy odds than traditional media or polls.',
      },
      {
        title: 'Hackers are abusing unpatched Windows security flaws to hack into organizations',
        url: 'https://techcrunch.com/2026/04/17/hackers-are-abusing-unpatched-windows-security-flaws-to-hack-into-organizations/',
        summary:
          'Hackers are exploiting unpatched Windows security flaws published by a disgruntled researcher, targeting at least one organization. The identity of the target remains unclear, with unknown actors taking advantage of the vulnerability using exploit code published online.',
      },
    ],
    alsoNotable: [
      {
        title: 'There Are Signs of a Massive AI Backlash',
        url: 'https://futurism.com/artificial-intelligence/signs-massive-ai-backlash',
        shortSummary: "Rural Americans are rebelling against data centers that drain their community's resources.",
      },
      {
        title: 'Zoom teams up with World to verify humans in meetings',
        url: 'https://techcrunch.com/2026/04/17/zoom-teams-up-with-world-to-verify-humans-in-meeting/',
        shortSummary:
          'Zoom integrates World\'s AI-powered verification technology to prevent AI-generated imposters from impersonating employees in video meetings.',
      },
      {
        title: 'Show HN: Smol machines — subsecond coldstart, portable virtual machines',
        url: 'https://github.com/smol-machines/smolvm',
        shortSummary: 'Smol machines runs custom Linux VMs locally with isolation by default, packaged as compact executables.',
      },
    ],
  },
  {
    name: 'AI Research',
    overview:
      'A flurry of activity in AI research today focused on improving explainability, safety, and performance across a range of applications — medical diagnosis, nuclear control, decision-making, and cognitive simulation. Researchers are developing new frameworks, models, and techniques to make AI systems more transparent, reliable, and trustworthy.',
    top: [
      {
        title: 'NuHF Claw: A Risk-Constrained Cognitive Agent Framework for Human-Centered Procedure Support in Digital Nuclear Control Rooms',
        url: 'https://arxiv.org/abs/2604.14160',
        summary:
          'Researchers propose NuHF Claw, an AI framework to reduce cognitive risks in digital nuclear control rooms by regulating autonomous system behavior and preserving human decision authority. The framework uses risk-constrained inference and probabilistic safety assessment to anticipate interface-induced cognitive degradation and provide navigational guidance.',
      },
      {
        title: 'Interpretable and Explainable Surrogate Modeling for Simulations: A State-of-the-Art Survey and Perspectives on Explainable AI for Decision-Making',
        url: 'https://arxiv.org/abs/2604.14240',
        summary:
          'Researchers have identified the need for explainable AI methods to be applied in surrogate modeling for simulating complex systems. They propose a research agenda that integrates XAI techniques with surrogate models, enabling extraction of actionable insights from simulations.',
      },
      {
        title: "Seeing Through Experts' Eyes: A Foundational Vision-Language Model Trained on Radiologists' Gaze and Reasoning",
        url: 'https://arxiv.org/abs/2604.14316',
        summary:
          "Researchers developed GazeX, a vision-language model trained on radiologists' gaze data to improve chest X-ray interpretation accuracy and consistency with expert diagnostic workflows. The model produces more accurate, interpretable, and consistent outputs compared to existing systems.",
      },
    ],
    alsoNotable: [
      {
        title: 'Credo: Declarative Control of LLM Pipelines via Beliefs and Policies',
        url: 'https://arxiv.org/abs/2604.14401',
        shortSummary:
          'A new framework enhances agent-driven decision-making with improved explainability through semantic states and declarative policies.',
      },
      {
        title: 'Equifinality in Mixture of Experts: Routing Topology Does Not Determine Language Modeling Quality',
        url: 'https://arxiv.org/abs/2604.14419',
        shortSummary:
          'Various cosine-similarity routing mechanisms for sparse MoE architectures are statistically equivalent in long-term performance.',
      },
      {
        title: 'Simulating Human Cognition: Heartbeat-Driven Autonomous Thinking Activity Scheduling for LLM-based AI systems',
        url: 'https://arxiv.org/abs/2604.14178',
        shortSummary:
          'A novel scheduling mechanism lets LLM-based systems proactively adapt and learn through dynamic integration of cognitive modules.',
      },
    ],
  },
  {
    name: '3D Printing',
    overview:
      'The 3D printing industry is seeing growth across construction, sports equipment, and biomedicine. Companies are working on technical hurdles to advance their technologies and meet increasing demand.',
    top: [
      {
        title: 'CONTEXT Report Shows Decline in Professional 3D Printers as Entry-Level Segment Surges',
        url: 'https://www.fabbaloo.com/news/context-report-shows-decline-in-professional-3d-printers-as-entry-level-segment-surges',
        summary:
          'Professional 3D printer manufacturers are struggling due to a surge in demand for entry-level printers, which is eating into their profits. The trend suggests these companies may need to adjust pricing strategies or product lines to remain competitive.',
      },
      {
        title: 'RAPID Roundup 2026: New Machines and Market Moves',
        url: 'https://3dprint.com/325364/rapid-roundup-2026-new-machines-and-market-moves/',
        summary:
          'New additive manufacturing systems were introduced at RAPID + TCT 2026, showcasing advancements in metal AM and hybrid approaches. Chinese companies such as UnionTech, Snapmaker, SUNLU, and Inslogic showcased capabilities in larger formats and industrial applications.',
      },
      {
        title: 'Former Spy/Congressman to Head New Federal Division at Construction 3D Printing Powerhouse ICON',
        url: 'https://3dprint.com/325363/former-spy-congressman-to-head-new-federal-division-at-construction-3d-printing-powerhouse-icon/',
        summary:
          'The private aerospace company is teaming with the US military to build ten new barracks using additive construction methods. The military aims to complete the project before 2026.',
      },
    ],
    alsoNotable: [
      {
        title: 'New Bioengineered Patch Makes Its Own Oxygen to Heal Wounds and Grow Tissue',
        url: 'https://3dprintingindustry.com/news/new-bioengineered-patch-makes-its-own-oxygen-to-heal-wounds-and-grow-tissue-250671/',
        shortSummary: 'Researchers in the US have created a self-sustaining oxygen-producing patch to promote wound healing and tissue growth.',
      },
      {
        title: '3D Construction Printing Sees Growth, But Also Project Setbacks',
        url: 'https://www.fabbaloo.com/news/3d-construction-printing-sees-growth-but-also-project-setbacks',
        shortSummary: 'The 3D construction printing industry continues to grow despite recent project setbacks and challenges.',
      },
      {
        title: 'NASA STTR Award Backs Cold Spray Research for GRX-810',
        url: 'https://3dprintingindustry.com/news/nasa-sttr-award-backs-cold-spray-research-for-grx-810-250645/',
        shortSummary: 'A NASA-backed university team is developing a more efficient rocket alloy through a collaborative STTR-funded research project.',
      },
    ],
  },
  {
    name: 'Science & Space',
    overview:
      'Scientists are making rapid breakthroughs in AI, climate modeling, and sustainable technologies — from quantum-informed forecasting systems to carbon-absorbing mining waste products — holding promise for improved weather forecasting, climate resilience, and a lower environmental footprint.',
    top: [
      {
        title: 'Quantum-informed AI improves long-term turbulence forecasts while using far less memory',
        url: 'https://phys.org/news/2026-04-quantum-ai-term-turbulence-memory.html',
        summary:
          'Researchers at UCL developed an AI model that combines quantum computing with traditional computer processing, improving long-term turbulence forecasts in complex systems like fluid dynamics. The hybrid method is faster and more accurate than current models using only conventional computers, with potential applications in climate science, medicine, and energy generation.',
      },
      {
        title: 'Parrots are not just mimicking words — they use proper names like humans to identify individuals',
        url: 'https://phys.org/news/2026-04-parrots-mimicking-words-proper-humans.html',
        summary:
          'A team of researchers analyzing vocalizations from over 880 captive parrots found that the birds use proper names to identify individuals, similar to humans. Results suggest parrots may have a deeper understanding of language than previously thought, using names to organize social interactions and communicate complex information.',
      },
      {
        title: "One of the world's rarest mice is adapting to climate change",
        url: 'https://phys.org/news/2026-04-world-rarest-mouses-climate.html',
        summary:
          'Researchers analyzed the genomes of Pacific pocket mice to identify genes associated with adaptation to temperature and moisture, then tracked these in a reintroduced population, showing that adaptation is ongoing. The study has implications for conservation programs supporting endangered species as climate change continues.',
      },
    ],
    alsoNotable: [
      {
        title: 'Mining waste product could help store carbon emissions, study suggests',
        url: 'https://phys.org/news/2026-04-product-carbon-emissions.html',
        shortSummary: 'Iron-rich mining waste can store up to 99.5% of CO₂ emissions as a potential low-maintenance carbon sink.',
      },
      {
        title: 'Ocean bottom seismometers could improve earthquake warning times in Pacific Northwest',
        url: 'https://phys.org/news/2026-04-ocean-bottom-seismometers-earthquake-pacific.html',
        shortSummary: 'Regional offshore earthquake warning could increase by 18 seconds with better detection from seabed instruments.',
      },
      {
        title: "Medicine's next leap: Delivering gene therapies exactly where they're needed",
        url: 'https://phys.org/news/2026-04-medicine-gene-therapies-theyre.html',
        shortSummary: 'Researchers found distinct destinations for small vesicles in the body based on origin, enabling targeted drug delivery.',
      },
    ],
  },
  {
    name: 'General Economy',
    overview:
      'Global markets are experiencing a complex mix of inflation pressures and war-induced volatility, with major economies facing challenges in maintaining growth momentum. Industrials, consumer staples, and financials are under scrutiny due to supply chain disruptions and changing consumer behavior.',
    top: [
      {
        title: 'Analyst Report: Prologis Inc',
        url: 'https://finance.yahoo.com/research/reports/ARGUS_2705_AnalystReport_1776424379000',
        summary:
          'Prologis has a portfolio of over 5,900 buildings with 1.3 billion square feet of space in 20 countries, making it the world\'s largest industrial REIT focused on business-to-business fulfillment and e-commerce. The company faces pressure from an oversupply of warehouse space due to slowing sales at online retailers.',
      },
      {
        title: 'Market Digest: TSM, PLD, KEY',
        url: 'https://finance.yahoo.com/research/reports/ARGUS_46764_MarketSummary_1776423479000',
        summary:
          "TSM's gaming business saw strong Q1 results with revenue up 18.7%, driving an 11% surge in the company's shares. Investors were optimistic about KEY and PLD on efficiency improvements, which posted gains of 3.8% and 4% respectively.",
      },
      {
        title: 'Daily Spotlight: Dollar Surges Amid Iran War',
        url: 'https://finance.yahoo.com/research/reports/ARGUS_46767_MarketOutlook_1776424971000',
        summary:
          'The dollar surged amid the Iran war due to a flight-to-quality move into dollar-denominated assets. Investors are seeking safety and confidence in the U.S. economy and financial system, pushing the greenback higher.',
      },
    ],
    alsoNotable: [
      {
        title: '127-year-old retailer confirms more cuts in 2026',
        url: 'https://finance.yahoo.com/markets/stocks/articles/127-old-retailer-confirms-more-231700401.html',
        shortSummary: 'Morrisons will cut approximately 200 jobs at its Bradford head office as part of a long-term tech-and-AI transformation strategy.',
      },
      {
        title: 'Analyst Report: KeyCorp',
        url: 'https://finance.yahoo.com/research/reports/ARGUS_3759_AnalystReport_1776424379000',
        shortSummary: "KeyCorp's Q1 earnings exceeded expectations on lower-than-anticipated revenue but a positive outlook.",
      },
    ],
  },
];
