-- Seed activities into the activities table
INSERT INTO public.activities (title, description, icon, "order") VALUES
('La spiritualité au quotidien', 'Intégrer la prière, la méditation et la bienveillance dans la vie de tous les jours, en s''inspirant des Écritures.', '🙏', 1),
('Méditation et Pleine Conscience', 'Pratiquer la pleine conscience et la respiration pour calmer l''esprit et se rapprocher de Dieu.', '🧘', 2),
('Étude du livre de Matthieu', 'Exploration approfondie de l''Évangile selon saint Matthieu dans le contexte de l''année liturgique A.', '📖', 3),
('Collecte pour les plus démunis', 'Action caritative de Noël pour soutenir les familles en difficulté de notre communauté.', '❤️', 4),
('Groupe de discussion : Relations interpersonnelles', 'Explorer la communication, le pardon et l''amour fraternel, guidés par les valeurs bibliques.', '💬', 5),
('Atelier de calligraphie sacrée', 'Exprimer sa spiritualité à travers l''art de la calligraphie en transcrivant des versets bibliques.', '✏️', 6);

-- Seed gallery items into the gallery_items table
INSERT INTO public.gallery_items (title, description, image_url, "order") VALUES
('Retraite spirituelle d''Automne', 'Trois jours de silence, prière et méditation dans un cadre paisible.', '', 1),
('Conférence : La spiritualité au quotidien', 'Comment intégrer la prière et la méditation dans notre vie moderne.', '', 2),
('Atelier de calligraphie sacrée', 'Apprentissage de l''art de la calligraphie biblique.', '', 3),
('Collecte de Noël pour les démunis', 'Action caritative de distribution de repas et cadeaux.', '', 4),
('Étude biblique - Évangile de Matthieu', 'Exploration approfondie du premier Évangile.', '', 5),
('Assemblée générale annuelle', 'Rencontre annuelle des membres de l''association.', '', 6),
('Méditation guidée en pleine nature', 'Méditation contemplative dans la création divine.', '', 7),
('Groupe de prière hebdomadaire', 'Moment de prière communautaire et d''intercession.', '', 8);
