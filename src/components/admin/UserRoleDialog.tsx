
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUpdateUserRole } from '@/hooks/useUsers';

interface UserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    role: 'user' | 'admin' | 'partner';
  } | null;
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'partner':
      return 'default';
    default:
      return 'secondary';
  }
};

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'admin':
      return 'ผู้ดูแลระบบ';
    case 'partner':
      return 'พาร์ทเนอร์';
    default:
      return 'ผู้ใช้ทั่วไป';
  }
};

const UserRoleDialog = ({ open, onOpenChange, user }: UserRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'partner'>(user?.role || 'user');
  const updateUserRoleMutation = useUpdateUserRole();

  const handleSave = () => {
    if (!user || selectedRole === user.role) {
      onOpenChange(false);
      return;
    }

    updateUserRoleMutation.mutate(
      { userId: user.id, newRole: selectedRole },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เปลี่ยนสิทธิ์ผู้ใช้</DialogTitle>
          <DialogDescription>
            เปลี่ยนระดับสิทธิ์การเข้าถึงระบบสำหรับผู้ใช้รายนี้
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">ข้อมูลผู้ใช้</h4>
            <div className="text-sm text-muted-foreground">
              <p><strong>ชื่อ:</strong> {user.full_name || 'ไม่ระบุ'}</p>
              <p><strong>อีเมล:</strong> {user.email}</p>
              <p><strong>สิทธิ์ปัจจุบัน:</strong> <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleDisplayName(user.role)}</Badge></p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">เปลี่ยนเป็นสิทธิ์</h4>
            <Select value={selectedRole} onValueChange={(value: 'user' | 'admin' | 'partner') => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
                <SelectItem value="partner">พาร์ทเนอร์</SelectItem>
                <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateUserRoleMutation.isPending || selectedRole === user.role}
          >
            {updateUserRoleMutation.isPending ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleDialog;
