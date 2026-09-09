import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Building2, Flame, Globe, ArrowRight } from 'lucide-react';

const USE_CASES = [
  {
    id: 'agriculture',
    icon: <Leaf size={24} />,
    title: 'Agriculture & Farming',
    color: 'emerald',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop',
    problem: '10m Sentinel-2 data struggles to clearly delineate field boundaries for smallholder farms (<2 hectares), making yield prediction and micro-level crop health monitoring difficult.',
    solution: 'SRM enhances spatial resolution to ~3.3m while strictly preserving the NDVI and Red-Edge spectral signatures necessary for agricultural analysis.',
    benefits: [
      'Accurate extraction of small plot boundaries',
      'Precise within-field crop variation mapping',
      'Improved crop yield modeling',
      'Better spectral index (NDVI/EVI) spatial mapping'
    ]
  },
  {
    id: 'urban',
    icon: <Building2 size={24} />,
    title: 'Urban Planning & Development',
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80&auto=format&fit=crop',
    problem: 'Medium resolution limits the detection of individual buildings, narrow roads, and informal settlements in rapidly expanding urban centers.',
    solution: 'Deep learning reconstruction recovers sharp edges, right angles, and structural features typical of human-made environments without requiring expensive commercial satellite tasking.',
    benefits: [
      'Automated building footprint extraction',
      'Mapping of tertiary road networks',
      'Informal settlement / slum monitoring',
      'High-frequency urban expansion tracking'
    ]
  },
  {
    id: 'disaster',
    icon: <Flame size={24} />,
    title: 'Disaster Management',
    color: 'amber',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200&q=80&auto=format&fit=crop',
    problem: 'During floods or earthquakes, rapid assessment is crucial, but free frequent-revisit satellites (like Sentinel-2) lack the detail needed for localized damage assessment.',
    solution: 'SRM bridges the gap between high temporal frequency and high spatial resolution, allowing rapid enhancement of the latest available disaster imagery.',
    benefits: [
      'Clearer flood extent mapping around infrastructure',
      'Detection of blocked critical roadways',
      'Rapid landslide boundary delineation',
      'Post-disaster recovery monitoring'
    ]
  },
  {
    id: 'environment',
    icon: <Globe size={24} />,
    title: 'Environmental Monitoring',
    color: 'cyan',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop',
    problem: 'Tracking illegal logging, selective deforestation, and subtle coastline changes requires continuous, high-detail monitoring over vast remote areas.',
    solution: 'SRM enables scaling high-resolution analysis globally using open data, providing the detail needed to spot localized environmental degradation.',
    benefits: [
      'Detecting small-scale illegal logging roads',
      'Mapping narrow river and coastline changes',
      'Monitoring protected forest reserves',
      'Tracking glacier and ice-sheet dynamics'
    ]
  }
];

export const UseCasesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020c1b]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#071525]/60 backdrop-blur-sm sticky top-[68px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white leading-none">Use Cases</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-world applications of SRM</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-24">
        
        {USE_CASES.map((uc, i) => (
          <div key={uc.id} className={`grid md:grid-cols-2 gap-10 items-center anim-fade-up delay-${(i % 3) + 1}`}>
            
            {/* Image Side */}
            <div className={`relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-glow-${uc.color} h-[400px] ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
              <img src={uc.image} alt={uc.title} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020c1b] via-[#020c1b]/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-${uc.color}-500/20 border border-${uc.color}-500/40 flex items-center justify-center text-${uc.color}-400 backdrop-blur-md`}>
                  {uc.icon}
                </div>
                <h2 className="text-2xl font-black text-white">{uc.title}</h2>
              </div>
            </div>

            {/* Text Side */}
            <div className={`space-y-6 ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
              
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">The Problem</h3>
                <p className="text-slate-300 leading-relaxed text-sm bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                  {uc.problem}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">How SRM Helps</h3>
                <p className={`text-${uc.color}-300 leading-relaxed text-sm bg-${uc.color}-500/[0.05] p-4 rounded-xl border border-${uc.color}-500/15`}>
                  {uc.solution}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Key Benefits</h3>
                <ul className="space-y-2.5">
                  {uc.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <ArrowRight size={16} className={`text-${uc.color}-400 mt-0.5 flex-shrink-0`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <button onClick={() => navigate('/enhance')} className={`text-sm font-bold text-${uc.color}-400 hover:text-${uc.color}-300 flex items-center gap-1.5 transition-colors`}>
                  Enhance Imagery for {uc.title.split('&')[0].trim()} <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};
