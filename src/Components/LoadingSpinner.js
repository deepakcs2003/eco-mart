import React, { useState, useEffect, useRef } from 'react';

const LoadingSpinner = () => {
  const [currentFact, setCurrentFact] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [raindrops, setRaindrops] = useState([]);
  const [theme, setTheme] = useState("forest"); // forest, ocean, desert
  
  // Ref for element dimensions
  const containerRef = useRef(null);
  
  const themes = {
    forest: {
      primary: "#228B22",
      secondary: "#6B8E23",
      background: "#A8B5A2",
      accent1: "#317873",
      accent2: "#87CEEB",
      neutral1: "#8B5A2B",
      neutral2: "#F5DEB3"
    },
    ocean: {
      primary: "#1E90FF",
      secondary: "#20B2AA",
      background: "#E0FFFF",
      accent1: "#4682B4",
      accent2: "#00CED1",
      neutral1: "#4169E1",
      neutral2: "#B0E0E6"
    },
    desert: {
      primary: "#CD853F",
      secondary: "#DEB887",
      background: "#F5DEB3",
      accent1: "#D2691E",
      accent2: "#FFDEAD",
      neutral1: "#8B4513",
      neutral2: "#FFE4B5"
    }
  };
  
  const currentTheme = themes[theme];
  
  const ecoFacts = [
    {
      fact: "Using one reusable bottle prevents 167 plastic bottles from entering our oceans annually.",
      icon: "🌊",
      quiz: {
        question: "How many plastic bottles can be saved annually by using one reusable bottle?",
        options: ["About 50", "Around 100", "Over 150", "Less than 30"],
        answer: 2
      }
    },
    {
      fact: "Bamboo grows up to 35 inches per day, making it one of the most sustainable materials.",
      icon: "🎋",
      quiz: {
        question: "How fast can bamboo grow in a single day?",
        options: ["Up to 5 inches", "Up to 15 inches", "Up to 25 inches", "Up to 35 inches"],
        answer: 3
      }
    },
    {
      fact: "Solar panels can reduce your carbon footprint by 80% in just one year.",
      icon: "☀️",
      quiz: {
        question: "By what percentage can solar panels reduce your carbon footprint in a year?",
        options: ["30%", "50%", "80%", "100%"],
        answer: 2
      }
    },
    {
      fact: "A single tree can absorb 48 pounds of CO₂ per year, helping combat climate change.",
      icon: "🌳",
      quiz: {
        question: "How many pounds of CO₂ can a single tree absorb per year?",
        options: ["15 pounds", "30 pounds", "48 pounds", "60 pounds"],
        answer: 2
      }
    },
    {
      fact: "Eco-friendly products typically use 70% less energy during production.",
      icon: "⚡",
      quiz: {
        question: "How much less energy do eco-friendly products typically use during production?",
        options: ["30%", "50%", "70%", "90%"],
        answer: 2
      }
    }
  ];
  
  // Generate raindrops
  useEffect(() => {
    if (containerRef.current && theme === "forest") {
      const containerWidth = containerRef.current.offsetWidth;
      const newRaindrops = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * containerWidth,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 7,
        size: 3 + Math.random() * 5
      }));
      setRaindrops(newRaindrops);
    } else {
      setRaindrops([]);
    }
  }, [theme, containerRef.current]);
  
  useEffect(() => {
    let factInterval;
    let progressInterval;
    
    if (!isPaused) {
      factInterval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % ecoFacts.length);
        setShowQuiz(false);
        setQuizAnswer(null);
      }, 8000);
      
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
    
    return () => {
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, [isPaused]);
  
  // Handle confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);
  
  const handlePrevFact = () => {
    setCurrentFact((prev) => (prev - 1 + ecoFacts.length) % ecoFacts.length);
    setShowQuiz(false);
    setQuizAnswer(null);
  };
  
  const handleNextFact = () => {
    setCurrentFact((prev) => (prev + 1) % ecoFacts.length);
    setShowQuiz(false);
    setQuizAnswer(null);
  };
  
  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount(prev => prev + 1);
      setHasLiked(true);
      setEcoPoints(prev => prev + 5);
      setShowConfetti(true);
    }
  };
  
  const handleQuizAnswer = (answerIndex) => {
    setQuizAnswer(answerIndex);
    if (answerIndex === ecoFacts[currentFact].quiz.answer) {
      setEcoPoints(prev => prev + 10);
      setShowConfetti(true);
    }
  };
  
  const toggleTheme = () => {
    const themeOrder = ["forest", "ocean", "desert"];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };
  
  // Confetti component
  const Confetti = () => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => {
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      const color = [currentTheme.primary, currentTheme.secondary, currentTheme.accent1, currentTheme.accent2][Math.floor(Math.random() * 4)];
      const size = 5 + Math.random() * 10;
      const duration = 1 + Math.random() * 2;
      const delay = Math.random();
      
      return (
        <div 
          key={i}
          className="absolute rounded-sm"
          style={{
            left: `${randomX}%`,
            top: `${randomY}%`,
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            animation: `confetti ${duration}s ease ${delay}s forwards`,
            opacity: 0
          }}
        />
      );
    });
    
    return confettiPieces;
  };
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center p-8 rounded-lg max-w-md mx-auto shadow-lg transition-all duration-300 relative overflow-hidden"
      style={{ 
        backgroundColor: isHovered ? currentTheme.background : `${currentTheme.background}cc`,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? '0 10px 25px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      {raindrops.map(drop => (
        <div
          key={drop.id}
          className="absolute rounded-full"
          style={{
            left: `${drop.left}px`,
            top: `-10px`,
            width: `${drop.size}px`,
            height: `${drop.size * 2}px`,
            backgroundColor: currentTheme.accent2,
            opacity: 0.6,
            animation: `raindrop ${drop.duration}s linear ${drop.delay}s infinite`
          }}
        />
      ))}
      
      {showConfetti && <Confetti />}
      
      {/* Header with theme switcher, counter, and points */}
      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: currentTheme.accent1, color: 'white' }}>
            Fact {currentFact + 1}/{ecoFacts.length}
          </div>
          <button 
            onClick={toggleTheme}
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: currentTheme.secondary, color: 'white' }}
          >
            {theme === "forest" ? "🌳" : theme === "ocean" ? "🌊" : "🏜️"}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: currentTheme.primary, color: 'white' }}>
            {ecoPoints} Points 🌿
          </div>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
            style={{ backgroundColor: isPaused ? '#A52A2A' : currentTheme.secondary, color: 'white' }}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
      
      {/* Interactive Earth with pulse effect */}
      <div 
        className="relative mb-6 cursor-pointer transition-transform hover:scale-110 z-10"
        onClick={() => setIsPaused(!isPaused)}
      >
        <div className="w-24 h-24 rounded-full border-4 animate-spin" 
             style={{ 
               borderColor: currentTheme.accent1, 
               borderTopColor: 'transparent',
               animationDuration: isPaused ? '3s' : '1s',
               opacity: isPaused ? 0.6 : 1
             }}>
        </div>
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full animate-ping" 
             style={{ backgroundColor: currentTheme.accent2, opacity: 0.2, animationDuration: '3s' }}>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={currentTheme.primary} strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"></path>
            <path d="M2 12h20"></path>
          </svg>
        </div>
      </div>
      
      {/* Progress Bar with animated gradient */}
      <div className="w-full h-4 rounded-full mb-6 overflow-hidden" style={{ backgroundColor: `${currentTheme.neutral2}4d` }}>
        <div 
          className="h-full rounded-full transition-all duration-200 ease-out bg-gradient-to-r"
          style={{ 
            width: `${progress}%`, 
            backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.secondary}, ${currentTheme.accent1})`
          }}>
        </div>
      </div>
      
      {/* Eco Fact Card */}
      <div 
        className="relative w-full text-center p-6 rounded-lg mb-4 min-h-32 flex flex-col items-center justify-center shadow-md transition-all duration-300"
        style={{ 
          backgroundColor: currentTheme.neutral2, 
          color: currentTheme.neutral1,
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
        }}
      >
        {!showQuiz ? (
          <>
            <div className="text-4xl mb-2">{ecoFacts[currentFact].icon}</div>
            <p className="font-medium text-lg">{ecoFacts[currentFact].fact}</p>
            
            <button 
              onClick={() => setShowQuiz(true)}
              className="mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ backgroundColor: currentTheme.primary, color: 'white' }}
            >
              Test Your Knowledge
            </button>
          </>
        ) : (
          <div className="quiz-container w-full">
            <p className="font-bold mb-3">{ecoFacts[currentFact].quiz.question}</p>
            <div className="grid grid-cols-1 gap-2 w-full">
              {ecoFacts[currentFact].quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  className="px-4 py-2 rounded-lg text-left transition-all hover:translate-x-1"
                  style={{ 
                    backgroundColor: quizAnswer === null 
                      ? `${currentTheme.accent1}4d` 
                      : quizAnswer === index 
                        ? index === ecoFacts[currentFact].quiz.answer 
                          ? '#4CAF50' 
                          : '#F44336' 
                        : index === ecoFacts[currentFact].quiz.answer && quizAnswer !== null 
                          ? '#4CAF50' 
                          : `${currentTheme.accent1}4d`,
                    color: quizAnswer !== null && (index === ecoFacts[currentFact].quiz.answer || quizAnswer === index) ? 'white' : currentTheme.neutral1,
                    opacity: quizAnswer !== null && quizAnswer !== index && index !== ecoFacts[currentFact].quiz.answer ? 0.6 : 1,
                    transform: quizAnswer === index ? 'scale(1.03)' : 'scale(1)'
                  }}
                  disabled={quizAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <p className="mt-4 font-medium" style={{ color: quizAnswer === ecoFacts[currentFact].quiz.answer ? '#4CAF50' : '#F44336' }}>
                {quizAnswer === ecoFacts[currentFact].quiz.answer ? 'Correct! +10 points' : 'Try again!'}
              </p>
            )}
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="absolute inset-x-0 flex justify-between px-2 top-1/2 transform -translate-y-1/2">
          <button 
            onClick={handlePrevFact}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-opacity-70 hover:bg-opacity-100 transition-all"
            style={{ backgroundColor: currentTheme.accent1, color: 'white' }}
          >
            &#8249;
          </button>
          <button 
            onClick={handleNextFact}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-opacity-70 hover:bg-opacity-100 transition-all"
            style={{ backgroundColor: currentTheme.accent1, color: 'white' }}
          >
            &#8250;
          </button>
        </div>
      </div>
      
      {/* Share button */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="text-center font-bold" style={{ color: currentTheme.accent1 }}>
          <p>Your eco-friendly choice is making a difference!</p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleLike}
            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-all"
            style={{ 
              backgroundColor: hasLiked ? currentTheme.primary : currentTheme.neutral2,
              color: hasLiked ? 'white' : currentTheme.neutral1,
              transform: hasLiked ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <span>{hasLiked ? "❤️" : "🤍"}</span>
            <span>{likeCount}</span>
          </button>
          
          <button 
            className="flex items-center space-x-1 px-3 py-1 rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: currentTheme.secondary, color: 'white' }}
          >
            <span>Share 📱</span>
          </button>
        </div>
      </div>
      
      {/* User input - pledge */}
      <div 
        className="w-full p-3 rounded-lg mb-4 transition-all hover:scale-101"
        style={{ backgroundColor: `${currentTheme.neutral2}cc` }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <input 
            type="checkbox" 
            id="pledge" 
            className="w-4 h-4 cursor-pointer"
            onChange={() => {
              setEcoPoints(prev => prev + 15);
              setShowConfetti(true);
            }}
          />
          <label htmlFor="pledge" className="cursor-pointer font-medium" style={{ color: currentTheme.neutral1 }}>
            I pledge to choose eco-friendly products this month
          </label>
        </div>
      </div>
      
      {/* Leaf Decorations with animation */}
      <div className="flex justify-between w-full mt-2">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill={currentTheme.primary}
          style={{ animation: 'sway 3s ease-in-out infinite' }}
          className="transform hover:scale-125 transition-transform cursor-pointer"
        >
          <path d="M17.6 11.4c-.2-.1-.3-.2-.5-.2.2-.5.3-1.1.3-1.7 0-2.1-1.6-3.9-3.7-4.2-2.1-.3-4.1 1-4.6 3-.5-.3-1-.4-1.6-.4-1.9 0-3.5 1.6-3.5 3.5 0 1.9 1.6 3.5 3.5 3.5.2 0 .4 0 .5-.1.6 1.2 1.9 2 3.3 2 .9 0 1.8-.4 2.4-1 .6.7 1.6 1.1 2.6 1.1 2 0 3.5-1.6 3.5-3.5.1-1-.4-2-1.2-2z"/>
        </svg>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill={currentTheme.secondary}
          style={{ animation: 'sway 3s ease-in-out infinite reverse' }}
          className="transform hover:scale-125 transition-transform cursor-pointer"
        >
          <path d="M17.6 11.4c-.2-.1-.3-.2-.5-.2.2-.5.3-1.1.3-1.7 0-2.1-1.6-3.9-3.7-4.2-2.1-.3-4.1 1-4.6 3-.5-.3-1-.4-1.6-.4-1.9 0-3.5 1.6-3.5 3.5 0 1.9 1.6 3.5 3.5 3.5.2 0 .4 0 .5-.1.6 1.2 1.9 2 3.3 2 .9 0 1.8-.4 2.4-1 .6.7 1.6 1.1 2.6 1.1 2 0 3.5-1.6 3.5-3.5.1-1-.4-2-1.2-2z"/>
        </svg>
      </div>
      
      {/* Add keyframe animations */}
      <style>
        {`
          @keyframes sway {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }
          
          @keyframes raindrop {
            0% { transform: translateY(-10px); opacity: 0; }
            10% { opacity: 0.7; }
            90% { opacity: 0.7; }
            100% { transform: translateY(500px); opacity: 0; }
          }
          
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;