import React, { useRef, useState, useEffect } from 'react';
import { CVProfile, SectionSettings, TemplateId } from '@/types/cv';
import { TemplateAtsClassic } from './TemplateAtsClassic';
import { TemplateModernMinimal } from './TemplateModernMinimal';
import { TemplateProfessional } from './TemplateProfessional';
import { TemplateExecutive } from './TemplateExecutive';
import { TemplateTechnical } from './TemplateTechnical';
import { TemplateCreative } from './TemplateCreative';
import { TemplateAcademic } from './TemplateAcademic';

interface CVDocumentRendererProps {
  profile: CVProfile;
  settings: SectionSettings;
  templateId: TemplateId;
  zoom?: number;
  autoFit?: boolean;
  className?: string;
}

export const CVDocumentRenderer: React.FC<CVDocumentRendererProps> = ({
  profile,
  settings,
  templateId,
  zoom = 1,
  autoFit = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(850);
  const [contentHeight, setContentHeight] = useState<number>(1050);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
      if (contentRef.current) {
        const height = contentRef.current.offsetHeight || contentRef.current.scrollHeight || 1050;
        setContentHeight(height);
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [profile, settings, templateId]);

  // Base document width in pixels (standard A4 / Letter proportion)
  const baseWidth = 800;
  const paddingAllowance = 32;

  // Calculate effective scale
  let scaleFactor = zoom;
  if (autoFit && containerWidth < baseWidth + paddingAllowance) {
    // Automatically scale down to fit small viewports (mobile/tablet)
    const fitScale = Math.max(0.35, (containerWidth - paddingAllowance) / baseWidth);
    scaleFactor = Math.min(zoom, fitScale);
  }

  const renderTemplate = () => {
    switch (templateId) {
      case 'modern-minimal':
        return <TemplateModernMinimal profile={profile} settings={settings} />;
      case 'professional':
        return <TemplateProfessional profile={profile} settings={settings} />;
      case 'executive':
        return <TemplateExecutive profile={profile} settings={settings} />;
      case 'technical':
        return <TemplateTechnical profile={profile} settings={settings} />;
      case 'creative':
        return <TemplateCreative profile={profile} settings={settings} />;
      case 'academic':
        return <TemplateAcademic profile={profile} settings={settings} />;
      case 'ats-classic':
      default:
        return <TemplateAtsClassic profile={profile} settings={settings} />;
    }
  };

  const scaledWidth = Math.round(baseWidth * scaleFactor);
  const scaledHeight = Math.round(contentHeight * scaleFactor);

  return (
    <div
      ref={containerRef}
      className={`cv-renderer-container w-full flex justify-center items-start overflow-x-auto py-2 sm:py-4 ${className}`}
    >
      <div
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transition: 'width 0.15s ease-out, height 0.15s ease-out'
        }}
        className="relative shrink-0 studio-paper-shadow rounded-xs bg-white border border-slate-200/60"
      >
        <div
          ref={contentRef}
          style={{
            width: `${baseWidth}px`,
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top left'
          }}
          className="absolute top-0 left-0"
        >
          <div id="cv-printable-area">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
