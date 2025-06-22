
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Info } from "lucide-react";

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
      console.log('Dialog opened for user:', user);
      setSelectedRole(user.role || 'user');
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    if (user && selectedRole && selectedRole !== user.role) {
      console.log('Dialog: Initiating role change:', { 
        userId: user.id, 
        currentRole: user.role,
        newRole: selectedRole 
      });
      onRoleChange(user.id, selectedRole);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!user) return null;

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'user': 'ผู้ใช้ทั่วไป',
      'partner': 'พาร์ทเนอร์',
      'vip': 'สมาชิก PRO', // Updated to PRO
      'admin': 'ผู้ดูแลระบบ'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const hasRoleChanged = selectedRole !== user.role;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>เปลี่ยนสิทธิ์ผู้ใช้งาน</DialogTitle>
          <DialogDescription>
            เปลี่ยนสิทธิ์การใช้งานสำหรับผู้ใช้คนนี้
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">ข้อมูลผู้ใช้</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">User ID:</span> {user.id}</p>
              <p><span className="font-medium">อีเมล:</span> {user.email}</p>
              <p><span className="font-medium">ชื่อ:</span> {user.full_name || 'ไม่ระบุ'}</p>
              <p><span className="font-medium">สิทธิ์ปัจจุบัน:</span> 
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {getRoleDisplayName(user.role)}
                </span>
              </p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              เลือกสิทธิ์ใหม่
            </label>
            <Select 
              value={selectedRole} 
              onValueChange={(value: 'user' | 'admin' | 'partner' | 'vip') => setSelectedRole(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
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

          {selectedRole === 'vip' && hasRoleChanged && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                การเปลี่ยนเป็นสมาชิก PRO จะสร้างสมาชิกภาพ PRO ให้ผู้ใช้คนนี้อัตโนมัติ 
                และเขาจะสามารถเข้าถึงเนื้อหาและคอร์สทั้งหมดได้
              </AlertDescription>
            </Alert>
          )}

          {hasRoleChanged && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                คุณกำลังจะเปลี่ยนสิทธิ์จาก "{getRoleDisplayName(user.role)}" 
                เป็น "{getRoleDisplayName(selectedRole)}"
              </AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                กำลังดำเนินการเปลี่ยนสิทธิ์ กรุณารอสักครู่...
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isLoading}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !hasRoleChanged}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              'บันทึกการเปลี่ยนแปลง'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleDialog;
