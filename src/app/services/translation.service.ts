import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>('he');
  private currentLangValue: string = 'he';

  constructor(private translate: TranslateService) {
    // Set Hebrew as default language
    translate.setDefaultLang('he');
    translate.use('he');

    // Get browser language
    const browserLang = translate.getBrowserLang();
    if (browserLang) {
      // Use Hebrew by default, allow English as fallback
      const langToUse = browserLang.match(/en|he/) ? browserLang : 'he';
      translate.use(langToUse);
      this.currentLang.next(langToUse);
      this.currentLangValue = langToUse;
    }

    // Subscribe to language changes
    this.currentLang.subscribe(lang => {
      this.currentLangValue = lang;
    });
  }

  getCurrentLang(): Observable<string> {
    return this.currentLang.asObservable();
  }

  getCurrentLangValue(): string {
    return this.currentLangValue;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.next(lang);
    this.currentLangValue = lang;
    // Update document direction based on language
    document.dir = lang === 'he' ? 'rtl' : 'ltr';
  }

  instant(key: string): string {
    return this.translate.instant(key);
  }
}
