import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/types';
import { Globe, ChevronDown, Check } from 'lucide-react';
import './LanguageSelector.css';

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-container" ref={dropdownRef}>
      <button
        className="lang-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change UI Language / भाषा बदला"
      >
        <Globe size={16} className="globe-icon" />
        <span className="lang-code-label">{currentOption.flag} {currentOption.name}</span>
        <ChevronDown size={14} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu glass-panel animate-fade-in">
          <div className="menu-header">
            <span>🌐 Select Language / भाषा निवडा</span>
          </div>
          <div className="menu-options">
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                className={`lang-option-btn ${language === item.code ? 'selected' : ''}`}
                onClick={() => handleSelect(item.code)}
              >
                <span className="flag">{item.flag}</span>
                <span className="name">{item.name}</span>
                {language === item.code && <Check size={16} className="check-icon" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
