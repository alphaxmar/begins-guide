
import React from 'react';

interface EmailTemplateProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  title,
  subtitle,
  content,
  footer
}) => {
  const containerStyle = {
    fontFamily: 'Sarabun, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    lineHeight: '1.6'
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '30px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '20px'
  };

  const titleStyle = {
    color: '#2563eb',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  };

  const subtitleStyle = {
    color: '#64748b',
    fontSize: '16px',
    margin: '0'
  };

  const contentStyle = {
    marginBottom: '30px',
    fontSize: '16px',
    color: '#374151'
  };

  const footerStyle = {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '20px',
    textAlign: 'center' as const,
    fontSize: '14px',
    color: '#9ca3af'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>{title}</h1>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </div>
      
      <div style={contentStyle}>
        {content}
      </div>
      
      {footer && (
        <div style={footerStyle}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default EmailTemplate;
