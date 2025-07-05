export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function getThemePreference() {
              if (typeof localStorage !== 'undefined') {
                const stored = localStorage.getItem('tms-theme');
                if (stored) {
                  return stored;
                }
              }
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            
            function setTheme(theme) {
              if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', systemTheme);
                document.documentElement.style.colorScheme = systemTheme;
              } else {
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.style.colorScheme = theme;
              }
            }
            
            const theme = getThemePreference();
            setTheme(theme);
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
              const currentTheme = localStorage.getItem('tms-theme');
              if (currentTheme === 'system' || !currentTheme) {
                setTheme('system');
              }
            });
          })();
        `,
      }}
    />
  );
}