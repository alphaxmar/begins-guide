
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface UserRoleDialogProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onRoleChange: (userId: string, newRole: 'user' | 'admin' | 'partner' | 'vip') => void;
  isLoading?: boolean;
}

const UserRoleDialog = ({ user, isOpen, onClose, onRoleChange, isLoading = false }: UserRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'partner' | 'vip'>('user');

  useEffect(() => {
    if (user && isOpen) {
      setSelectedRole(user.role || 'user');
    }
  }, [user, isOpen]);

  const handleSave = () => {
    if (user && selectedRole) {
      console.log('Saving user role change:', { userId: user.id, newRole: selectedRole });
      onRoleChange(user.id, selectedRole);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เปลี่ยนสิทธิ์ผู้ใช้งาน</DialogTitle>
          <DialogDescription>
            เปลี่ยนสิทธิ์สำหรับ {user.full_name || user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">ข้อมูลผู้ใช้:</label>
            <div className="text-sm text-muted-foreground">
              <p>ID: {user.id}</p>
              <p>อีเมล: {user.email}</p>
              <p>ชื่อ: {user.full_name || 'ไม่ระบุ'}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">สิทธิ์ปัจจุบัน:</label>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">สิทธิ์ใหม่:</label>
            <Select 
              value={selectedRole} 
              onValueChange={(value: 'user' | 'admin' | 'partner' | 'vip') => setSelectedRole(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสิทธิ์" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
                <SelectItem value="partner">พาร์ทเนอร์</SelectItem>
                <SelectItem value="vip">สมาชิก VIP</SelectItem>
                <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole === 'vip' && (
            <Alert>
              <AlertDescription>
                การเปลี่ยนเป็นสมาชิก VIP จะสร้างหรืออัปเดต VIP membership ให้อัตโนมัติ
              </AlertDescription>
            </Alert>
          )}

          {selectedRole !== user.role && (
            <Alert>
              <AlertDescription>
                คุณกำลังจะเปลี่ยนสิทธิ์จาก "{user.role}" เป็น "{selectedRole}"
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave} disabled={isLoading || selectedRole === user.role}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              'บันทึก'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleDialog;
