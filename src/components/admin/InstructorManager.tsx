
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/hooks/useUsers";
import { GraduationCap } from "lucide-react";

interface InstructorManagerProps {
  currentInstructorId?: string;
  onInstructorChange: (instructorId: string) => void;
}

const InstructorManager: React.FC<InstructorManagerProps> = ({ 
  currentInstructorId, 
  onInstructorChange 
}) => {
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return <div>กำลังโหลดข้อมูลผู้สอน...</div>;
  }

  const instructors = users?.filter(user => 
    user.role === 'admin' || user.role === 'partner'
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          ผู้สอน
        </CardTitle>
        <CardDescription>
          เลือกผู้สอนสำหรับคอร์สนี้
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="instructor">ผู้สอน</Label>
          <Select value={currentInstructorId || ""} onValueChange={onInstructorChange}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกผู้สอน" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  <div>
                    <div className="font-medium">{instructor.full_name || instructor.email}</div>
                    <div className="text-xs text-muted-foreground">{instructor.email}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {instructors.length === 0 && (
            <p className="text-sm text-muted-foreground">
              ไม่พบผู้สอนในระบบ กรุณาเพิ่มผู้ใช้ที่มีสิทธิ์ admin หรือ partner
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorManager;
