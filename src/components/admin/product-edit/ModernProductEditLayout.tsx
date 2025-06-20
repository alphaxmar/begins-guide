
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

interface ModernProductEditLayoutProps {
  product: Tables<'products'>;
  children: React.ReactNode;
}

const ModernProductEditLayout = ({ product, children }: ModernProductEditLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/admin/products")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปรายการสินค้า
          </Button>
          <div className="text-white">
            <h1 className="text-lg font-semibold">แก้ไขสินค้า</h1>
            <p className="text-sm text-slate-400">{product.title}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModernProductEditLayout;
