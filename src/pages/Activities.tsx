import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Search, Filter, Heart, Book, Users2, Paintbrush, Globe, MessageSquare, HandHeart } from 'lucide-react';
import activityConference from '@/assets/activity-conference.jpg';
import activityMeditation from '@/assets/activity-meditation.jpg';
import activityBibleStudy from '@/assets/activity-bible-study.jpg';
import activityCommunity from '@/assets/activity-community.jpg';
import activityCreative from '@/assets/activity-creative.jpg';

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Toutes', icon: Globe },
    { id: 'conferences', name: 'Conférences', icon: Book },
    { id: 'bien-etre', name: 'Bien-être', icon: Heart },
    { id: 'etudes', name: 'Études bibliques', icon: Book },
    { id: 'projets', name: 'Projets communautaires', icon: HandHeart },
    { id: 'discussions', name: 'Groupes de discussion', icon: MessageSquare },
    { id: 'creativite', name: 'Activités créatives', icon: Paintbrush },
    { id: 'culturel', name: 'Événements culturels', icon: Users2 }
  ];

  const activities = [
    {
      id: 1,
      title: 'La spiritualité au quotidien',
      category: 'conferences',
      date: '15 Dec 2024',
      time: '14h00',
      location: 'Salle Saint-Paul',
      participants: 45,
      maxParticipants: 80,
      description: 'Intégrer la prière, la méditation et la bienveillance dans la vie de tous les jours, en s\'inspirant des Écritures.',
      image: activityConference,
      price: 'Gratuit',
      status: 'open'
    },
    {
      id: 2,
      title: 'Méditation et Pleine Conscience',
      category: 'bien-etre',
      date: '20 Dec 2024',
      time: '19h00',
      location: 'Jardin de la Paix',
      participants: 12,
      maxParticipants: 20,
      description: 'Pratiquer la pleine conscience et la respiration pour calmer l\'esprit et se rapprocher de Dieu.',
      image: activityMeditation,
      price: 'Gratuit',
      status: 'open'
    },
    {
      id: 3,
      title: 'Étude du livre de Matthieu',
      category: 'etudes',
      date: '22 Dec 2024',
      time: '16h30',
      location: 'Bibliothèque paroissiale',
      participants: 28,
      maxParticipants: 30,
      description: 'Exploration approfondie de l\'Évangile selon saint Matthieu dans le contexte de l\'année liturgique A.',
      image: activityBibleStudy,
      price: 'Gratuit',
      status: 'almost-full'
    },
    {
      id: 4,
      title: 'Collecte pour les plus démunis',
      category: 'projets',
      date: '25 Dec 2024',
      time: '10h00',
      location: 'Centre-ville',
      participants: 67,
      maxParticipants: 100,
      description: 'Action caritative de Noël pour soutenir les familles en difficulté de notre communauté.',
      image: activityCommunity,
      price: 'Gratuit',
      status: 'open'
    },
    {
      id: 5,
      title: 'Groupe de discussion : Relations interpersonnelles',
      category: 'discussions',
      date: '28 Dec 2024',
      time: '15h00',
      location: 'Salon communautaire',
      participants: 15,
      maxParticipants: 25,
      description: 'Explorer la communication, le pardon et l\'amour fraternel, guidés par les valeurs bibliques.',
      image: activityConference,
      price: 'Gratuit',
      status: 'open'
    },
    {
      id: 6,
      title: 'Atelier de calligraphie sacrée',
      category: 'creativite',
      date: '02 Jan 2025',
      time: '14h00',
      location: 'Atelier d\'art',
      participants: 8,
      maxParticipants: 15,
      description: 'Exprimer sa spiritualité à travers l\'art de la calligraphie en transcrivant des versets bibliques.',
      image: activityCreative,
      price: '15€',
      status: 'open'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'almost-full': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'full': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Places disponibles';
      case 'almost-full': return 'Presque complet';
      case 'full': return 'Complet';
      default: return 'Statut inconnu';
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6">
                Nos Activités
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Découvrez nos événements, ateliers et moments de partage spirituel
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher une activité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border/50"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 mb-8">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-subtle border border-border/50 hover:shadow-elegant transition-all duration-300 group animate-fade-in-up">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={activity.image} 
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 z-10">
                        <div className="flex items-center space-x-2 text-white">
                          <Calendar className="w-5 h-5" />
                          <p className="text-sm font-semibold">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-playfair font-semibold text-primary leading-tight">
                          {activity.title}
                        </h3>
                        <Badge className={getStatusColor(activity.status)}>
                          {getStatusText(activity.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {activity.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          {activity.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2 text-primary" />
                          {activity.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-2 text-primary" />
                          {activity.participants}/{activity.maxParticipants} participants
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-primary">
                          {activity.price}
                        </span>
                        <Button 
                          size="sm" 
                          className="divine-glow"
                          disabled={activity.status === 'full'}
                        >
                          {activity.status === 'full' ? 'Complet' : 'S\'inscrire'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredActivities.length === 0 && (
                <div className="text-center py-16">
                  <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-playfair font-semibold text-primary mb-2">
                    Aucune activité trouvée
                  </h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Activities;