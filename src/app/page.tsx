"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { eoFeatures } from '../data/eoFeatures';

const quizQuestions = [
  {
    question: "How long have you been in EO?",
    name: "tenure",
    options: [
      "New member (less than 1 year)",
      "1–3 years",
      "3–5 years",
      "5+ years",
    ],
  },
  {
    question: "Are you currently in a Forum?",
    name: "forum",
    options: [
      "Yes, and I'm active",
      "Yes, but not very active",
      "No, but I want to join",
      "No, and I'm not interested",
    ],
  },
  {
    question: "What's your #1 goal this year?",
    name: "goal",
    options: ["Grow", "Scale", "Exit", "Balance", "Other"],
  },
  {
    question: "What kind of support do you value most?",
    name: "support",
    options: ["Peer", "Learning", "Leadership", "Other"],
  },
  {
    question: "How much time do you want to invest?",
    name: "time",
    options: ["Light touch", "Moderate", "All in"],
  },
  {
    question: "What's one thing you'd love to get out of EO this year?",
    name: "wish",
    options: [], // free text
  },
  {
    question: "Do you prefer online, in-person, or blended?",
    name: "format",
    options: ["Online", "In-person", "Blended"],
  },
];

type SummaryObj = {
  top5?: string;
  stretch5?: string;
  extra?: string;
  raw?: string;
};

const loadingSteps = [
  "Reviewing your answers...",
  "Analyzing your EO journey...",
  "Matching you with EO programs...",
  "Consulting the EO knowledge base...",
  "Optimizing your personalized plan...",
  "Finalizing your recommendations..."
];

// Step labels for progress indicator
const stepLabels = ["Profile", "Quiz", "Results"];

// Helper to get details for a feature by name
function getFeatureDetails(name: string) {
  const feature = eoFeatures.find(f => f.name.toLowerCase() === name.toLowerCase());
  return feature?.details || null;
}

