import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'tile' | 'list-item';
  fullWidth?: boolean;
  isLoading?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  selected = false,
  className = '',
  icon,
  subtitle,
  disabled,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg rounded-full px-8 py-3.5 text-lg font-bold uppercase tracking-wide",
    secondary: "bg-gray-800 text-white hover:bg-gray-900 shadow-sm rounded-lg px-6 py-3",
    outline: "bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-lg px-6 py-3 font-semibold",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-4 py-2",
    tile: `
      flex flex-col items-center justify-center text-center p-4 rounded-xl border-2 transition-all duration-200
      ${selected 
        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-md' 
        : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5'
      }
    `,
    'list-item': `
      w-full flex flex-row items-center justify-start p-5 rounded-2xl border-2 transition-all duration-200 mb-3 text-left group
      ${selected
        ? 'border-emerald-500 bg-emerald-50 shadow-md'
        : 'border-gray-100 bg-white shadow-sm hover:border-emerald-400 hover:shadow-md'
      }
    `
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        <>
          {variant === 'list-item' ? (
            <>
              {icon && (
                <div className={`mr-5 flex-shrink-0 ${selected ? 'text-emerald-600' : 'text-gray-800'}`}>
                  {icon}
                </div>
              )}
              <div className="flex-grow">
                <div className={`text-lg sm:text-xl font-bold ${selected ? 'text-emerald-800' : 'text-gray-800'}`}>
                  {children}
                </div>
                {subtitle && (
                  <div className="text-sm text-gray-500 font-medium mt-0.5">
                    {subtitle}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {icon && <span className="mb-3 text-3xl sm:text-4xl">{icon}</span>}
              <span className={variant === 'tile' ? 'text-lg sm:text-xl font-semibold' : ''}>{children}</span>
            </>
          )}
        </>
      )}
    </button>
  );
};