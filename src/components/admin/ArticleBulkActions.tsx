
import { useState } from "react";
import { ChevronDown, Trash2, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ArticleBulkActionsProps {
  selectedItems: string[];
  onClearSelection: () => void;
  onBulkPublish: (slugs: string[]) => void;
  onBulkDraft: (slugs: string[]) => void;
  onBulkDelete: (slugs: string[]) => void;
  isLoading: boolean;
}

const ArticleBulkActions = ({
  selectedItems,
  onClearSelection,
  onBulkPublish,
  onBulkDraft,
  onBulkDelete,
  isLoading
}: ArticleBulkActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (selectedItems.length === 0) return null;

  const handleBulkDelete = () => {
    onBulkDelete(selectedItems);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            เลือก {selectedItems.length} รายการ
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            ยกเลิกการเลือก
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isLoading}>
              การกระทำ
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onBulkPublish(selectedItems)}>
              <Eye className="h-4 w-4 mr-2" />
              เผยแพร่รายการที่เลือก
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkDraft(selectedItems)}>
              <FileText className="h-4 w-4 mr-2" />
              ย้ายไปแบบร่าง
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              ลบรายการที่เลือก
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบบทความทั้งหมด {selectedItems.length} รายการ? 
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ArticleBulkActions;
