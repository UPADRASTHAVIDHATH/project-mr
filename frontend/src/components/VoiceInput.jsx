import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceInput({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (e) => {
        const text = e.results[0][0].transcript;
        if (onTranscript) onTranscript(text);
        setIsListening(false);
      };

      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);
      setRecognition(recog);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported by your browser. Please type your symptoms.');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
        isListening
          ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
      }`}
      title="Speak your symptoms to M.R"
    >
      {isListening ? (
        <>
          <Mic className="w-4 h-4 animate-ping text-white" />
          <span>Listening to your symptoms...</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-blue-400" />
          <span>🎤 Voice Input (Speech to Text)</span>
        </>
      )}
    </button>
  );
}
