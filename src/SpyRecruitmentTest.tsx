import React, { useState, useEffect } from 'react';
import { Eye, Lock, Brain, Target, Clock, AlertTriangle, Award, ChevronRight } from 'lucide-react';

export default function SpyRecruitmentTest() {
  const [stage, setStage] = useState('intro');
  const [currentTest, setCurrentTest] = useState(0);
  const [scores, setScores] = useState({
    observation: 0,
    crypto: 0,
    logic: 0,
    stress: 0,
    memory: 0
  });
  const [timeLeft, setTimeLeft] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [easterEggs, setEasterEggs] = useState([]);
  const [memoryItems, setMemoryItems] = useState([]);
  const [showMemoryTest, setShowMemoryTest] = useState(false);

  // Easter egg tracking
  const foundEasterEgg = (egg) => {
    if (!easterEggs.includes(egg)) {
      setEasterEggs([...easterEggs, egg]);
    }
  };

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft]);

  const handleTimeout = () => {
    setFeedback({ correct: false, message: "Temps écoulé ! Un agent doit savoir gérer la pression du temps." });
    setTimeout(() => nextTest(), 3000);
  };

  const tests = [
    {
      id: 'observation',
      title: 'ÉPREUVE D\'OBSERVATION',
      icon: Eye,
      time: 45,
      question: 'Analysez cette photo de surveillance. Combien de personnes portent des montres ?',
      hint: 'Les détails comptent dans notre métier.',
      answer: '3',
      component: 'observation'
    },
    {
      id: 'crypto',
      title: 'DÉCHIFFREMENT',
      icon: Lock,
      time: 60,
      question: 'Message intercepté : "UFTUDVS EF SFDSVUFNFOU" (Chiffre de César, décalage +1)',
      hint: 'Jules César utilisait ce code pour ses messages secrets.',
      answer: 'TEST DE RECRUTEMENT',
      component: 'crypto'
    },
    {
      id: 'logic',
      title: 'RAISONNEMENT LOGIQUE',
      icon: Brain,
      time: 50,
      question: 'Quelle est la prochaine valeur : 2, 6, 12, 20, 30, ?',
      hint: 'Cherchez la différence entre les différences.',
      answer: '42',
      component: 'logic'
    },
    {
      id: 'stress',
      title: 'GESTION DU STRESS',
      icon: AlertTriangle,
      time: 30,
      question: 'Votre couverture est compromise. Vous avez 3 contacts possibles. Lequel choisir ?',
      options: [
        'Contact A : Fiable mais à 2h de route',
        'Contact B : Proche mais communication compromise hier',
        'Contact C : Nouveau, non testé, à 20 minutes'
      ],
      answer: 'Contact A : Fiable mais à 2h de route',
      component: 'mcq'
    },
    {
      id: 'memory',
      title: 'MÉMOIRE PHOTOGRAPHIQUE',
      icon: Target,
      time: 60,
      question: 'Mémorisez ces codes d\'accès (15 secondes)',
      component: 'memory'
    }
  ];

  const startTest = () => {
    setStage('briefing');
  };

  const beginTests = () => {
    setStage('testing');
    setCurrentTest(0);
    setTimeLeft(tests[0].time);
    if (tests[0].component === 'memory') {
      generateMemoryTest();
    }
  };

  const generateMemoryTest = () => {
    const codes = [
      { label: 'Alpha', code: '7-4-9-2' },
      { label: 'Bravo', code: '3-8-1-6' },
      { label: 'Charlie', code: '5-2-7-4' }
    ];
    setMemoryItems(codes);
    setTimeout(() => setShowMemoryTest(true), 15000);
  };

  const checkAnswer = () => {
    const test = tests[currentTest];
    let correct = false;

    if (test.component === 'mcq') {
      correct = answer === test.answer;
    } else if (test.component === 'memory') {
      correct = answer.toLowerCase().includes('7') && answer.toLowerCase().includes('4');
    } else {
      const normalizedAnswer = answer.toLowerCase().trim();
      const normalizedCorrect = test.answer.toLowerCase().trim();
      correct = normalizedAnswer === normalizedCorrect;
    }

    const bonusPoints = timeLeft > test.time / 2 ? 20 : 0;
    
    if (correct) {
      setScores({
        ...scores,
        [test.id]: 100 + bonusPoints
      });
      setFeedback({ 
        correct: true, 
        message: bonusPoints > 0 ? "Excellent ! Rapidité et précision." : "Correct. Bien joué."
      });
    } else {
      setScores({
        ...scores,
        [test.id]: 30
      });
      setFeedback({ 
        correct: false, 
        message: `Incorrect. La bonne réponse était : ${test.answer}`
      });
    }

    setTimeout(() => nextTest(), 3000);
  };

  const nextTest = () => {
    setFeedback(null);
    setAnswer('');
    if (currentTest < tests.length - 1) {
      setCurrentTest(currentTest + 1);
      setTimeLeft(tests[currentTest + 1].time);
      if (tests[currentTest + 1].component === 'memory') {
        generateMemoryTest();
        setShowMemoryTest(false);
      }
    } else {
      setStage('results');
    }
  };

  const calculateRank = () => {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const easterEggBonus = easterEggs.length * 50;
    const finalScore = totalScore + easterEggBonus;
    
    if (finalScore >= 550) return { rank: 'DIRECTEUR DES OPÉRATIONS', level: 'ULTRA', color: 'text-yellow-400' };
    if (finalScore >= 450) return { rank: 'AGENT DE TERRAIN SENIOR', level: 'ALPHA', color: 'text-green-400' };
    if (finalScore >= 350) return { rank: 'ANALYSTE CONFIRMÉ', level: 'BRAVO', color: 'text-blue-400' };
    if (finalScore >= 250) return { rank: 'AGENT JUNIOR', level: 'CHARLIE', color: 'text-purple-400' };
    return { rank: 'RECRUE EN FORMATION', level: 'DELTA', color: 'text-gray-400' };
  };

  // Intro Screen
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-8 text-center">
            <div className="text-red-500 text-sm mb-2 tracking-widest">● CLASSIFIÉ - NIVEAU DELTA</div>
            <h1 className="text-4xl font-bold mb-2 tracking-wider">AGENCE CENTRALE</h1>
            <div className="text-xs tracking-widest text-gray-500">DE RENSEIGNEMENT ET D'ANALYSE</div>
          </div>

          <div className="border border-green-400/30 p-8 mb-6 bg-green-950/10 backdrop-blur">
            <div className="text-yellow-400 mb-4 text-sm">⚠ AVERTISSEMENT DE SÉCURITÉ</div>
            <p className="mb-4 text-sm leading-relaxed">
              Vous êtes sur le point d'accéder à un système de recrutement sécurisé. 
              Ce test évaluera vos capacités en matière d'observation, de cryptographie, 
              de raisonnement logique, de gestion du stress et de mémoire.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Toute tentative d'intrusion sera signalée aux autorités compétentes.
            </p>
            <div className="text-xs text-green-600/50 hover:text-green-400 cursor-pointer transition-colors"
                 onClick={() => foundEasterEgg('konami')}
                 onDoubleClick={() => foundEasterEgg('double-click')}>
              [ID: 7A3F-9B2E-4C1D] - v2.7.1983
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[Eye, Lock, Brain, AlertTriangle, Target].map((Icon, i) => (
              <div key={i} className="border border-green-400/20 p-4 text-center hover:bg-green-950/20 transition-all">
                <Icon className="mx-auto mb-2 w-8 h-8" />
                <div className="text-xs">MODULE {i + 1}</div>
              </div>
            ))}
          </div>

          <button
            onClick={startTest}
            className="w-full bg-green-900/30 hover:bg-green-800/50 border border-green-400 text-green-400 py-4 px-6 transition-all font-bold tracking-wider flex items-center justify-center gap-2 group"
          >
            ACCÉDER AU TEST
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-8 text-center text-xs text-gray-600">
            <div>Session initiée : {new Date().toLocaleString()}</div>
            <div className="mt-2" onMouseEnter={() => foundEasterEgg('footer')}>
              "La vérité est rarement pure et jamais simple" - O.W.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Briefing Screen
  if (stage === 'briefing') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-mono p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="text-red-500 text-xs mb-2">● TRANSMISSION SÉCURISÉE</div>
            <h2 className="text-3xl font-bold text-green-400">BRIEFING OPÉRATIONNEL</h2>
          </div>

          <div className="bg-gray-800 border-l-4 border-yellow-500 p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold mb-2 text-yellow-500">ATTENTION CANDIDAT</div>
                <p className="text-sm leading-relaxed">
                  Vous allez être soumis à une série d'épreuves conçues pour tester vos capacités 
                  opérationnelles. Chaque épreuve est chronométrée. La précision et la rapidité 
                  seront toutes deux évaluées.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-800/50 p-4 border border-gray-700">
              <h3 className="text-green-400 font-bold mb-2">OBJECTIFS</h3>
              <ul className="text-sm space-y-2">
                <li>→ Démontrer vos capacités d'observation</li>
                <li>→ Prouver vos compétences en déchiffrement</li>
                <li>→ Faire preuve de logique sous pression</li>
                <li>→ Gérer des situations de stress</li>
                <li>→ Montrer votre mémoire photographique</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-4 border border-gray-700">
              <h3 className="text-blue-400 font-bold mb-2">RÈGLES D'ENGAGEMENT</h3>
              <ul className="text-sm space-y-2">
                <li>→ Chaque épreuve a un temps limité</li>
                <li>→ Les réponses rapides donnent des points bonus</li>
                <li>→ Soyez attentif aux détails</li>
                <li 
                  className="text-gray-600 hover:text-gray-400 cursor-pointer transition-colors"
                  onClick={() => foundEasterEgg('rules')}>
                  → Les meilleurs agents trouvent ce qui est caché
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={beginTests}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-4 px-6 transition-all font-bold tracking-wider"
          >
            COMMENCER L'ÉVALUATION
          </button>
        </div>
      </div>
    );
  }

  // Testing Screen
  if (stage === 'testing') {
    const test = tests[currentTest];
    const Icon = test.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 font-mono p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="text-green-400 text-xs mb-1">ÉPREUVE {currentTest + 1}/5</div>
              <div className="flex items-center gap-2">
                <Icon className="text-green-400" size={20} />
                <h2 className="text-xl font-bold">{test.title}</h2>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">TEMPS RESTANT</div>
              <div className={`text-3xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Test Content */}
          <div className="bg-gray-800 border border-gray-700 p-8 mb-6">
            {test.component === 'observation' && (
              <div>
                <p className="mb-6">{test.question}</p>
                <div className="bg-gray-900 p-6 mb-4 border border-gray-700 relative">
                  <div className="text-xs text-gray-600 mb-4">IMAGE DE SURVEILLANCE - CAMÉRA #7</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-800 border border-gray-700">
                      <div className="text-4xl mb-2">👤</div>
                      <div className="text-xs">Sujet A</div>
                      <div className="text-xs text-green-400">⌚ Montre</div>
                    </div>
                    <div className="p-4 bg-gray-800 border border-gray-700">
                      <div className="text-4xl mb-2">👤</div>
                      <div className="text-xs">Sujet B</div>
                      <div className="text-xs text-gray-600">Pas de montre</div>
                    </div>
                    <div className="p-4 bg-gray-800 border border-gray-700">
                      <div className="text-4xl mb-2">👤</div>
                      <div className="text-xs">Sujet C</div>
                      <div className="text-xs text-green-400">⌚ Montre</div>
                    </div>
                    <div className="p-4 bg-gray-800 border border-gray-700">
                      <div className="text-4xl mb-2">👤</div>
                      <div className="text-xs">Sujet D</div>
                      <div className="text-xs text-gray-600">Pas de montre</div>
                    </div>
                    <div className="p-4 bg-gray-800 border border-gray-700">
                      <div className="text-4xl mb-2">👤</div>
                      <div className="text-xs">Sujet E</div>
                      <div className="text-xs text-green-400">⌚ Montre</div>
                    </div>
                    <div 
                      className="p-4 bg-gray-800 border border-gray-700 cursor-pointer hover:border-green-400 transition-colors"
                      onClick={() => foundEasterEgg('observation')}>
                      <div className="text-xs text-gray-700">Angle mort</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {test.component === 'crypto' && (
              <div>
                <p className="mb-6">{test.question}</p>
                <div className="bg-black p-6 mb-4 border border-green-900 font-mono">
                  <div className="text-green-400 text-center text-xl tracking-widest">
                    UFTUDVS EF SFDSVUFNFOU
                  </div>
                </div>
                <div className="text-xs text-gray-500">{test.hint}</div>
              </div>
            )}

            {test.component === 'logic' && (
              <div>
                <p className="mb-6">{test.question}</p>
                <div className="bg-gray-900 p-6 mb-4 border border-gray-700">
                  <div className="text-center text-2xl tracking-wider text-blue-400">
                    2, 6, 12, 20, 30, <span className="text-green-400">?</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{test.hint}</div>
              </div>
            )}

            {test.component === 'mcq' && (
              <div>
                <p className="mb-6 text-yellow-400">{test.question}</p>
                <div className="space-y-3">
                  {test.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setAnswer(option)}
                      className={`w-full p-4 text-left border transition-all ${
                        answer === option
                          ? 'border-green-400 bg-green-900/30'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {test.component === 'memory' && !showMemoryTest && (
              <div>
                <p className="mb-6">{test.question}</p>
                <div className="bg-gray-900 p-6 border border-yellow-600">
                  <div className="text-yellow-400 text-center mb-4 font-bold">MÉMORISEZ CES CODES</div>
                  <div className="space-y-3">
                    {memoryItems.map((item, i) => (
                      <div key={i} className="flex justify-between p-3 bg-black border border-gray-700">
                        <span className="text-green-400">{item.label}</span>
                        <span className="font-bold tracking-widest">{item.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {test.component === 'memory' && showMemoryTest && (
              <div>
                <p className="mb-6">Quel était le code d'accès pour "Alpha" ?</p>
                <div className="bg-gray-900 p-6 border border-gray-700">
                  <div className="text-center text-gray-600">Les codes ont disparu...</div>
                </div>
              </div>
            )}
          </div>

          {/* Answer Input */}
          {!feedback && test.component !== 'mcq' && (
            <div className="mb-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder="Votre réponse..."
                className="w-full bg-gray-900 border border-gray-700 p-4 text-green-400 font-mono focus:outline-none focus:border-green-400"
                disabled={test.component === 'memory' && !showMemoryTest}
              />
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 mb-4 border ${
              feedback.correct 
                ? 'bg-green-900/30 border-green-400 text-green-400' 
                : 'bg-red-900/30 border-red-400 text-red-400'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Submit Button */}
          {!feedback && (test.component !== 'memory' || showMemoryTest) && (
            <button
              onClick={checkAnswer}
              disabled={!answer}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-4 px-6 transition-all font-bold tracking-wider"
            >
              VALIDER LA RÉPONSE
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  if (stage === 'results') {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const easterEggBonus = easterEggs.length * 50;
    const finalScore = totalScore + easterEggBonus;
    const rank = calculateRank();

    return (
      <div className="min-h-screen bg-black text-gray-100 font-mono p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Award className="mx-auto mb-4 text-yellow-400" size={64} />
            <div className="text-xs text-gray-500 mb-2">ÉVALUATION TERMINÉE</div>
            <h2 className="text-4xl font-bold mb-2">RÉSULTATS</h2>
            <div className={`text-2xl font-bold ${rank.color} tracking-wider`}>
              {rank.rank}
            </div>
            <div className="text-sm text-gray-500 mt-2">CLASSIFICATION : {rank.level}</div>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-green-400 mb-2">{finalScore}</div>
              <div className="text-sm text-gray-500">SCORE TOTAL</div>
            </div>

            <div className="space-y-4">
              {Object.entries(scores).map(([key, score]) => {
                const test = tests.find(t => t.id === key);
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <test.icon size={16} className="text-green-400" />
                      <span className="text-sm">{test.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-800 h-2">
                        <div 
                          className="bg-green-400 h-2 transition-all" 
                          style={{width: `${Math.min(score, 100)}%`}}
                        ></div>
                      </div>
                      <span className="text-green-400 font-bold w-12 text-right">{score}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {easterEggs.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="text-center mb-4">
                  <div className="text-yellow-400 font-bold mb-2">🔍 BONUS : EASTER EGGS TROUVÉS</div>
                  <div className="text-sm text-gray-400 mb-2">
                    Vous avez découvert {easterEggs.length} secret{easterEggs.length > 1 ? 's' : ''} caché{easterEggs.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-green-400 font-bold text-2xl">+{easterEggBonus} points</div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {easterEggs.map((egg, i) => (
                    <span key={i} className="px-3 py-1 bg-yellow-900/30 border border-yellow-600 text-yellow-400 text-xs">
                      {egg.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 border-l-4 border-blue-500 p-6 mb-6">
            <h3 className="font-bold mb-3 text-blue-400">ANALYSE DU PROFIL</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              {finalScore >= 550 && "Exceptionnel. Vous démontrez toutes les qualités requises pour diriger des opérations complexes. Vos capacités d'observation et d'analyse sont remarquables."}
              {finalScore >= 450 && finalScore < 550 && "Excellentes performances. Vous êtes prêt pour des missions terrain exigeantes. Votre rapidité de décision et votre sang-froid sont des atouts majeurs."}
              {finalScore >= 350 && finalScore < 450 && "Solide performance. Vous montrez un bon potentiel analytique. Continuez à développer vos compétences en cryptographie et en gestion du stress."}
              {finalScore >= 250 && finalScore < 350 && "Bon début. Vous avez les bases nécessaires mais devrez encore perfectionner vos compétences avant d'être opérationnel sur le terrain."}
              {finalScore < 250 && "Potentiel à développer. Nous vous recommandons une formation approfondie avant de pouvoir vous confier des missions actives."}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 px-6 transition-all font-bold tracking-wider"
          >
            RECOMMENCER L'ÉVALUATION
          </button>

          <div className="mt-8 text-center text-xs text-gray-600">
            <div>Rapport généré : {new Date().toLocaleString()}</div>
            <div className="mt-2">Session ID : {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
          </div>
        </div>
      </div>
    );
  }
}
