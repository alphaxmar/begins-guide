
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface UserRoleDialogProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onRoleChange: (userId: string, newRole: 'user' | 'admin' | 'partner') => void;
}

const UserRoleDialog = ({ user, isOpen, onClose, onRoleChange }: UserRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'partner'>('user');

  const handleSave = () => {
    if (user && selectedRole) {
      onRoleChange(user.id, selectedRole);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เปลี่ยนสิทธิ์ผู้ใช้งาน</DialogTitle>
          <DialogDescription>
            เปลี่ยนสิทธิ์สำหรับ {user.full_name || user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">สิทธิ์ปัจจุบัน:</label>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">สิทธิ์ใหม่:</label>
            <Select value={selectedRole} onValueChange={(value: 'user' | 'admin' | 'partner') => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกสิทธิ์" />
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
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave}>
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleDialog;
