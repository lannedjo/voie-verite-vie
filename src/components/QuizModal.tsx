import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Brain, BookOpen, ArrowRight, Trophy, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

interface OpenEndedQuestion {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleAnswer: string;
}

interface QuizData {
  multipleChoice: MultipleChoiceQuestion[];
  openEnded: OpenEndedQuestion[];
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: {
    id: string;
    books: string;
    chapters: string;
    day_number: number;
  } | null;
}

export const QuizModal = ({ isOpen, onClose, reading }: QuizModalProps) => {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentSection, setCurrentSection] = useState<'mc' | 'open'>('mc');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ mc: 0, open: 0 });
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async () => {
    if (!reading) return;
    
    setLoading(true);
    setQuizData(null);
    setCurrentSection('mc');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setOpenAnswer('');
    setShowResult(false);
    setScore({ mc: 0, open: 0 });
    setQuizCompleted(false);

    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: {
          books: reading.books,
          chapters: reading.chapters,
          dayNumber: reading.day_number
        }
      });

      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }

      setQuizData(data);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le quiz. Réessayez.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMCAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (quizData?.multipleChoice[currentIndex].correctIndex === index) {
      setScore(prev => ({ ...prev, mc: prev.mc + 1 }));
    }
  };

  const handleNext = () => {
    if (currentSection === 'mc') {
      if (currentIndex < (quizData?.multipleChoice.length || 0) - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setCurrentSection('open');
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    } else {
      if (currentIndex < (quizData?.openEnded.length || 0) - 1) {
        setCurrentIndex(prev => prev + 1);
        setOpenAnswer('');
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const handleOpenSubmit = () => {
    if (!openAnswer.trim()) return;
    setShowResult(true);
    setScore(prev => ({ ...prev, open: prev.open + 1 }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return difficulty;
    }
  };

  const totalQuestions = (quizData?.multipleChoice.length || 0) + (quizData?.openEnded.length || 0);
  const currentQuestionNumber = currentSection === 'mc' 
    ? currentIndex + 1 
    : (quizData?.multipleChoice.length || 0) + currentIndex + 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Quiz - Jour {reading?.day_number}
          </DialogTitle>
        </DialogHeader>

        {!quizData && !loading && (
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Félicitations pour votre lecture !</h3>
            <p className="text-muted-foreground mb-4">
              Testez vos connaissances sur {reading?.books}, chapitres {reading?.chapters}
            </p>
            <Button onClick={generateQuiz}>
              <Brain className="w-4 h-4 mr-2" />
              Commencer le Quiz
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Génération du quiz en cours...</p>
          </div>
        )}

        {quizData && !quizCompleted && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">
                Question {currentQuestionNumber}/{totalQuestions}
              </Badge>
              <Badge variant="secondary">
                {currentSection === 'mc' ? 'Choix Multiple' : 'Réponse Ouverte'}
              </Badge>
            </div>
            
            <Progress value={(currentQuestionNumber / totalQuestions) * 100} className="h-2" />

            {currentSection === 'mc' && quizData.multipleChoice[currentIndex] && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(quizData.multipleChoice[currentIndex].difficulty)}>
                      {getDifficultyLabel(quizData.multipleChoice[currentIndex].difficulty)}
                    </Badge>
                  </div>
                  <p className="text-lg font-medium mb-4">
                    {quizData.multipleChoice[currentIndex].question}
                  </p>
                  <div className="space-y-2">
                    {quizData.multipleChoice[currentIndex].options.map((option, idx) => {
                      const isCorrect = idx === quizData.multipleChoice[currentIndex].correctIndex;
                      const isSelected = selectedAnswer === idx;
                      
                      let className = "w-full text-left p-3 rounded-lg border transition-colors ";
                      if (showResult) {
                        if (isCorrect) {
                          className += "bg-green-50 border-green-500 text-green-800";
                        } else if (isSelected) {
                          className += "bg-red-50 border-red-500 text-red-800";
                        } else {
                          className += "bg-muted opacity-50";
                        }
                      } else {
                        className += isSelected 
                          ? "bg-primary/10 border-primary" 
                          : "hover:bg-muted";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleMCAnswer(idx)}
                          className={className}
                          disabled={showResult}
                        >
                          <div className="flex items-center gap-2">
                            {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {showResult && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Explication:</strong> {quizData.multipleChoice[currentIndex].explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentSection === 'open' && quizData.openEnded[currentIndex] && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(quizData.openEnded[currentIndex].difficulty)}>
                      {getDifficultyLabel(quizData.openEnded[currentIndex].difficulty)}
                    </Badge>
                  </div>
                  <p className="text-lg font-medium mb-4">
                    {quizData.openEnded[currentIndex].question}
                  </p>
                  <Textarea
                    value={openAnswer}
                    onChange={(e) => setOpenAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                    rows={4}
                    disabled={showResult}
                    className="mb-4"
                  />
                  {!showResult && (
                    <Button onClick={handleOpenSubmit} disabled={!openAnswer.trim()}>
                      Soumettre
                    </Button>
                  )}
                  {showResult && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Réponse suggérée:</strong> {quizData.openEnded[currentIndex].sampleAnswer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {showResult && (
              <div className="flex justify-end">
                <Button onClick={handleNext}>
                  {currentSection === 'open' && currentIndex === (quizData?.openEnded.length || 0) - 1
                    ? 'Voir les résultats'
                    : 'Suivant'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {quizCompleted && (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-2">Quiz terminé !</h3>
            <div className="space-y-2 mb-6">
              <p className="text-lg">
                Choix multiples: <strong>{score.mc}/{quizData?.multipleChoice.length}</strong>
              </p>
              <p className="text-lg">
                Questions ouvertes: <strong>{score.open}/{quizData?.openEnded.length}</strong>
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={generateQuiz}>
                Refaire le quiz
              </Button>
              <Button onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
