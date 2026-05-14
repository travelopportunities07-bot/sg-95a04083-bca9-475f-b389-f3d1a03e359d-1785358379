import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, AlertCircle, Info, Clock, Trash2 } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "reminder";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "reminder",
      title: "Krankenversicherung läuft bald ab",
      message: "Ihre Krankenversicherung läuft in 30 Tagen ab. Bitte erneuern Sie diese rechtzeitig.",
      timestamp: "2024-05-14T10:30:00",
      read: false,
      actionUrl: "/documents"
    },
    {
      id: "2",
      type: "success",
      title: "Dokument genehmigt",
      message: "Ihr Reisepass wurde erfolgreich verifiziert und genehmigt.",
      timestamp: "2024-05-13T15:20:00",
      read: false
    },
    {
      id: "3",
      type: "warning",
      title: "Aufgabe fällig",
      message: "Die Aufgabe 'Bankkonto eröffnen' ist in 3 Tagen fällig.",
      timestamp: "2024-05-13T09:15:00",
      read: false,
      actionUrl: "/tasks"
    },
    {
      id: "4",
      type: "info",
      title: "Neuer FAQ-Eintrag",
      message: "Ein neuer FAQ-Eintrag zu Steuererklärungen wurde hinzugefügt.",
      timestamp: "2024-05-12T14:45:00",
      read: true,
      actionUrl: "/faq"
    }
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-[#10b981]" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-[#f59e0b]" />;
      case "info": return <Info className="w-5 h-5 text-[#3b82f6]" />;
      case "reminder": return <Clock className="w-5 h-5 text-[#8b5cf6]" />;
    }
  };

  const getGradient = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "from-[#0a1a10] to-[#0f2418]";
      case "warning": return "from-[#1a1200] to-[#201700]";
      case "info": return "from-[#0a0f1a] to-[#101828]";
      case "reminder": return "from-[#1a0a1a] to-[#2a1020]";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Topbar 
        title="Benachrichtigungen" 
        subtitle={`${unreadCount} ungelesene Nachrichten`}
        actions={
          unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] hover:border-[rgba(16,185,129,0.3)]"
            >
              Alle als gelesen markieren
            </Button>
          )
        }
      />

      <div className="p-7">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-[#161c21] border border-white/[0.06] p-1 mb-6">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Alle ({notifications.length})
            </TabsTrigger>
            <TabsTrigger 
              value="unread"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Ungelesen ({unreadCount})
            </TabsTrigger>
            <TabsTrigger 
              value="read"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Gelesen ({notifications.length - unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {notifications.length === 0 ? (
              <Card className="bg-[#161c21] border-white/[0.06] p-12 text-center">
                <Bell className="w-12 h-12 text-[#566878] mx-auto mb-4" />
                <p className="text-[#8fa3b3]">Keine Benachrichtigungen vorhanden</p>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`bg-[#161c21] border-white/[0.06] p-4 flex items-start gap-4 hover:border-white/[0.10] transition-all ${
                    !notification.read ? "border-l-[3px] border-l-[#10b981]" : ""
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradient(notification.type)} flex items-center justify-center flex-shrink-0`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-sm text-[#f0f4f8]">{notification.title}</h3>
                      {!notification.read && (
                        <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5 flex-shrink-0">
                          NEU
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#8fa3b3] mb-2">{notification.message}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#566878]">
                        {new Date(notification.timestamp).toLocaleString('de-DE')}
                      </span>
                      {notification.actionUrl && (
                        <Button
                          size="sm"
                          className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-7 px-3 text-xs"
                          onClick={() => window.location.href = notification.actionUrl!}
                        >
                          Anzeigen
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#566878] hover:text-[#10b981]"
                        onClick={() => markAsRead(notification.id)}
                        title="Als gelesen markieren"
                      >
                        <CheckCircle size={16} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-[#566878] hover:text-[#ef4444]"
                      onClick={() => deleteNotification(notification.id)}
                      title="Löschen"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3">
            {notifications.filter(n => !n.read).map((notification) => (
              <Card
                key={notification.id}
                className="bg-[#161c21] border-white/[0.06] border-l-[3px] border-l-[#10b981] p-4 flex items-start gap-4 hover:border-white/[0.10] transition-all"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradient(notification.type)} flex items-center justify-center flex-shrink-0`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm text-[#f0f4f8]">{notification.title}</h3>
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      NEU
                    </Badge>
                  </div>
                  <p className="text-xs text-[#8fa3b3] mb-2">{notification.message}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#566878]">
                      {new Date(notification.timestamp).toLocaleString('de-DE')}
                    </span>
                    {notification.actionUrl && (
                      <Button
                        size="sm"
                        className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-7 px-3 text-xs"
                        onClick={() => window.location.href = notification.actionUrl!}
                      >
                        Anzeigen
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#10b981]"
                    onClick={() => markAsRead(notification.id)}
                    title="Als gelesen markieren"
                  >
                    <CheckCircle size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#ef4444]"
                    onClick={() => deleteNotification(notification.id)}
                    title="Löschen"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="read" className="space-y-3">
            {notifications.filter(n => n.read).map((notification) => (
              <Card
                key={notification.id}
                className="bg-[#161c21] border-white/[0.06] p-4 flex items-start gap-4 hover:border-white/[0.10] transition-all opacity-70"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradient(notification.type)} flex items-center justify-center flex-shrink-0`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-1">{notification.title}</h3>
                  <p className="text-xs text-[#8fa3b3] mb-2">{notification.message}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#566878]">
                      {new Date(notification.timestamp).toLocaleString('de-DE')}
                    </span>
                    {notification.actionUrl && (
                      <Button
                        size="sm"
                        className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-7 px-3 text-xs"
                        onClick={() => window.location.href = notification.actionUrl!}
                      >
                        Anzeigen
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-[#566878] hover:text-[#ef4444]"
                  onClick={() => deleteNotification(notification.id)}
                  title="Löschen"
                >
                  <Trash2 size={16} />
                </Button>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}