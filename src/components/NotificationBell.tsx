import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Notification {
  id: string;
  type: 'goal' | 'start' | 'end';
  text: string;
  time: string;
  sport: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'goal', text: 'Промес забил! Спартак 2–1 Зенит', time: '2 мин назад', sport: '⚽', read: false },
  { id: '2', type: 'goal', text: 'Капризов! ЦСКА 3–2 СКА (52\')', time: '8 мин назад', sport: '🏒', read: false },
  { id: '3', type: 'start', text: 'Матч начался: ЦСКА – УНИКС', time: '34 мин назад', sport: '🏀', read: true },
  { id: '4', type: 'end', text: 'Зенит 3–1 Краснодар. Матч завершён!', time: '2 ч назад', sport: '⚽', read: true },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(n => n.map(notif => ({ ...notif, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <Icon name="Bell" size={18} className="text-foreground" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 glass rounded-2xl border border-border shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h3 className="font-display text-lg">Уведомления</h3>
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              Прочитать все
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map(notif => (
              <div key={notif.id} className={`p-4 border-b border-border/30 last:border-0 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                <div className="flex gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{notif.sport}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {notif.text}
                    </p>
                    <span className="text-xs text-muted-foreground/70">{notif.time}</span>
                  </div>
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
