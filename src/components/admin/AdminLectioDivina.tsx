import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Lightbulb, MessageCircle, Moon, Sun } from 'lucide-react';

export const AdminLectioDivina = () => {
  const steps = [
    {
      id: 1,
      name: 'Lectio',
      title: 'Lecture',
      description: 'Lire attentivement le texte biblique plusieurs fois, en prêtant attention à chaque mot.',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-700',
      tips: [
        'Lire lentement et à voix haute si possible',
        'Noter les mots qui attirent l\'attention',
        'Relire plusieurs fois le passage',
      ],
    },
    {
      id: 2,
      name: 'Meditatio',
      title: 'Méditation',
      description: 'Réfléchir sur le texte et chercher sa signification personnelle.',
      icon: Lightbulb,
      color: 'bg-yellow-500/10 text-yellow-700',
      tips: [
        'Se demander : "Que me dit ce texte ?"',
        'Relier le texte à sa vie personnelle',
        'Laisser le texte résonner en soi',
      ],
    },
    {
      id: 3,
      name: 'Oratio',
      title: 'Prière',
      description: 'Répondre à Dieu par la prière, en partageant ce que le texte a suscité.',
      icon: MessageCircle,
      color: 'bg-green-500/10 text-green-700',
      tips: [
        'Parler à Dieu avec ses propres mots',
        'Exprimer gratitude, demandes, louanges',
        'Écouter en silence',
      ],
    },
    {
      id: 4,
      name: 'Contemplatio',
      title: 'Contemplation',
      description: 'Reposer en présence de Dieu, au-delà des mots et des pensées.',
      icon: Heart,
      color: 'bg-purple-500/10 text-purple-700',
      tips: [
        'Rester simplement en présence de Dieu',
        'Lâcher prise sur les pensées',
        'Accueillir la paix intérieure',
      ],
    },
    {
      id: 5,
      name: 'Actio',
      title: 'Action',
      description: 'Mettre en pratique ce que la Parole a inspiré dans la vie quotidienne.',
      icon: Sun,
      color: 'bg-orange-500/10 text-orange-700',
      tips: [
        'Identifier une action concrète',
        'S\'engager à vivre la Parole',
        'Témoigner par ses actes',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Lectio Divina</h2>
        <p className="text-muted-foreground">Guide pour la lecture priante de la Parole de Dieu</p>
      </div>

      {/* Introduction */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Moon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Qu'est-ce que la Lectio Divina ?</h3>
              <p className="text-muted-foreground">
                La Lectio Divina (« lecture divine » en latin) est une pratique de prière contemplative 
                qui remonte aux premiers siècles du christianisme. C'est une méthode de lecture priante 
                de la Bible qui nous permet d'entrer en dialogue avec Dieu à travers sa Parole.
              </p>
              <p className="text-muted-foreground mt-2">
                Cette pratique ancestrale, développée par les moines bénédictins, comprend traditionnellement 
                quatre étapes principales, auxquelles on ajoute parfois une cinquième : l'action.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        <h3 className="text-xl font-playfair font-semibold text-primary">Les 5 étapes de la Lectio Divina</h3>
        
        <div className="grid gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Étape {step.id}</Badge>
                        <span className="text-sm text-muted-foreground italic">{step.name}</span>
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Conseils pratiques :</p>
                    <ul className="space-y-1">
                      {step.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Integration with reading program */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Intégration avec le programme de lecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            La Lectio Divina peut être pratiquée avec chaque lecture du programme annuel. 
            Nous encourageons les membres à :
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Pratiquer la Lectio Divina au moins une fois par semaine avec les lectures du programme</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Partager leurs réflexions dans les groupes de discussion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Noter leurs découvertes dans un journal spirituel</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>Participer aux défis de Lectio Divina communautaire</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};