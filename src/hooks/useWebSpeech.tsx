import { useState, useCallback, useRef, useEffect } from 'react';

interface UseWebSpeechOptions {
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

export const useWebSpeech = (options: UseWebSpeechOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const optionsRef = useRef(options);

  // Mettre à jour les options sans recréer le hook
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const startListening = useCallback(() => {
    try {
      // @ts-ignore - Web Speech API n'est pas dans les types par défaut
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        optionsRef.current.onError?.('Web Speech API non supportée');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = true;

      let finalTranscript = '';

      recognition.onstart = () => {
        setIsListening(true);
        finalTranscript = '';
      };

      recognition.onend = () => {
        setIsListening(false);
        if (finalTranscript) {
          optionsRef.current.onResult?.(finalTranscript);
        }
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognition.onerror = (event: any) => {
        optionsRef.current.onError?.(event.error || 'Erreur de reconnaissance vocale');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      optionsRef.current.onError?.(String(error));
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Déjà arrêté
      }
      setIsListening(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    try {
      // Vérifier si le navigateur supporte l'API
      if (!('speechSynthesis' in window)) {
        optionsRef.current.onError?.('Text-to-Speech non supportée');
        return;
      }

      // Arrêter la parole précédente si elle est en cours
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event: any) => {
        optionsRef.current.onError?.(event.error);
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      optionsRef.current.onError?.(String(error));
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    try {
      speechSynthesis.cancel();
    } catch (e) {
      // Déjà arrêté
    }
    setIsSpeaking(false);
  }, []);

  const isSupported = useCallback(() => {
    return (
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
      'speechSynthesis' in window
    );
  }, []);

  return {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported
  };
};
