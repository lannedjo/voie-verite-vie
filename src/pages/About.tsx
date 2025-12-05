import { memo } from 'react';
import Navigation from '@/components/Navigation';
import { Cross, Heart, Book, Users, Calendar, Target, GraduationCap, Briefcase, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About = memo(() => {
  const timeline = [
    { year: '2024', event: 'Fondation de l\'association 3V', description: 'Création d\'un sanctuaire spirituel' },
    { year: '2024', event: 'Premiers événements', description: 'Lancement des conférences et ateliers' },
    { year: '2025', event: 'Programme de lecture biblique', description: 'Cycle annuel de 354 jours' },
  ];

  const values = [
    {
      icon: Cross,
      title: 'Voie',
      verse: 'Jean 14:6',
      description: 'Le chemin tracé par Jésus-Christ pour marcher dans ses pas et embrasser ses enseignements d\'amour et de salut.'
    },
    {
      icon: Book,
      title: 'Vérité',
      verse: 'Jean 8:32',
      description: 'La lumière révélée par Jésus, vérité absolue et libératrice qui nous affranchit des illusions du monde.'
    },
    {
      icon: Heart,
      title: 'Vie',
      verse: 'Jean 10:10',
      description: 'L\'abondance spirituelle offerte par le Christ, une plénitude emplie de joie, de paix et de communion avec Dieu.'
    }
  ];

  const founder = {
    name: 'AHOUFACK Dylanne Baudouin',
    title: 'Fondateur & Promoteur de VOIE, VÉRITÉ, VIE',
    birthDate: '14 septembre 2001',
    birthPlace: 'Fossong-Wentcheng, Cameroun',
    email: 'ahdybau@gmail.com',
    phones: ['+237 698 95 25 26', '+237 698 29 00 77'],
    address: 'Cité Cicam, Douala, Cameroun',
    education: [
      { degree: 'Étudiant en 3ème année', institution: 'ECATHED - École Cathédrale de Théologie pour les laïcs de l\'Archidiocèse de Douala', year: 'Depuis 2024' },
      { degree: 'CILS B2 - Certificazione di Italiano come Lingua Straniera', institution: 'CLID, Douala', year: '2022' },
      { degree: 'Licence Professionnelle en Génie Logiciel', institution: 'IUG - Institut Universitaire du Golf de Guinée', year: '2021' },
      { degree: 'Licence Académique en Mathématiques', institution: 'Université de Douala', year: '2021' },
      { degree: 'BTS en Génie Logiciel', institution: 'ISTG-AC, Douala', year: '2020' },
    ],
    experience: [
      { role: 'Chef des départements Mathématiques et Informatique', company: 'Plateforme EXAM-PREP', since: '2023' },
      { role: 'Enseignant d\'Informatique', company: 'Collège Catholique Saint Nicolas & Collège BAHO', since: '2023' },
      { role: 'Responsable Informatique et Communication', company: 'ONG GEN Cameroon & Youth Business Cameroon', since: '2023' },
      { role: 'Formateur', company: 'PI Startup (Progress Intelligent Startup)', since: '2021' },
      { role: 'Présentateur et Chroniqueur', company: 'Radio et Télé catholique VERITAS - Émission Canal Campus', since: '2022' },
    ],
    skills: ['Enseignement', 'Développement d\'applications', 'Community Management', 'Conception & Design', 'Secrétariat Bureautique', 'Formation'],
    languages: ['Français', 'Anglais', 'Italien', 'Yemba'],
    qualities: ['Courageux', 'Discipliné', 'Rigoureux', 'Ponctuel', 'Adaptation facile'],
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-8 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-playfair font-bold text-primary mb-4">
                À propos de 3V
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Un sanctuaire spirituel, un phare lumineux guidant les âmes dans un monde en quête de sens
              </p>
            </div>
          </div>
        </section>

        {/* Préambule */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-elegant border border-border/50">
                <div className="flex items-center mb-6">
                  <Cross className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl md:text-2xl font-playfair font-semibold text-primary">
                    Préambule
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                    Fondée le 1er janvier 2024, l'association Voie, Vérité, Vie (3V) se veut bien plus qu'une simple organisation : 
                    elle est un sanctuaire spirituel, un phare lumineux guidant les âmes dans un monde en quête de sens.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                    Ancrée dans les principes intemporels de la foi chrétienne, 3V se dresse comme un rempart face aux tempêtes 
                    de la dépravation morale et des dérives contre nature qui assaillent notre société, en particulier la jeunesse.
                  </p>
                  <div className="bg-gradient-peace/10 rounded-lg p-4 my-6">
                    <blockquote className="text-center italic text-base md:text-lg">
                      "Je suis le chemin, la vérité et la vie. Nul ne vient au Père que par moi."
                      <cite className="block mt-2 text-primary font-semibold">— Jean 14:6</cite>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs Fondamentales */}
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary text-center mb-10">
                Pourquoi Voie, Vérité, Vie ?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="bg-gradient-peace rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-playfair font-semibold text-primary mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-primary/80 font-semibold mb-3">
                        {value.verse}
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary text-center mb-8">
                Le Fondateur
              </h2>
              
              <Card className="mb-6">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-peace rounded-full flex items-center justify-center mx-auto md:mx-0">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <CardTitle className="text-xl md:text-2xl font-playfair text-primary">
                        {founder.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">{founder.title}</p>
                      <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                        <Badge variant="secondary">
                          <Calendar className="w-3 h-3 mr-1" />
                          {founder.birthDate}
                        </Badge>
                        <Badge variant="secondary">
                          <MapPin className="w-3 h-3 mr-1" />
                          {founder.birthPlace}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                    <a href={`mailto:${founder.email}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Mail className="w-4 h-4" /> {founder.email}
                    </a>
                    {founder.phones.map((phone, i) => (
                      <a key={i} href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Phone className="w-4 h-4" /> {phone}
                      </a>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm italic text-center md:text-left">
                    "Jeune Entrepreneur; enseignant; Concepteur Designer; Community Manager; Développeur d'applications; Formateur... 
                    sont les différentes casquettes qui définissent ma modeste personne dans le domaine Informatique."
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Education */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Formation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {founder.education.map((edu, i) => (
                      <div key={i} className="border-l-2 border-primary/30 pl-3">
                        <p className="font-medium text-sm">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">{edu.institution}</p>
                        <Badge variant="outline" className="mt-1 text-xs">{edu.year}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Expériences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {founder.experience.map((exp, i) => (
                      <div key={i} className="border-l-2 border-primary/30 pl-3">
                        <p className="font-medium text-sm">{exp.role}</p>
                        <p className="text-xs text-muted-foreground">{exp.company}</p>
                        <Badge variant="outline" className="mt-1 text-xs">Depuis {exp.since}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {/* Skills */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Compétences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {founder.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Langues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {founder.languages.map((lang, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{lang}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Qualities */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Qualités</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {founder.qualities.map((q, i) => (
                        <Badge key={i} className="text-xs bg-primary/10 text-primary">{q}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary text-center mb-10">
                Notre Histoire
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-peace"></div>
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start mb-8 last:mb-0">
                    <div className="w-8 h-8 bg-gradient-peace rounded-full flex items-center justify-center relative z-10 shadow-glow">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-6">
                      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 shadow-subtle border border-border/50">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {item.year}
                        </span>
                        <h3 className="text-base font-playfair font-semibold text-primary mt-2 mb-1">
                          {item.event}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Objectifs */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary text-center mb-10">
                Nos Objectifs
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Offrir un refuge spirituel et moral aux jeunes confrontés aux défis de la société moderne',
                  'Éduquer et sensibiliser la jeunesse aux principes moraux et spirituels de la foi chrétienne',
                  'Combattre les influences néfastes contraires aux enseignements bibliques',
                  'Promouvoir un mode de vie sain et équilibré, fondé sur les valeurs évangéliques',
                  'Former des leaders chrétiens, agents de transformation dans leurs communautés',
                  'Établir des partenariats avec des organisations religieuses et communautaires'
                ].map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <Target className="w-5 h-5 text-primary mt-0.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {objective}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});

About.displayName = 'About';

export default About;
