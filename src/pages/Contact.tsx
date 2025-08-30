import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, MessageCircle, Heart, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactTypes = [
    { value: 'question', label: 'Question générale', icon: HelpCircle },
    { value: 'adhesion', label: 'Adhésion à l\'association', icon: Heart },
    { value: 'activite', label: 'Information sur les activités', icon: MessageCircle },
    { value: 'don', label: 'Don ou soutien financier', icon: Heart },
    { value: 'temoignage', label: 'Partage de témoignage', icon: MessageCircle },
    { value: 'autre', label: 'Autre', icon: Mail }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message envoyé avec succès !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        type: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'envoi",
        description: "Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                Contactez-nous
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Nous sommes là pour vous accompagner dans votre cheminement spirituel
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-elegant">
                    <CardHeader>
                      <CardTitle className="text-2xl font-playfair text-primary">
                        Envoyez-nous un message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Nom complet *
                            </label>
                            <Input
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
                              className="bg-background/50"
                              placeholder="Votre nom"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Email *
                            </label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                              className="bg-background/50"
                              placeholder="votre@email.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Type de demande *
                          </label>
                          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Sélectionnez le type de votre demande" />
                            </SelectTrigger>
                            <SelectContent>
                              {contactTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center space-x-2">
                                      <Icon className="w-4 h-4" />
                                      <span>{type.label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Sujet
                          </label>
                          <Input
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            className="bg-background/50"
                            placeholder="Résumé de votre message"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Message *
                          </label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            required
                            rows={6}
                            className="bg-background/50 resize-none"
                            placeholder="Décrivez votre demande, vos questions ou partagez votre témoignage..."
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full divine-glow"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Envoi en cours...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Send className="w-4 h-4" />
                              <span>Envoyer le message</span>
                            </div>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
                    <CardHeader>
                      <CardTitle className="text-xl font-playfair text-primary">
                        Informations de contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-peace rounded-full w-12 h-12 flex items-center justify-center shadow-glow">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary mb-1">Email</h3>
                          <p className="text-muted-foreground">contact@voie-verite-vie.org</p>
                          <p className="text-sm text-muted-foreground">Réponse sous 24-48h</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-peace rounded-full w-12 h-12 flex items-center justify-center shadow-glow">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary mb-1">Téléphone</h3>
                          <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                          <p className="text-sm text-muted-foreground">Lun-Ven 9h-17h</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-peace rounded-full w-12 h-12 flex items-center justify-center shadow-glow">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary mb-1">Adresse</h3>
                          <p className="text-muted-foreground">
                            123 Rue de la Paix<br />
                            75001 Paris, France
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
                    <CardHeader>
                      <CardTitle className="text-xl font-playfair text-primary">
                        Horaires d'accueil
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lundi - Vendredi</span>
                          <span className="font-medium text-primary">9h00 - 17h00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Samedi</span>
                          <span className="font-medium text-primary">10h00 - 16h00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimanche</span>
                          <span className="font-medium text-primary">Fermé</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Pour les urgences spirituelles, n'hésitez pas à nous contacter par email, 
                          nous vous répondrons rapidement.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
                    <CardHeader>
                      <CardTitle className="text-xl font-playfair text-primary">
                        Faire un don
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Soutenez notre mission spirituelle et nos actions communautaires.
                      </p>
                      <Button className="w-full divine-glow">
                        <Heart className="w-4 h-4 mr-2" />
                        Faire un don sécurisé
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;