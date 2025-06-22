
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Video, ExternalLink } from "lucide-react";
import { Cohort, LiveSession, useLiveSessionsByCohort } from "@/hooks/useCohorts";
import { format } from "date-fns";

interface CohortDashboardProps {
  cohort: Cohort;
  productTitle: string;
}

const CohortDashboard: React.FC<CohortDashboardProps> = ({ cohort, productTitle }) => {
  const { data: liveSessions, isLoading } = useLiveSessionsByCohort(cohort.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingSessions = liveSessions?.filter(session => 
    new Date(session.scheduled_at) > new Date()
  ) || [];

  const pastSessions = liveSessions?.filter(session => 
    new Date(session.scheduled_at) <= new Date()
  ) || [];

  return (
    <div className="space-y-6">
      {/* Cohort Info Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{productTitle}</CardTitle>
              <p className="text-lg text-muted-foreground mt-1">{cohort.name}</p>
              {cohort.description && (
                <p className="text-sm text-muted-foreground mt-2">{cohort.description}</p>
              )}
            </div>
            <Badge className={getStatusColor(cohort.status)}>
              {cohort.status === 'upcoming' ? 'กำลังจะเริ่ม' :
               cohort.status === 'active' ? 'กำลังดำเนินการ' :
               cohort.status === 'completed' ? 'เสร็จสิ้นแล้ว' : cohort.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">วันที่เริ่ม</p>
                <p className="text-muted-foreground">
                  {format(new Date(cohort.start_date), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">วันที่สิ้นสุด</p>
                <p className="text-muted-foreground">
                  {format(new Date(cohort.end_date), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">นักเรียน</p>
                <p className="text-muted-foreground">
                  {cohort.current_students}/{cohort.max_students} คน
                </p>
              </div>
            </div>
          </div>

          {cohort.community_link && (
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href={cohort.community_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  เข้าร่วมกลุ่มส่วนตัว
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Live Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Live Coaching Sessions ที่กำลังจะมาถึง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.scheduled_at), 'dd/MM/yyyy HH:mm')} น.
                      {session.duration_minutes && ` (${session.duration_minutes} นาที)`}
                    </p>
                    {session.description && (
                      <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
                    )}
                  </div>
                  {session.meeting_url && (
                    <Button asChild size="sm">
                      <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                        เข้าร่วม
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Sessions with Recordings */}
      {pastSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>บทเรียนที่ผ่านมา</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center p-3 border rounded-lg bg-muted/20">
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.scheduled_at), 'dd/MM/yyyy HH:mm')} น.
                    </p>
                    {session.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{session.notes}</p>
                    )}
                  </div>
                  {session.recording_url && (
                    <Button asChild size="sm" variant="outline">
                      <a href={session.recording_url} target="_blank" rel="noopener noreferrer">
                        ดูการบันทึก
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">กำลังโหลดข้อมูลเซสชัน...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CohortDashboard;
