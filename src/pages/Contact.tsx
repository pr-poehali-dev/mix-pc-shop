import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const CONTACT_API = 'https://functions.poehali.dev/4b1f1aa1-cefb-4e84-aa0a-c853b051b6b8';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(CONTACT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Сообщение отправлено!',
          description: 'Мы свяжемся с вами в ближайшее время.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение. Попробуйте позже.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Свяжитесь с нами</h1>
            <p className="text-xl text-muted-foreground">
              Есть вопросы? Мы всегда рады помочь!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon name="Phone" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Телефон</h3>
                    <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                    <p className="text-sm text-muted-foreground mt-1">Пн-Пт: 9:00 - 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon name="Mail" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">info@mixpc.ru</p>
                    <p className="text-sm text-muted-foreground mt-1">Ответим в течение 24 часов</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon name="MapPin" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Адрес</h3>
                    <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 1</p>
                    <p className="text-sm text-muted-foreground mt-1">Самовывоз доступен</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon name="Clock" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Режим работы</h3>
                    <p className="text-muted-foreground">Пн-Пт: 9:00 - 20:00</p>
                    <p className="text-muted-foreground">Сб-Вс: 10:00 - 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Задайте вопрос</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Ваше имя *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="ivan@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Тема обращения</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Вопрос по товару"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Сообщение *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    placeholder="Расскажите подробнее о вашем вопросе..."
                  />
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={18} className="mr-2" />
                      Отправить сообщение
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
