import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Play, Image as ImageIcon, Filter, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import galleryRetreat from '@/assets/gallery-retreat.jpg';
import activityConference from '@/assets/activity-conference.jpg';
import activityBibleStudy from '@/assets/activity-bible-study.jpg';
import activityCreative from '@/assets/activity-creative.jpg';
import activityCommunity from '@/assets/activity-community.jpg';
import activityMeditation from '@/assets/activity-meditation.jpg';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tout' },
    { id: 'conferences', name: 'Conférences' },
    { id: 'retraites', name: 'Retraites' },
    { id: 'ateliers', name: 'Ateliers' },
    { id: 'communaute', name: 'Vie communautaire' },
    { id: 'projets', name: 'Projets' }
  ];

  // Charger les images de la galerie depuis localStorage
  useEffect(() => {
    const loadGallery = async () => {
      try {
        const { data } = await supabase.from<any>('gallery_items').select('*').order('order');
        if (data && data.length > 0) {
          setGalleryItems(data);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase gallery fetch failed, using local fallback', err);
      }

      try {
        // Charger depuis localStorage
        const localGallery = localStorage.getItem('app_gallery');
        let enrichedGallery = [];

        if (localGallery) {
          enrichedGallery = JSON.parse(localGallery).map((item: any, idx: number) => ({
            id: item.id || idx + 1,
            type: item.type || 'image',
            title: item.title,
            category: item.category || 'ateliers',
            date: item.date || new Date().toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            location: item.location || 'Lieu à définir',
            participants: item.participants || Math.floor(Math.random() * 100) + 10,
            description: item.description,
            thumbnail: [galleryRetreat, activityConference, activityBibleStudy, activityCreative, activityCommunity, activityMeditation][idx % 6],
            media: [galleryRetreat, activityConference, activityBibleStudy, activityCreative, activityCommunity, activityMeditation][idx % 6],
            duration: item.duration || null
          }));
        } else {
          // Utiliser les items par défaut si aucun en localStorage
          enrichedGallery = [
            {
              id: 1,
              type: 'image',
              title: 'Retraite spirituelle d\'Automne',
              category: 'retraites',
              date: '15 Oct 2024',
              location: 'Monastère Sainte-Marie',
              participants: 25,
              description: 'Trois jours de silence, prière et méditation dans un cadre paisible.',
              thumbnail: galleryRetreat,
              media: galleryRetreat
            },
            {
              id: 2,
              type: 'video',
              title: 'Conférence : La spiritualité au quotidien',
              category: 'conferences',
              date: '20 Nov 2024',
              location: 'Salle Saint-Paul',
              participants: 85,
              description: 'Comment intégrer la prière et la méditation dans notre vie moderne.',
              thumbnail: activityConference,
              media: activityConference,
              duration: '1h 15min'
            },
            {
              id: 3,
              type: 'image',
              title: 'Atelier de calligraphie sacrée',
              category: 'ateliers',
              date: '05 Nov 2024',
              location: 'Atelier d\'art communautaire',
              participants: 12,
              description: 'Apprentissage de l\'art de la calligraphie biblique.',
              thumbnail: activityCreative,
              media: activityCreative
            },
            {
              id: 4,
              type: 'video',
              title: 'Collecte de Noël pour les démunis',
              category: 'projets',
              date: '25 Dec 2024',
              location: 'Centre-ville',
              participants: 67,
              description: 'Action caritative de distribution de repas et cadeaux.',
              thumbnail: activityCommunity,
              media: activityCommunity,
              duration: '8min'
            },
            {
              id: 5,
              type: 'image',
              title: 'Étude biblique - Évangile de Matthieu',
              category: 'ateliers',
              date: '18 Nov 2024',
              location: 'Bibliothèque paroissiale',
              participants: 30,
              description: 'Exploration approfondie du premier Évangile.',
              thumbnail: activityBibleStudy,
              media: activityBibleStudy
            },
            {
              id: 6,
              type: 'image',
              title: 'Assemblée générale annuelle',
              category: 'communaute',
              date: '10 Jan 2024',
              location: 'Centre communautaire',
              participants: 120,
              description: 'Rencontre annuelle des membres de l\'association.',
              thumbnail: activityConference,
              media: activityConference
            },
            {
              id: 7,
              type: 'video',
              title: 'Méditation guidée en pleine nature',
              category: 'retraites',
              date: '22 Sep 2024',
              location: 'Forêt de Fontainebleau',
              participants: 18,
              description: 'Méditation contemplative dans la création divine.',
              thumbnail: activityMeditation,
              media: activityMeditation,
              duration: '45min'
            },
            {
              id: 8,
              type: 'image',
              title: 'Groupe de prière hebdomadaire',
              category: 'communaute',
              date: '28 Nov 2024',
              location: 'Chapelle Sainte-Thérèse',
              participants: 35,
              description: 'Moment de prière communautaire et d\'intercession.',
              thumbnail: activityConference,
              media: activityConference
            }
          ];
        }

        setGalleryItems(enrichedGallery);
      } catch (error) {
        console.error('Erreur chargement galerie:', error);
        setGalleryItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openModal = (item: any) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-8 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-4">
                Notre Galerie
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Revivez nos moments de partage, de prière et de croissance spirituelle
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-subtle border border-border/50 hover:shadow-elegant transition-all duration-300 group cursor-pointer animate-fade-in-up"
                    onClick={() => openModal(item)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative z-10 text-center">
                          {item.type === 'video' ? (
                            <div className="relative">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                <Play className="w-12 h-12 text-white drop-shadow-lg" />
                              </div>
                              {item.duration && (
                                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs">
                                  {item.duration}
                                </Badge>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          {item.type === 'video' ? 'Vidéo' : 'Photo'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-playfair font-semibold text-primary mb-3 leading-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          {new Date(item.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2 text-primary" />
                          {item.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-2 text-primary" />
                          {item.participants} participants
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-16">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-playfair font-semibold text-primary mb-2">
                    Aucun média trouvé
                  </h3>
                  <p className="text-muted-foreground">
                    Essayez de sélectionner une autre catégorie
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="max-w-4xl max-h-[90vh] w-full bg-card rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={closeModal}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <div className="h-96 relative overflow-hidden">
                  <img 
                    src={selectedMedia.media} 
                    alt={selectedMedia.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedMedia.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-4 inline-block">
                          <Play className="w-16 h-16 text-white" />
                        </div>
                        <p className="text-white text-lg font-semibold">Lecteur vidéo</p>
                        <p className="text-white/80">Durée: {selectedMedia.duration}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-playfair font-bold text-primary mb-3">
                  {selectedMedia.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {selectedMedia.description}
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <span>{new Date(selectedMedia.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{selectedMedia.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    <span>{selectedMedia.participants} participants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;