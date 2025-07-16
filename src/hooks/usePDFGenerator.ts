import { useState } from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { DreamlineSummary, Dreamline } from '@/hooks/useDreamlines';
import { toast } from '@/hooks/use-toast';

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const generatePDF = async (dreamlines: Dreamline[], summary: DreamlineSummary | null) => {
    if (!user || !summary) {
      toast({
        title: "ไม่สามารถสร้าง PDF ได้",
        description: "กรุณาล็อกอินและตรวจสอบข้อมูล",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      const userName = user.email?.split('@')[0] || 'User';
      const currentDate = new Date().toLocaleDateString('th-TH');
      
      // Decorative border
      pdf.setDrawColor(10, 34, 64);
      pdf.setLineWidth(2);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
      
      // Inner decorative border
      pdf.setLineWidth(0.5);
      pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);
      
      let yPos = 35;
      
      // Header - Certificate Style
      pdf.setFontSize(28);
      pdf.setTextColor(10, 34, 64);
      pdf.setFont('helvetica', 'bold');
      const headerText = 'LIFE BLUEPRINT CERTIFICATE';
      const headerWidth = pdf.getStringUnitWidth(headerText) * 28 * 0.352778;
      pdf.text(headerText, (pageWidth - headerWidth) / 2, yPos);
      
      yPos += 15;
      
      // Subtitle
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      const subtitleText = 'Your Personal Financial Freedom Target';
      const subtitleWidth = pdf.getStringUnitWidth(subtitleText) * 12 * 0.352778;
      pdf.text(subtitleText, (pageWidth - subtitleWidth) / 2, yPos);
      
      yPos += 25;
      
      // Name section
      pdf.setFontSize(16);
      pdf.setTextColor(10, 34, 64);
      pdf.setFont('helvetica', 'normal');
      const nameText = 'This certifies that';
      const nameWidth = pdf.getStringUnitWidth(nameText) * 16 * 0.352778;
      pdf.text(nameText, (pageWidth - nameWidth) / 2, yPos);
      
      yPos += 12;
      
      // User name - highlighted
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(10, 34, 64);
      const userNameWidth = pdf.getStringUnitWidth(userName) * 24 * 0.352778;
      pdf.text(userName, (pageWidth - userNameWidth) / 2, yPos);
      
      // Underline for name
      pdf.setDrawColor(10, 34, 64);
      pdf.setLineWidth(1);
      pdf.line((pageWidth - userNameWidth) / 2, yPos + 3, (pageWidth + userNameWidth) / 2, yPos + 3);
      
      yPos += 25;
      
      // Main content introduction
      pdf.setFontSize(14);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'normal');
      const introText = 'has successfully defined their personal Freedom Number';
      const introWidth = pdf.getStringUnitWidth(introText) * 14 * 0.352778;
      pdf.text(introText, (pageWidth - introWidth) / 2, yPos);
      
      yPos += 30;
      
      // Freedom Number - Main highlight
      pdf.setFillColor(10, 34, 64);
      pdf.rect(margin + 20, yPos - 15, contentWidth - 40, 50, 'F');
      
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      const freedomText = 'FREEDOM NUMBER';
      const freedomWidth = pdf.getStringUnitWidth(freedomText) * 16 * 0.352778;
      pdf.text(freedomText, (pageWidth - freedomWidth) / 2, yPos);
      
      yPos += 15;
      
      // Amount - Large and prominent
      pdf.setFontSize(36);
      pdf.setTextColor(255, 215, 7);
      pdf.setFont('helvetica', 'bold');
      const amountText = `${summary.target_monthly_income.toLocaleString()}`;
      const amountWidth = pdf.getStringUnitWidth(amountText) * 36 * 0.352778;
      pdf.text(amountText, (pageWidth - amountWidth) / 2, yPos);
      
      yPos += 12;
      
      // Per month text
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'normal');
      const perMonthText = 'Baht per month';
      const perMonthWidth = pdf.getStringUnitWidth(perMonthText) * 14 * 0.352778;
      pdf.text(perMonthText, (pageWidth - perMonthWidth) / 2, yPos);
      
      yPos += 35;
      
      // Summary section - Clean and minimal
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'normal');
      
      const summaryData = [
        { label: 'Goals for Having', value: summary.total_having },
        { label: 'Goals for Being', value: summary.total_being },
        { label: 'Goals for Doing', value: summary.total_doing }
      ];
      
      const startX = (pageWidth - 140) / 2;
      let summaryY = yPos;
      
      summaryData.forEach((item, index) => {
        const x = startX + (index * 50);
        
        // Category circle
        pdf.setFillColor(240, 240, 240);
        pdf.circle(x + 20, summaryY, 15, 'F');
        
        // Amount
        pdf.setFontSize(11);
        pdf.setTextColor(10, 34, 64);
        pdf.setFont('helvetica', 'bold');
        const valueText = `${(item.value / 1000).toFixed(0)}K`;
        const valueWidth = pdf.getStringUnitWidth(valueText) * 11 * 0.352778;
        pdf.text(valueText, x + 20 - (valueWidth / 2), summaryY + 2);
        
        // Label
        pdf.setFontSize(8);
        pdf.setTextColor(80, 80, 80);
        pdf.setFont('helvetica', 'normal');
        const labelWidth = pdf.getStringUnitWidth(item.label) * 8 * 0.352778;
        pdf.text(item.label, x + 20 - (labelWidth / 2), summaryY + 20);
      });
      
      yPos += 50;
      
      // Date and signature section
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      
      // Date
      const dateText = `Created on: ${currentDate}`;
      pdf.text(dateText, margin + 20, yPos);
      
      // Signature line
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth - margin - 80, yPos - 5, pageWidth - margin - 20, yPos - 5);
      pdf.text('Signature', pageWidth - margin - 70, yPos + 5);
      
      yPos += 25;
      
      // Footer message
      pdf.setFontSize(11);
      pdf.setTextColor(10, 34, 64);
      pdf.setFont('helvetica', 'italic');
      const footerText = 'Keep this visible daily as a reminder of your financial freedom goal';
      const footerWidth = pdf.getStringUnitWidth(footerText) * 11 * 0.352778;
      pdf.text(footerText, (pageWidth - footerWidth) / 2, yPos);
      
      yPos += 15;
      
      // Website
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      const websiteText = 'www.begins.guide';
      const websiteWidth = pdf.getStringUnitWidth(websiteText) * 10 * 0.352778;
      pdf.text(websiteText, (pageWidth - websiteWidth) / 2, yPos);
      
      // Save the PDF
      const fileName = `Life-Blueprint-Certificate-${userName}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "ดาวน์โหลดสำเร็จ",
        description: "ใบรับรอง Life Blueprint ของคุณได้ถูกดาวน์โหลดแล้ว",
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างไฟล์ PDF ได้",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating,
  };
};