// Helper to remove AI greeting from intro
function stripGreeting(intro: string, name: string) {
  // Remove 'Hi Travis,', 'Hello Travis,', 'Hi, Travis,' etc. (case-insensitive, optional punctuation)
  if (!name) return intro;
  const pattern = new RegExp(`^(hi|hello)[,\s]+${name}[,\s!]*`, 'i');
  return intro.replace(pattern, '').trim();
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: "", company: "", revenue: "" });
  const [quiz, setQuiz] = useState({
    tenure: "",
    forum: "",
    goal: "",
    support: "",
    time: "",
    wish: "",
    format: "",
  });
  const [summary, setSummary] = useState<SummaryObj | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  // State for expanded details per recommendation
  const [expandedDetails, setExpandedDetails] = useState<{ [key: string]: boolean }>({});
  // Store the last raw AI response for guaranteed fallback
  const [lastRawAI, setLastRawAI] = useState<string | null>(null);
  // State for showing the full EO feature list
  const [showFullList, setShowFullList] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("eo_profile");
    const savedQuiz = localStorage.getItem("eo_quiz");
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedQuiz) setQuiz(JSON.parse(savedQuiz));
  }, []);

  // Save to localStorage on profile or quiz change
  useEffect(() => {
    localStorage.setItem("eo_profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem("eo_quiz", JSON.stringify(quiz));
  }, [quiz]);

  // Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  // Call OpenAI API when step === 3
  useEffect(() => {
    if (step === 3) {
      setLoading(true);
      setSummary(null);
      setError(null);
      fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, quiz, prioritize: true }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Unknown error");
          // Log the raw AI response to the console
          console.log('AI raw response:', data.summary);
          setLastRawAI(typeof data.summary === 'string' ? data.summary : JSON.stringify(data.summary));
          let parsed: SummaryObj = {};
          try {
            parsed = typeof data.summary === 'string' ? parseSummary(data.summary) : data.summary;
          } catch {
            parsed = { raw: data.summary };
          }
          setSummary(parsed);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [step, profile, quiz]);

  // Parse summary string into top5, stretch5, extra
  function parseSummary(text: string): SummaryObj {
    const top5Match = text.match(/Top 5[\s\S]*?(?:\n|:)([\s\S]*?)(?=\n\s*Stretch 5|$)/i);
    const stretch5Match = text.match(/Stretch 5[\s\S]*?(?:\n|:)([\s\S]*?)(?=\n\s*\w|$)/i);
    const top5 = top5Match ? top5Match[1].trim() : '';
    const stretch5 = stretch5Match ? stretch5Match[1].trim() : '';
    const extra = text.replace(/Top 5[\s\S]*?(?:\n|:)[\s\S]*?(?=\n\s*Stretch 5|$)/i, '').replace(/Stretch 5[\s\S]*?(?:\n|:)[\s\S]*/i, '').trim();
    return { top5, stretch5, extra };
  }

  // Helper to split the AI response by clear section headers
  function splitSummarySections(text: string) {
    // Find the index of each section header
    const top5Idx = text.indexOf('Top 5 Recommendations:');
    const addlIdx = text.indexOf('Additional Opportunities:');
    const summaryIdx = text.indexOf('Summary:');

    // Introduction is everything before Top 5
    const intro = top5Idx !== -1 ? text.slice(0, top5Idx).trim() : '';
    // Top 5 is everything between Top 5 and Additional Opportunities
    const top5 = (top5Idx !== -1 && addlIdx !== -1) ? text.slice(top5Idx + 'Top 5 Recommendations:'.length, addlIdx).trim() : '';
    // Additional is everything between Additional Opportunities and Summary
    const addl = (addlIdx !== -1 && summaryIdx !== -1) ? text.slice(addlIdx + 'Additional Opportunities:'.length, summaryIdx).trim() : '';
    // Summary is everything after Summary:
    const summary = summaryIdx !== -1 ? text.slice(summaryIdx + 'Summary:'.length).trim() : '';

    return { intro, top5, addl, summary };
  }

  // Helper to parse numbered lists into [{title, desc}]
  function parseList(block: string) {
    if (!block) return [];
    // Always split on lines that start with a number and a period, parenthesis, or dash, with optional spaces
    const items = block.split(/\n\s*\d+[\.|\)|-]\s*/).filter(Boolean);
    return items.map(item => {
      const dashIdx = item.indexOf(' - ');
      const colonIdx = item.indexOf(': ');
      const splitIdx = (dashIdx !== -1 && (colonIdx === -1 || dashIdx < colonIdx)) ? dashIdx : colonIdx;
      const sep = (dashIdx !== -1 && (colonIdx === -1 || dashIdx < colonIdx)) ? ' - ' : (colonIdx !== -1 ? ': ' : '');
      if (splitIdx !== -1) {
        return {
          title: item.slice(0, splitIdx).trim(),
          desc: item.slice(splitIdx + sep.length).trim(),
        };
      } else {
        return { title: item.trim(), desc: '' };
      }
    });
  }

  // Styles
  const containerClass = "min-h-screen flex flex-col items-center justify-center bg-neutral-100 px-2 py-8 font-sans";
  const cardClass = "bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6 border border-gray-200";
  const headingClass = "text-3xl font-bold text-gray-900 mb-2 tracking-tight";
  const labelClass = "font-medium text-gray-900 mb-1";
  const inputClass = "bg-neutral-50 border border-gray-300 rounded-lg p-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400";
  const selectClass = "bg-neutral-50 border border-gray-300 rounded-lg p-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
  const buttonClass = "bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg text-base transition mt-4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400";

  // Add a Start Over button to all steps (does not reset data)
  const startOverButton = (
    <button
      className="text-sm text-blue-700 underline mt-2 self-end hover:text-blue-900 focus:outline-none cursor-pointer"
      onClick={() => setStep(0)}
      type="button"
    >
      Start Over
    </button>
  );

  // Animated loading steps (show each step once, then hold on the last)
  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < loadingSteps.length) {
          setLoadingStep(currentStep);
        } else {
          clearInterval(interval);
        }
      }, 1400);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Loader component (spinner above, text below, both centered)
  const Loader = () => (
    <div className="flex flex-col items-center justify-center min-h-[120px] w-full">
      <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-700 rounded-full animate-spin mb-4" />
      <div className="h-8 flex items-center justify-center w-full">
        {loadingSteps.map((step, idx) => (
          <span
            key={step}
            className={`text-base font-semibold text-blue-900 transition-opacity duration-700 ${idx === loadingStep ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: idx === loadingStep ? '0ms' : '0ms', position: idx === loadingStep ? 'static' : 'absolute', width: '100%', textAlign: 'center' }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );

  // Calculate progress step (0: Profile, 1: Quiz, 2: Results)
  const progressStep = step === 0 ? 0 : step === 1 ? 0 : step === 2 ? 1 : 2;
  const totalSteps = 3;

  // Step progress indicator component
  const StepProgress = () => (
    <div className="flex flex-col w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        {stepLabels.map((label, idx) => {
          const isCompleted = progressStep > idx;
          const isCurrent = progressStep === idx;
          return (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div
                className={
                  isCompleted
                    ? 'w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white font-bold border-2 border-blue-700'
                    : isCurrent
                    ? 'w-8 h-8 flex items-center justify-center rounded-full border-2 border-blue-700 text-blue-700 bg-white font-bold'
                    : 'w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 bg-white font-bold'
                }
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-blue-700' : 'text-gray-400'}`}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="relative w-full h-2 bg-gray-200 rounded-full">
        <div
          className="absolute top-0 left-0 h-2 bg-blue-700 rounded-full transition-all"
          style={{ width: `${(progressStep / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  function toggleDetails(name: string) {
    setExpandedDetails(prev => ({ ...prev, [name]: !prev[name] }));
  }

  // Helper to generate share content
  function getShareContent(
    top5List: Array<{ title: string; desc: string }>,
    addlList: Array<{ title: string; desc: string }>,
    profile: { name: string; company: string; revenue: string },
    quiz: { [key: string]: string }
  ) {
    // Email: Recap with profile, quiz, and recommendations
    let emailBody = 'Here are my personalized EO recommendations from the EO Roadmap tool:%0D%0A%0D%0A';
    emailBody += 'Profile:%0D%0A';
    emailBody += `First Name: ${profile.name || ''}%0D%0A`;
    emailBody += `Company Name: ${profile.company || ''}%0D%0A`;
    emailBody += `Company Annual Revenue: ${profile.revenue || ''}%0D%0A%0D%0A`;
    emailBody += 'Quiz Answers:%0D%0A';
    Object.entries(quiz).forEach(([key, value]) => {
      if (value) emailBody += `${key[0].toUpperCase() + key.slice(1)}: ${value}%0D%0A`;
    });
    emailBody += '%0D%0A';
    if (top5List.length > 0) {
      emailBody += 'Top 5 Recommendations:%0D%0A';
      top5List.forEach((item, idx) => {
        emailBody += `${idx + 1}. ${item.title}: ${item.desc}%0D%0A`;
      });
      emailBody += '%0D%0A';
    }
    if (addlList.length > 0) {
      emailBody += 'Additional Opportunities:%0D%0A';
      addlList.forEach((item, idx) => {
        emailBody += `${top5List.length + idx + 1}. ${item.title}: ${item.desc}%0D%0A`;
      });
    }
    return { emailBody };
  }

  if (step === 0) {
    // Show all steps as incomplete on intro
    const IntroStepProgress = () => (
      <div className="flex flex-col w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          {stepLabels.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className='w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 bg-white font-bold'>
                {idx + 1}
              </div>
              <span className='mt-2 text-xs font-medium text-gray-400'>{label}</span>
            </div>
          ))}
        </div>
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <div className="absolute top-0 left-0 h-2 bg-gray-200 rounded-full transition-all" style={{ width: `0%` }} />
        </div>
      </div>
    );
    return (
      <div className={containerClass}>
        <div className={cardClass}>
          <div className="flex flex-col items-center w-full">
            <Image src="/logo.png" alt="EO Logo" width={96} height={96} className="mb-6" />
          </div>
          <IntroStepProgress />
          <h1 className={headingClass}>Your Personalized EO Roadmap</h1>
          <p className="mb-8 text-gray-600 text-base leading-relaxed">Personalize your EO journey in 3 easy steps (just 2 minutes). Discover the best ways to get value from your membership—tailored just for you.</p>
          <button className={buttonClass + " cursor-pointer"} onClick={() => setStep(1)}>
            Get Started
          </button>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className={containerClass}>
        <div className={cardClass}>
          <div className="flex flex-col items-center w-full">
            <Image src="/logo.png" alt="EO Logo" width={96} height={96} className="mb-6" />
          </div>
          <StepProgress />
          <h1 className={headingClass}>Your Profile</h1>
          <form className="flex flex-col gap-5" onSubmit={e => { e.preventDefault();
            // Log profile info
            console.log('Profile info submitted:', profile);
            setStep(2); }}>
            <label className={labelClass} htmlFor="name">First Name</label>
            <input className={inputClass} id="name" name="name" placeholder="e.g. Jane" value={profile.name} onChange={handleProfileChange} required autoComplete="given-name" />
            <label className={labelClass} htmlFor="company">Company Name</label>
            <input className={inputClass} id="company" name="company" placeholder="e.g. Acme Inc." value={profile.company} onChange={handleProfileChange} required autoComplete="organization" />
            <label className={labelClass} htmlFor="revenue">Company Annual Revenue</label>
            <select
              className={selectClass}
              id="revenue"
              name="revenue"
              value={profile.revenue}
              onChange={handleProfileChange}
              required
            >
              <option value="">Select...</option>
              <option value="<$1M">&lt;$1M</option>
              <option value="$1M–$3M">$1M–$3M</option>
              <option value="$3M–$10M">$3M–$10M</option>
              <option value="$10M+">$10M+</option>
            </select>
            <button className={buttonClass + " cursor-pointer"} type="submit">Next</button>
          </form>
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className={containerClass}>
        <div className={cardClass}>
          <div className="flex flex-col items-center w-full">
            <Image src="/logo.png" alt="EO Logo" width={96} height={96} className="mb-6" />
          </div>
          <StepProgress />
          <h1 className={headingClass}>Quick Quiz</h1>
          <form className="flex flex-col gap-5" onSubmit={e => { e.preventDefault(); setStep(3); }}>
            {quizQuestions.map((q) => (
              <div key={q.name} className="flex flex-col gap-1">
                <label className={labelClass} htmlFor={q.name}>{q.question}</label>
                {q.options.length > 0 ? (
                  <select
                    id={q.name}
                    name={q.name}
                    value={quiz[q.name as keyof typeof quiz]}
                    onChange={handleQuizChange}
                    className={selectClass}
                    required
                  >
                    <option value="">Select...</option>
                    {q.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={inputClass}
                    id={q.name}
                    name={q.name}
                    value={quiz[q.name as keyof typeof quiz]}
                    onChange={handleQuizChange}
                    required
                  />
                )}
              </div>
            ))}
            <button className={buttonClass + " cursor-pointer"} type="submit">See My Journey</button>
          </form>
        </div>
      </div>
    );
  }
  // Step 3: Journey Map (AI summary)
  return (
    <div className={containerClass}>
      <div className={cardClass + " mx-auto"} style={{ maxWidth: '32rem' }}>
        <div className="flex flex-col items-center w-full">
          <Image src="/logo.png" alt="EO Logo" width={96} height={96} className="mb-6" />
        </div>
        <StepProgress />
        {!loading && summary && (
          <div className="text-3xl font-extrabold text-blue-900 mb-4 tracking-tight">Hi {profile.name}!</div>
        )}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[180px] w-full">
            <Loader />
          </div>
        )}
        {error && <div className="text-red-600 text-base font-semibold">{error}</div>}
        {summary && (
          <div className="flex flex-col gap-8">
            {/* Simple split-based rendering */}
            {lastRawAI && (() => {
              const { intro, top5, addl, summary: closing } = splitSummarySections(lastRawAI);
              const top5List = parseList(top5);
              const addlList = parseList(addl);
              getShareContent(top5List, addlList, profile, quiz);
              return (
                <div className="flex flex-col gap-6">
                  {intro && (
                    <div className="text-base text-gray-900 mb-4 whitespace-pre-line">{stripGreeting(intro, profile.name)}</div>
                  )}
                  <div>
                    <div className="text-xl font-bold text-blue-800 mb-3">Top 5 Recommendations</div>
                    <div className="grid gap-4">
                      {top5List.length > 0 ? top5List.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-blue-50 border border-blue-300 rounded-lg p-4 shadow-sm flex flex-col mb-4"
                        >
                          <div className="font-bold text-blue-900">{item.title}</div>
                          {item.desc && <div className="text-gray-900 mt-1">{item.desc}</div>}
                          {getFeatureDetails(item.title) && (
                            <button
                              className="ml-1 mt-2 text-xs text-blue-700 underline hover:text-blue-900 focus:outline-none self-start cursor-pointer"
                              onClick={() => toggleDetails(item.title)}
                              type="button"
                            >
                              {expandedDetails[item.title] ? 'Hide details' : 'More details'}
                            </button>
                          )}
                          {expandedDetails[item.title] && getFeatureDetails(item.title) && (
                            <div className="mt-2 p-3 bg-gray-100 border border-blue-100 rounded text-sm whitespace-pre-line text-gray-800">{getFeatureDetails(item.title)}</div>
                          )}
                        </div>
                      )) : <div className="text-base text-gray-900">No recommendations found.</div>}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-700 mt-6 mb-2">Additional Opportunities</div>
                    <div className="grid gap-4">
                      {addlList.length > 0 ? addlList.map((item) => (
                        <div
                          key={item.title}
                          className="bg-gray-50 border border-gray-300 rounded p-4 flex flex-col mb-4"
                        >
                          <div className="font-bold text-blue-900">{item.title}</div>
                          {item.desc && <div className="text-gray-900 mt-1">{item.desc}</div>}
                          {getFeatureDetails(item.title) && (
                            <button
                              className="ml-1 mt-2 text-xs text-blue-700 underline hover:text-blue-900 focus:outline-none self-start cursor-pointer"
                              onClick={() => toggleDetails(item.title)}
                              type="button"
                            >
                              {expandedDetails[item.title] ? 'Hide details' : 'More details'}
                            </button>
                          )}
                          {expandedDetails[item.title] && getFeatureDetails(item.title) && (
                            <div className="mt-2 p-3 bg-gray-100 border border-gray-200 rounded text-sm whitespace-pre-line text-gray-800">{getFeatureDetails(item.title)}</div>
                          )}
                        </div>
                      )) : <div className="text-base text-gray-800">No additional opportunities found.</div>}
                    </div>
                  </div>
                  <div className="text-base text-blue-800 mt-6 border-t border-blue-100 pt-4 italic">{closing || ''}</div>
                </div>
              );
            })()}
          </div>
        )}
        {!loading && !summary && !error && (
          <div className="text-gray-700">Your personalized EO journey will appear here.</div>
        )}
        {!loading && summary && (() => {
          const { top5, addl } = splitSummarySections(lastRawAI || '');
          const top5List = parseList(top5);
          const addlList = parseList(addl);
          getShareContent(top5List, addlList, profile, quiz);
          return (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              <a
                href={`mailto:?subject=My EO Roadmap Recommendations&body=${getShareContent(top5List, addlList, profile, quiz).emailBody}`}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-base transition shadow focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share with your Navigator via Email"
              >
                Share via Email
              </a>
              {startOverButton && (
                <span className="inline-block">{startOverButton}</span>
              )}
            </div>
          );
        })()}
      </div>
      {!loading && summary && (
        <div className="w-full flex flex-col items-center mt-10">
          <div className="w-full max-w-lg">
            <button
              className="w-full flex flex-col items-center focus:outline-none bg-blue-50 border-2 border-blue-400 rounded-2xl py-8 px-4 mb-2 shadow-lg hover:bg-blue-100 transition group cursor-pointer"
              onClick={() => setShowFullList(v => !v)}
              type="button"
              aria-expanded={showFullList}
            >
              <span className="text-2xl font-extrabold text-blue-900 tracking-tight text-center mb-2 group-hover:text-blue-700 transition">
                Explore the Full List of EO Features
              </span>
              <span className="flex items-center justify-center mt-2">
                <svg className={`w-12 h-12 text-blue-400 transition-transform duration-300 ${showFullList ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
          {showFullList && (
            <section className="w-full max-w-lg mt-6 border-t border-blue-200 pt-8">
              {['CONNECT', 'LEARN', 'GROW'].map(category => (
                <div key={category} className="mb-8">
                  <div className="text-lg font-bold text-blue-700 mb-3">{category.charAt(0) + category.slice(1).toLowerCase()}</div>
                  <div className="grid gap-4">
                    {eoFeatures.filter(f => f.category === category).map(feature => (
                      <div key={feature.name} className="border border-gray-300 rounded-lg p-4 bg-white">
                        <div className="font-bold text-blue-900 text-base mb-1">{feature.name}</div>
                        <div className="text-gray-800 text-sm mb-1">{feature.description}</div>
                        <div className="text-xs text-gray-600 mb-1"><span className="font-semibold">Format:</span> {feature.format}</div>
                        <div className="text-xs text-gray-600"><span className="font-semibold">Cost:</span> {feature.cost}</div>
                        {feature.details && (
                          <button
                            className="ml-1 mt-2 text-xs text-blue-700 underline hover:text-blue-900 focus:outline-none self-start cursor-pointer"
                            onClick={() => toggleDetails(feature.name)}
                            type="button"
                          >
                            {expandedDetails[feature.name] ? 'Hide details' : 'More details'}
                          </button>
                        )}
                        {expandedDetails[feature.name] && feature.details && (
                          <div className="mt-2 p-3 bg-gray-100 border border-gray-200 rounded text-sm whitespace-pre-line text-gray-800">{feature.details}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
