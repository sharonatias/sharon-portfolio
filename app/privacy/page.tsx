export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12">מדיניות פרטיות</h1>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. מבוא</h2>
            <p>
              אתר זה משתייך לשרון מושה אתיאס. אנחנו מחויבים להגן על פרטיותך ולהיות שקופים לגבי שימוש בנתונים שלך.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. אילו נתונים אנחנו אוספים?</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>מידע ניווט:</strong> כתובת IP, סוג דפדפן, דפים שביקרת בהם, זמן ביקור
              </li>
              <li>
                <strong>עוגיות:</strong> לצורך שיפור חוויית הגלישה ו-analytics בלבד
              </li>
              <li>
                <strong>נתונים שהנחת בטופסים:</strong> אם קיימים (אימייל, שם, וכו')
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. כיצד אנחנו משתמשים בנתונים?</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>שיפור חוויית הגלישה</li>
              <li>ניתוח סטטיסטי של תנועת המשתמשים</li>
              <li>אבטחה מפני התקפות</li>
              <li>שיפור ביצועי האתר</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. עוגיות (Cookies)</h2>
            <p className="mb-4">
              אנחנו משתמשים בעוגיות כדי:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>לזכור את העדפותיך</li>
              <li>לאסוף נתונים סטטיסטיים</li>
              <li>לשפר את ביצועי האתר</li>
            </ul>
            <p className="mt-4">
              אתה יכול לשלוט בעוגיות דרך הגדרות הדפדפן שלך או דרך הבאנר בתחתית העמוד.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. אבטחת הנתונים</h2>
            <p>
              אנחנו משתמשים בהצפנה (HTTPS) ובטכנולוגיות בטיחות מודרניות להגנה על נתונים שלך.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. קישורים לאתרים חיצוניים</h2>
            <p>
              אתר זה מכיל קישורים לאתרים חיצוניים. אנחנו לא אחראיים למדיניות הפרטיות של אתרים אחרים.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. זכויותיך</h2>
            <p className="mb-4">
              בהתאם לחוק הגנת הפרטיות תשל"א, יש לך את הזכויות הבאות:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>לדעת אילו נתונים אנחנו אוספים</li>
              <li>לבקש גישה לנתונים שלך</li>
              <li>לבקש מחיקת נתונים שלך</li>
              <li>לבקש תיקון של נתונים שגויים</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. יצירת קשר</h2>
            <p>
              אם יש לך שאלות לגבי מדיניות הפרטיות, צור איתנו קשר:
              <br />
              <strong>Email:</strong> sharonatias@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. עדכונים למדיניות זו</h2>
            <p>
              אנחנו עשויים לעדכן מדיניות זו מעת לעת. את השינויים ניידעך דרך עדכון תאריך בעמוד זה.
              <br />
              <strong>עודכן לאחרונה: 2026-08-25</strong>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
