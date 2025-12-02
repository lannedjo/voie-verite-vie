import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Plus, Trash2, CheckCircle, HelpCircle, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple' | 'open';
  options?: string[];
  correctAnswer?: string;
  book?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  questions: QuizQuestion[];
}

export const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'Quiz sur la Genèse',
      description: 'Testez vos connaissances sur le premier livre de la Bible',
      category: 'Ancien Testament',
      difficulty: 'facile',
      questions: [
        {
          id: 'q1',
          question: 'Combien de jours Dieu a-t-il pris pour créer le monde ?',
          type: 'multiple',
          options: ['5 jours', '6 jours', '7 jours', '8 jours'],
          correctAnswer: '6 jours',
          book: 'Genèse',
        },
      ],
    },
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    category: '',
    difficulty: 'moyen',
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState<Partial<QuizQuestion>>({
    question: '',
    type: 'multiple',
    options: ['', '', '', ''],
    correctAnswer: '',
  });
  const { toast } = useToast();

  const handleCreateQuiz = () => {
    if (!newQuiz.title || !newQuiz.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const quiz: Quiz = {
      id: Date.now().toString(),
      title: newQuiz.title!,
      description: newQuiz.description!,
      category: newQuiz.category || 'Général',
      difficulty: newQuiz.difficulty as 'facile' | 'moyen' | 'difficile',
      questions: [],
    };

    setQuizzes(prev => [...prev, quiz]);
    setNewQuiz({ title: '', description: '', category: '', difficulty: 'moyen', questions: [] });
    setShowCreateForm(false);
    toast({
      title: "Quiz créé",
      description: "Le quiz a été créé avec succès",
    });
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Quiz supprimé",
      description: "Le quiz a été supprimé",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      facile: 'bg-green-500/10 text-green-700',
      moyen: 'bg-yellow-500/10 text-yellow-700',
      difficile: 'bg-red-500/10 text-red-700',
    };
    return colors[difficulty] || 'bg-gray-500/10 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Quiz bibliques</h2>
          <p className="text-muted-foreground">Créez et gérez des quiz pour tester les connaissances bibliques</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau quiz
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Créer un nouveau quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titre du quiz *</Label>
                <Input
                  placeholder="Ex: Quiz sur les Évangiles"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={newQuiz.category}
                  onValueChange={(value) => setNewQuiz(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ancien Testament">Ancien Testament</SelectItem>
                    <SelectItem value="Nouveau Testament">Nouveau Testament</SelectItem>
                    <SelectItem value="Évangiles">Évangiles</SelectItem>
                    <SelectItem value="Psaumes">Psaumes</SelectItem>
                    <SelectItem value="Prophètes">Prophètes</SelectItem>
                    <SelectItem value="Lettres de Paul">Lettres de Paul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Décrivez le contenu du quiz..."
                value={newQuiz.description}
                onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulté</Label>
              <Select
                value={newQuiz.difficulty}
                onValueChange={(value: 'facile' | 'moyen' | 'difficile') => 
                  setNewQuiz(prev => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facile">Facile</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateQuiz}>
                Créer le quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{quiz.category}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteQuiz(quiz.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {quiz.questions.length} questions
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && !showCreateForm && (
        <Card className="border-dashed">
          <CardContent className="text-center py-12">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun quiz créé</h3>
            <p className="text-muted-foreground mb-4">
              Créez votre premier quiz pour tester les connaissances bibliques des utilisateurs
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};