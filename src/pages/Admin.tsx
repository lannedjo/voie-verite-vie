import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Home,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Menu,
          {/* Utilisateurs */}
          {currentPage === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Utilisateurs</h2>
              {users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((u) => (
                    <Card key={u.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-semibold">{u.full_name || u.email || u.id}</h3>
                            <p className="text-gray-400 text-sm">{u.email}</p>
                            <p className="text-gray-500 text-xs mt-1">Rôle: {u.role || 'membre'}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => console.log('TODO: promote/demote', u)}>
                              <Edit2 className="w-4 h-4 text-blue-400" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <p className="text-gray-400">Aucun utilisateur disponible ou accès refusé (RLS)</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'inscriptions', label: 'Inscriptions', icon: FileText },
  { id: 'paiements', label: 'Paiements', icon: DollarSign },
  { id: 'activites', label: 'Activités', icon: FileText },
  { id: 'galerie', label: 'Galerie', icon: FileText },
  { id: 'prieres', label: 'Prières', icon: MessageSquare },
  { id: 'pages', label: 'Pages Contenu', icon: BookOpen },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

interface Activity {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface PrayerRequest {
  id: string;
  author_name: string;
  email: string;
  title: string;
  content: string;
  is_approved: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface ActivityRegistration {
  id: string;
  activity_id: number;
  activity_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  registered_at: string;
  created_at: string;
}

interface PaymentRecord {
  id: string;
  activity_id: number;
  activity_title: string;
  email: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  reference_number: string;
  created_at: string;
  updated_at: string;
}

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAdmin, loading: isLoading, signOut } = useAuth();
  const { toast } = useToast();

  const currentPage = searchParams.get('page') || 'dashboard';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<ActivityRegistration[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Edit/Add States
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      try {
        const [{ data: registrationsData }, { data: paymentsData }, { data: activitiesData }, { data: galleryData }, { data: prayerData }] = await Promise.all([
          supabase.from<any>('activity_registrations').select('*'),
          supabase.from<any>('activity_payments').select('*'),
          supabase.from<any>('activities').select('*').order('order'),
          supabase.from<any>('gallery_items').select('*').order('order'),
          supabase.from<any>('prayer_requests').select('*'),
        ]);

        if (registrationsData) setRegistrations(registrationsData as ActivityRegistration[]);
        if (paymentsData) setPayments(paymentsData as PaymentRecord[]);
        if (activitiesData) setActivities(activitiesData as Activity[]);
        if (galleryData) setGallery(galleryData as GalleryItem[]);
        if (prayerData) setPrayerRequests(prayerData as PrayerRequest[]);
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to localStorage', err);

        const localPayments = localStorage.getItem('activity_payments');
        if (localPayments) {
          try {
            setPayments(JSON.parse(localPayments));
          } catch (e) {
            console.warn('Erreur parsing localStorage payments');
          }
        }

        const localActivities = localStorage.getItem('app_activities');
        if (localActivities) {
          try {
            setActivities(JSON.parse(localActivities));
          } catch (e) {
            console.warn('Erreur parsing activités');
          }
        }

        const localGallery = localStorage.getItem('app_gallery');
        if (localGallery) {
          try {
            setGallery(JSON.parse(localGallery));
          } catch (e) {
            console.warn('Erreur parsing galerie');
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({ title: 'Erreur', description: 'Erreur lors du chargement des données' });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({ title: 'Déconnecté' });
    navigate('/');
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    setEditingType(type);
    setFormData({ ...item });
  };

  const handleSave = async () => {
    try {
      if (editingType === 'activity') {
        try {
          if (editingItem?.id) {
            await supabase.from<any>('activities').update(formData).eq('id', editingItem.id);
          } else {
            await supabase.from<any>('activities').insert([formData]);
          }
          toast({ title: 'Activité enregistrée (Supabase)' });
        } catch (err) {
          let dataArray = activities;
          const index = dataArray.findIndex((item) => item.id === editingItem?.id);
          if (index > -1) dataArray[index] = formData;
          else dataArray = [...dataArray, { ...formData, id: Date.now().toString() }];
          setActivities(dataArray);
          localStorage.setItem('app_activities', JSON.stringify(dataArray));
          toast({ title: 'Activité enregistrée (local)' });
        }
      } else if (editingType === 'gallery') {
        try {
          if (editingItem?.id) {
            await supabase.from<any>('gallery_items').update(formData).eq('id', editingItem.id);
          } else {
            await supabase.from<any>('gallery_items').insert([formData]);
          }
          toast({ title: 'Image enregistrée (Supabase)' });
        } catch (err) {
          let dataArray = gallery;
          const index = dataArray.findIndex((item) => item.id === editingItem?.id);
          if (index > -1) dataArray[index] = formData;
          else dataArray = [...dataArray, { ...formData, id: Date.now().toString() }];
          setGallery(dataArray);
          localStorage.setItem('app_gallery', JSON.stringify(dataArray));
          toast({ title: 'Image enregistrée (local)' });
        }
      } else {
        return;
      }

      // refresh
      await loadAllData();
    } catch (error) {
      console.error('Erreur saving', error);
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder' });
    } finally {
      setEditingItem(null);
      setEditingType('');
      setFormData({} as any);
    }
  };

  const handleDelete = async (item: any, type: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer?')) return;

    try {
      switch (type) {
        case 'activity': {
          try {
            await supabase.from<any>('activities').delete().eq('id', item.id);
          } catch (err) {
            const dataArray = activities.filter((a) => a.id !== item.id);
            setActivities(dataArray);
            localStorage.setItem('app_activities', JSON.stringify(dataArray));
          }
          break;
        }
        case 'gallery': {
          try {
            await supabase.from<any>('gallery_items').delete().eq('id', item.id);
          } catch (err) {
            const dataArray = gallery.filter((g) => g.id !== item.id);
            setGallery(dataArray);
            localStorage.setItem('app_gallery', JSON.stringify(dataArray));
          }
          break;
        }
        case 'prayer': {
          await supabase.from<any>('prayer_requests').delete().eq('id', item.id);
          setPrayerRequests((prev) => prev.filter((p) => p.id !== item.id));
          break;
        }
        case 'inscription': {
          await supabase.from<any>('activity_registrations').delete().eq('id', item.id);
          setRegistrations((prev) => prev.filter((r) => r.id !== item.id));
          break;
        }
        case 'payment': {
          try {
            await supabase.from<any>('activity_payments').delete().eq('id', item.id);
            setPayments((prev) => prev.filter((p) => p.id !== item.id));
          } catch (err) {
            const dataArray = payments.filter((p) => p.id !== item.id);
          }

          // Try loading users/profiles (may require RLS/permissions)
          try {
            const { data: profiles } = await supabase.from<any>('profiles').select('*').order('created_at', { ascending: false });
            if (profiles) setUsers(profiles);
          } catch (err) {
            console.warn('Impossible de charger les profils (RLS/permissions?)', err);
          }
            setPayments(dataArray);
            localStorage.setItem('activity_payments', JSON.stringify(dataArray));
          }
          break;
        }
        default:
          return;
      }

      toast({ title: 'Supprimé avec succès' });
    } catch (error) {
      console.error('Erreur:', error);
      toast({ title: 'Erreur', description: String(error) });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <p className="text-red-400">Accès réservé aux administrateurs.</p>
            <Button onClick={() => navigate('/')} className="mt-4 w-full">
              Retourner
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-800 border-r border-gray-700 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">🛡️ Admin</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSearchParams({ page: item.id })}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-700 p-4 space-y-2">
          <p className="text-xs text-gray-400">Connecté:</p>
          <p className="text-sm text-white font-medium truncate">{user?.email}</p>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full gap-2 text-xs"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <Home className="w-4 h-4" />
            Retour à l'app
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Dashboard */}
          {currentPage === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Tableau de Bord</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Inscriptions</p>
                        <p className="text-3xl font-bold text-white mt-1">{registrations.length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Paiements</p>
                        <p className="text-3xl font-bold text-white mt-1">{payments.length}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Activités</p>
                        <p className="text-3xl font-bold text-white mt-1">{activities.length}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Galerie</p>
                        <p className="text-3xl font-bold text-white mt-1">{gallery.length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Utilisateurs */}
          {currentPage === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Utilisateurs</h2>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <p className="text-gray-400">Les utilisateurs sont gérés via Supabase Auth</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Inscriptions */}
          {currentPage === 'inscriptions' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Inscriptions aux Activités</h2>
              {registrations.length > 0 ? (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <Card key={reg.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">
                              {reg.first_name} {reg.last_name}
                            </h3>
                            <p className="text-gray-400 text-sm">{reg.email}</p>
                            <p className="text-gray-500 text-xs mt-1">{reg.activity_title}</p>
                            <p className="text-gray-500 text-xs mt-1">{reg.phone}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(reg, 'inscription')}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <p className="text-gray-400 text-center">Aucune inscription</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Paiements */}
          {currentPage === 'paiements' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Paiements</h2>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <Card key={payment.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{payment.activity_title}</h3>
                            <p className="text-gray-400 text-sm">{payment.email}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {payment.amount} {payment.currency}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Statut: <span className="text-yellow-400">{payment.status}</span>
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(payment, 'payment')}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <p className="text-gray-400 text-center">Aucun paiement</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Activités */}
          {currentPage === 'activites' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Activités</h2>
                <Button onClick={() => handleEdit({}, 'activity')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>

              {editingItem && editingType === 'activity' && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingItem.id ? 'Modifier' : 'Ajouter'} Activité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Titre"
                      value={formData.title || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Textarea
                      placeholder="Description"
                      value={formData.description || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      placeholder="Icône"
                      value={formData.icon || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Ordre"
                      value={formData.order || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingItem(null);
                          setEditingType('');
                        }}
                        variant="outline"
                      >
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <Card key={activity.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{activity.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(activity, 'activity')}
                            >
                              <Edit2 className="w-4 h-4 text-blue-400" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(activity, 'activity')}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <p className="text-gray-400 text-center">Aucune activité créée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Galerie */}
          {currentPage === 'galerie' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Galerie</h2>
                <Button onClick={() => handleEdit({}, 'gallery')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter Image
                </Button>
              </div>

              {editingItem && editingType === 'gallery' && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingItem.id ? 'Modifier' : 'Ajouter'} Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="URL de l'image"
                      value={formData.image_url || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      placeholder="Titre"
                      value={formData.title || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Textarea
                      placeholder="Description"
                      value={formData.description || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingItem(null);
                          setEditingType('');
                        }}
                        variant="outline"
                      >
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {gallery.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((item) => (
                    <Card key={item.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      )}
                      <CardContent className="pt-4">
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item, 'gallery')}
                          >
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(item, 'gallery')}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <p className="text-gray-400 text-center">Aucune image</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Prières */}
          {currentPage === 'prieres' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Demandes de Prière</h2>
              {prayerRequests.length > 0 ? (
                <div className="space-y-4">
                  {prayerRequests.map((prayer) => (
                    <Card key={prayer.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{prayer.title}</h3>
                            <p className="text-gray-400 text-sm">{prayer.author_name}</p>
                            <p className="text-gray-500 text-xs mt-1">{prayer.email}</p>
                            <p className="text-gray-300 text-sm mt-2">{prayer.content}</p>
                            <p className="text-gray-500 text-xs mt-2">
                              Approuvée: {prayer.is_approved ? '✅' : '❌'}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(prayer, 'prayer')}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <p className="text-gray-400 text-center">Aucune demande de prière</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Pages */}
          {currentPage === 'pages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Gestion des Pages</h2>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <p className="text-gray-400">
                    Les pages (Accueil, À Propos, FAQ) sont gérées via la table
                    <code className="text-gray-300">page_content</code> dans Supabase.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Paramètres */}
          {currentPage === 'parametres' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Paramètres Admin</h2>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <p className="text-gray-400">Paramètres admin</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
