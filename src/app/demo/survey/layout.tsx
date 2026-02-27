export default function DemoSurveyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var stored = localStorage.getItem('survey-theme');
                if (stored !== 'dark') {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {
                document.documentElement.classList.remove('dark');
              }
            })();
          `,
        }}
      />
      {children}
    </>
  );
}
